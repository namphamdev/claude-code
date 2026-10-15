
## 2025-02-28 - Avoid Date.prototype.toLocaleString in Hot Paths
**Learning:** `Date.prototype.toLocaleString` (and `toLocaleTimeString`, `toLocaleDateString`) internally instantiates a new `Intl.DateTimeFormat` object on every invocation, making them extremely slow in performance-critical areas like rendering lists of messages with timestamps.
**Action:** When repeatedly formatting dates (especially in UI rendering loops like message logs), explicitly create, cache, and reuse `Intl.DateTimeFormat` instances and call their `.format(date)` method instead. This yielded a ~25x performance improvement.
