## 2023-10-27 - [Locale and Intl Instantiation Performance]
**Learning:** Instantiating `Intl.DateTimeFormat` or parsing locale from environment variables (e.g. `process.env.LC_ALL`) on every invocation is highly expensive and significantly slows down formatting functions in hot paths.
**Action:** Cache the resulting `Intl.DateTimeFormat` instances and the resolved locale string at the module level. Ensure the cache key accurately reflects the `Intl` options and the locale to avoid unnecessary recalculations, enabling order of magnitude performance improvements for simple date formatting.
