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
export function formatBriefTimestamp(
  isoString: string,
  now: Date = new Date(),
): string {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) {
    return ''
  }

  const locale = getLocale()
  const dayDiff = startOfDay(now) - startOfDay(d)
  const daysAgo = Math.round(dayDiff / 86_400_000)

  if (daysAgo === 0) {
    return getFormatterSameDay().format(d)
  }

  if (daysAgo > 0 && daysAgo < 7) {
    return getFormatterWithinWeek().format(d)
  }

  return getFormatterOlder().format(d)
}

// Cache formatters to avoid expensive Intl.DateTimeFormat instantiation on every call
let formatterSameDay: Intl.DateTimeFormat | null = null
let formatterWithinWeek: Intl.DateTimeFormat | null = null
let formatterOlder: Intl.DateTimeFormat | null = null

function getFormatterSameDay(): Intl.DateTimeFormat {
  if (!formatterSameDay) {
    formatterSameDay = new Intl.DateTimeFormat(getLocale(), {
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  return formatterSameDay
}

function getFormatterWithinWeek(): Intl.DateTimeFormat {
  if (!formatterWithinWeek) {
    formatterWithinWeek = new Intl.DateTimeFormat(getLocale(), {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  return formatterWithinWeek
}

function getFormatterOlder(): Intl.DateTimeFormat {
  if (!formatterOlder) {
    formatterOlder = new Intl.DateTimeFormat(getLocale(), {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  return formatterOlder
}

// Cache the parsed locale since environment variables rarely change at runtime,
// and validating the tag using new Intl.DateTimeFormat is very expensive.
let cachedLocale: string | undefined | null = null

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
    return cachedLocale
  }
  // Strip codeset (.UTF-8) and modifier (@euro), replace _ with -
  const base = raw.split('.')[0]!.split('@')[0]!
  if (!base) {
    cachedLocale = undefined
    return cachedLocale
  }
  const tag = base.replaceAll('_', '-')
  // Validate by trying to construct an Intl locale — invalid tags throw
  try {
    new Intl.DateTimeFormat(tag)
    cachedLocale = tag
  } catch {
    cachedLocale = undefined
  }
  return cachedLocale
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}
