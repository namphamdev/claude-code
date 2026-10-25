
## 2025-02-20 - Intl.DateTimeFormat Caching in Hot Paths
**Learning:** Native `Date` methods like `toLocaleString()` and `toLocaleTimeString()` are extremely slow in hot paths because they internally instantiate `Intl.DateTimeFormat` on every invocation (taking ~0.05-0.1ms each).
**Action:** Always extract and cache `Intl.DateTimeFormat` instances at the module level (e.g., using `getDateTimeFormat` in `src/utils/intl.ts`) and call `.format(date)` instead of using native `toLocale*` methods directly.
