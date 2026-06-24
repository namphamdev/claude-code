
## 2024-06-24 - Optimize Intl formatter allocation
**Learning:** Instantiating `Intl` formatters (e.g., `Intl.NumberFormat`, `Intl.Segmenter`) is an expensive operation (~60ms for 1000 allocations).
**Action:** Cache these instances at the module level for reuse instead of allocating them repeatedly inside functions or loops.
