## 2024-05-24 - Avoid `.filter().map()` Chains on Critical Paths
**Learning:** Chaining `.filter().map()` creates intermediate arrays, putting pressure on memory allocation and garbage collection. This matters, especially when mapping values directly into `Set`s during frequent operations like React renders (e.g. `TaskListV2.tsx`) and fast API task processing.
**Action:** Use inline `for...of` loops to conditionally add items directly to target structures (like a `Set` or an array) when processing arrays on frequent/hot code paths to eliminate unnecessary O(N) array allocations.
