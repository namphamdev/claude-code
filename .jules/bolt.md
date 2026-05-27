## 2024-05-27 - Chained Array Operations for Set Population in Hot Paths
**Learning:** Chaining `.filter().map()` before initializing a `Set` (e.g., `new Set(arr.filter(...).map(...))`) creates intermediate arrays, causing measurable performance degradation and memory pressure due to GC churn in frequently called paths like UI rendering or tight loops.
**Action:** Replace `new Set(arr.filter(...).map(...))` with a single `for...of` loop (or standard `for` loop) that conditionally adds items directly into an initialized `Set`.
