## 2024-06-25 - Avoid array method chaining for Set and Map initialization
**Learning:** Chaining array methods like `.filter().map()` to initialize a `Set` or `Map` in hot paths (like within `TaskListV2.tsx` or utilities like `tasks.ts` and `groupToolUses.ts` that process large arrays or are called frequently) causes unnecessary intermediate array allocations, increasing memory usage and garbage collection (GC) pressure.
**Action:** Replace `.filter().map()` chains with a single `for` loop that iterates over the source array and conditionally populates the target `Set` or `Map` directly.
