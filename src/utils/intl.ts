/**
 * Shared Intl object instances with lazy initialization.
 *
 * Intl constructors are expensive (~0.05-0.1ms each), so we cache instances
 * for reuse across the codebase instead of creating new ones each time.
 * Lazy initialization ensures we only pay the cost when actually needed.
 */

// Segmenters for Unicode text processing (lazily initialized)
let graphemeSegmenter: Intl.Segmenter | null = null
let wordSegmenter: Intl.Segmenter | null = null

export function getGraphemeSegmenter(): Intl.Segmenter {
  if (!graphemeSegmenter) {
    graphemeSegmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    })
  }
  return graphemeSegmenter
}

/**
 * Extract the first grapheme cluster from a string.
 * Returns '' for empty strings.
 */
export function firstGrapheme(text: string): string {
  if (!text) return ''
  const segments = getGraphemeSegmenter().segment(text)
  const first = segments[Symbol.iterator]().next().value
  return first?.segment ?? ''
}

/**
 * Extract the last grapheme cluster from a string.
 * Returns '' for empty strings.
 */
export function lastGrapheme(text: string): string {
  if (!text) return ''
  let last = ''
  for (const { segment } of getGraphemeSegmenter().segment(text)) {
    last = segment
  }
  return last
}

export function getWordSegmenter(): Intl.Segmenter {
  if (!wordSegmenter) {
    wordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
  }
  return wordSegmenter
}

// RelativeTimeFormat cache (keyed by style:numeric)
const rtfCache = new Map<string, Intl.RelativeTimeFormat>()

export function getRelativeTimeFormat(
  style: 'long' | 'short' | 'narrow',
  numeric: 'always' | 'auto',
): Intl.RelativeTimeFormat {
  const key = `${style}:${numeric}`
  let rtf = rtfCache.get(key)
  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat('en', { style, numeric })
    rtfCache.set(key, rtf)
  }
  return rtf
}

// Timezone is constant for the process lifetime
let cachedTimeZone: string | null = null

export function getTimeZone(): string {
  if (!cachedTimeZone) {
    cachedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  return cachedTimeZone
}

// System locale language subtag (e.g. 'en', 'ja') is constant for the process
// lifetime. null = not yet computed; undefined = computed but unavailable (so
// a stripped-ICU environment fails once instead of retrying on every call).
let cachedSystemLocaleLanguage: string | undefined | null = null

export function getSystemLocaleLanguage(): string | undefined {
  if (cachedSystemLocaleLanguage === null) {
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale
      cachedSystemLocaleLanguage = new Intl.Locale(locale).language
    } catch {
      cachedSystemLocaleLanguage = undefined
    }
  }
  return cachedSystemLocaleLanguage
}

// DateTimeFormat cache (keyed by locale and options)
const dtfCache = new Map<string, Intl.DateTimeFormat>()

export function getDateTimeFormat(
  locale?: string | string[],
  options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const localeKey = Array.isArray(locale) ? locale.join(',') : (locale || 'default')
  // We can use JSON.stringify because the options object is typically a literal with a consistent key order
  // in the codebase, or we can sort the keys if we want to be absolutely sure. For now, JSON.stringify
  // is sufficient for the limited number of options objects we use.
  const optionsKey = options ? JSON.stringify(options, Object.keys(options).sort()) : 'undefined'
  const key = `${localeKey}:${optionsKey}`

  let dtf = dtfCache.get(key)
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locale, options)
    dtfCache.set(key, dtf)
  }
  return dtf
}

let cachedSystemLocale: string | undefined | null = null

export function getSystemLocale(): string | undefined {
  if (cachedSystemLocale !== null) {
    return cachedSystemLocale
  }

  const raw =
    process.env.LC_ALL || process.env.LC_TIME || process.env.LANG || ''
  if (!raw || raw === 'C' || raw === 'POSIX') {
    cachedSystemLocale = undefined
    return cachedSystemLocale
  }

  // Strip codeset (.UTF-8) and modifier (@euro), replace _ with -
  const base = raw.split('.')[0]!.split('@')[0]!
  if (!base) {
    cachedSystemLocale = undefined
    return cachedSystemLocale
  }

  const tag = base.replaceAll('_', '-')
  // Validate by trying to construct an Intl locale — invalid tags throw
  try {
    new Intl.DateTimeFormat(tag)
    cachedSystemLocale = tag
  } catch {
    cachedSystemLocale = undefined
  }

  return cachedSystemLocale
}
