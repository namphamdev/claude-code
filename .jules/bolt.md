## 2024-10-13 - Cached Intl formatters
**Learning:** `toLocaleString()` and `toLocaleTimeString()` on `Date` and `Number` are slow in hot paths because they internally instantiate `Intl` objects.
**Action:** Create and reuse cached `Intl.DateTimeFormat` and `Intl.NumberFormat` instances in `src/utils/intl.ts` using `getDateTimeFormat` and `getNumberFormat`.
