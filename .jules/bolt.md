
## 2024-07-06 - Cost of Intl Validation
**Learning:** `new Intl.DateTimeFormat(tag)` is expensive to use purely for locale string validation. When parsing BCP 47 locales from POSIX env variables, caching the resolved locale string significantly improves the performance of functions called repeatedly (like timestamp formatters).
**Action:** When validating formats or creating formatters via `Intl`, always introduce a module-level variable to cache the result rather than allocating on every function call. Provide a testing reset mechanism when caching state depends on process environment variables.
