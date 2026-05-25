## 2024-05-25 - Avoid intermediate array allocations when building Sets
**Learning:** Chaining `.filter().map()` before passing the result to `new Set(...)` is an anti-pattern in hot paths (like React render loops and frequent lock-checks) because it creates intermediate arrays that must be allocated and immediately garbage collected, putting unnecessary pressure on the GC and increasing latency.
**Action:** Replace `new Set(array.filter(pred).map(transform))` with a `for...of` loop that directly adds elements to the `Set`.
