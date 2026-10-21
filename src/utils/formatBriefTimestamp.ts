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
let cachedLocale: string | undefined | null = null
function getLocaleCached(): string | undefined {
  if (cachedLocale === null) {
    cachedLocale = getLocale() ?? undefined
  }
  return cachedLocale
}

let formatters: {
  sameDay: Intl.DateTimeFormat
  recent: Intl.DateTimeFormat
  older: Intl.DateTimeFormat
} | null = null

function getFormatters() {
  if (!formatters) {
    const locale = getLocaleCached()
    formatters = {
      sameDay: new Intl.DateTimeFormat(locale, {
        hour: 'numeric',
        minute: '2-digit',
      }),
      recent: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
      }),
      older: new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    }
  }
  return formatters
}

export function formatBriefTimestamp(
  isoString: string,
  now: Date = new Date(),
): string {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) {
    return ''
  }

  const dayDiff = startOfDay(now) - startOfDay(d)
  const daysAgo = Math.round(dayDiff / 86_400_000)

  const fms = getFormatters()

  if (daysAgo === 0) {
    return fms.sameDay.format(d)
  }

  if (daysAgo > 0 && daysAgo < 7) {
    return fms.recent.format(d)
  }

  return fms.older.format(d)
}

/**
 * Derive a BCP 47 locale tag from POSIX env vars.
 * LC_ALL > LC_TIME > LANG, falls back to undefined (system default).
 * Converts POSIX format (en_GB.UTF-8) to BCP 47 (en-GB).
 */
function getLocale(): string | undefined {
  const raw =
    process.env.LC_ALL || process.env.LC_TIME || process.env.LANG || ''
  if (!raw || raw === 'C' || raw === 'POSIX') {
    return undefined
  }
  // Strip codeset (.UTF-8) and modifier (@euro), replace _ with -
  const base = raw.split('.')[0]!.split('@')[0]!
  if (!base) {
    return undefined
  }
  const tag = base.replaceAll('_', '-')
  // Validate by trying to construct an Intl locale — invalid tags throw
  try {
    new Intl.DateTimeFormat(tag)
    return tag
  } catch {
    return undefined
  }
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}
