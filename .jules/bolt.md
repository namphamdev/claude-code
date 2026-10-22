
## 2024-06-03 - Cache Intl.DateTimeFormat instead of using Date.toLocaleString
**Learning:** Native `Date.toLocaleString()` and `Date.toLocaleTimeString()` are extremely slow in hot paths because they internally instantiate `Intl.DateTimeFormat` on every invocation (taking ~0.05-0.1ms each).
**Action:** For performance-critical code or frequently called utility functions like `formatBriefTimestamp`, explicitly create, cache, and reuse `Intl.DateTimeFormat` instances and call their `.format(date)` method instead. Additionally, parsing and validating locale tags (e.g., from `process.env.LC_ALL`) involves creating an `Intl.DateTimeFormat` instance to check validity; this should also be cached at the module level.
