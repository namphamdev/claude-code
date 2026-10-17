## 2024-05-14 - Expensive Intl instantiations
**Learning:** Instantiating `Intl` formatters (e.g., `Intl.NumberFormat`, `Intl.Segmenter`, `Intl.DateTimeFormat`) or using `toLocaleString()` and `toLocaleTimeString()`—even purely for validating strings—is an expensive operation in hot paths.
**Action:** Cache these instances or their validation results at the module level for reuse instead of allocating them repeatedly inside functions or loops.
