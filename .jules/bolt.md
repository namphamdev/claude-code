## 2023-10-27 - Caching Intl.DateTimeFormat
**Learning:** Native Date methods like `toLocaleString()` and `toLocaleTimeString()` are extremely slow because they internally instantiate `Intl.DateTimeFormat` on every invocation. Resolving the locale dynamically based on environment variables also adds overhead.
**Action:** When working in hot paths, avoid `toLocaleString()` or `toLocaleTimeString()`. Instead, use a shared, cached instance of `Intl.DateTimeFormat` via `getDateTimeFormat(locale, options).format(date)` and cache locale resolution results for the lifetime of the process.
