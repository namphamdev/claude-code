## 2024-06-09 - Avoid Array Method Chaining on Hot Paths
**Learning:** Using chained array methods like `.filter().map()` to populate Sets or arrays from large collections (like messages or task lists) creates unnecessary intermediate arrays, increasing garbage collection pressure and latency in critical hot paths.
**Action:** Use a single `for` loop to directly populate target data structures like Sets, reducing memory allocations and GC pauses in performance-sensitive areas.
