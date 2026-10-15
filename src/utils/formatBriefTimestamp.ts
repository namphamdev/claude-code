/**
 * Format an ISO timestamp for the brief/chat message label line.
 *
 * Display scales with age (like a messaging app):
 *   - same day:      "1:30 PM" or "13:30" (locale-dependent)
 *   - within 6 days: "Sunday, 4:15 PM" (locale-dependent)
 *   - older:         "Sunday, Feb 20, 4:30 PM" (locale-dependent)
 *
 * Respects POSIX locale env vars (LC_ALL > LC_TIME > LANG) for time format
 * (12h/24h), weekday names, month names, and overall structure.
 * Bun/V8's `toLocaleString(undefined)` ignores these on macOS, so we
 * convert them to BCP 47 tags ourselves.
 *
 * `now` is injectable for tests.
 */

// Cache formatting instances keyed by locale to avoid expensive Intl object creation on every call
const localeCache = new Map<
  string | undefined,
  {
    timeOnly: Intl.DateTimeFormat
    weekdayTime: Intl.DateTimeFormat
    full: Intl.DateTimeFormat
  }
>()

function getFormatters(locale: string | undefined) {
  let formatters = localeCache.get(locale)
  if (!formatters) {
    formatters = {
      timeOnly: new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }),
      weekdayTime: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
      }),
      full: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    }
    localeCache.set(locale, formatters)
  }
  return formatters
}

// System locale is constant for the process lifetime
let cachedLocale: string | undefined | null = null

export function formatBriefTimestamp(
  isoString: string,
  now: Date = new Date(),
): string {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) {
    return ''
  }

  const locale = getLocale()
  const formatters = getFormatters(locale)
  const dayDiff = startOfDay(now) - startOfDay(d)
  const daysAgo = Math.round(dayDiff / 86_400_000)

  if (daysAgo === 0) {
    return formatters.timeOnly.format(d)
  }

  if (daysAgo > 0 && daysAgo < 7) {
    // In some locales/engines, weekday + time in a single formatter might lack punctuation,
    // but preserving the original options passed to toLocaleString for consistency.
    return formatters.weekdayTime.format(d)
  }

  return formatters.full.format(d)
}

/**
 * Derive a BCP 47 locale tag from POSIX env vars.
 * LC_ALL > LC_TIME > LANG, falls back to undefined (system default).
 * Converts POSIX format (en_GB.UTF-8) to BCP 47 (en-GB).
 */
function getLocale(): string | undefined {
  if (cachedLocale !== null) {
    return cachedLocale
  }

  const raw =
    process.env.LC_ALL || process.env.LC_TIME || process.env.LANG || ''
  if (!raw || raw === 'C' || raw === 'POSIX') {
    cachedLocale = undefined
    return undefined
  }
  // Strip codeset (.UTF-8) and modifier (@euro), replace _ with -
  const base = raw.split('.')[0]!.split('@')[0]!
  if (!base) {
    cachedLocale = undefined
    return undefined
  }
  const tag = base.replaceAll('_', '-')
  // Validate by trying to construct an Intl locale — invalid tags throw
  try {
    new Intl.DateTimeFormat(tag)
    cachedLocale = tag
    return tag
  } catch {
    cachedLocale = undefined
    return undefined
  }
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}
