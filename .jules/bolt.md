
## 2024-06-30 - Cache Expensive Intl Instantiations
**Learning:** Instantiating `Intl` formatters (e.g., `Intl.NumberFormat`, `Intl.Segmenter`, `Intl.DateTimeFormat`) is an expensive operation (~0.6ms per call). When used for validating strings (e.g., in POSIX tags checking) or formatting commonly used structures, these repeated instantiations cause noticeable performance bottlenecks.
**Action:** Always cache these instances or their validation results at the module level for reuse instead of allocating them repeatedly inside functions or loops.
