
## 2024-05-15 - Array Method Chaining vs For Loops for Sets
**Learning:** Chaining array methods like `.filter().map()` before initializing a `Set` in hot UI paths (like `TaskListV2.tsx` and `Spinner.tsx`) creates unnecessary intermediate array allocations, causing performance bottlenecks and GC pressure when working with large data collections.
**Action:** Replace `.filter().map()` chains with single `for` loops when populating data structures like `Set` to reduce intermediate array allocations, memory footprint, and CPU cycles in hot paths.
