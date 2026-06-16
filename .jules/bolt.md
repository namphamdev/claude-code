
## $(date +%Y-%m-%d) - Avoiding Chained Array Methods in Hot Paths
**Learning:** Chaining array methods like `.filter().map()` to populate a `Set` (e.g., `new Set(tasks.filter(...).map(...))`) creates multiple intermediate arrays, leading to increased memory allocations and garbage collection pressure. This is particularly problematic in frequently rendered UI components (like `TaskListV2.tsx`) or deep within hot utility paths dealing with large arrays.
**Action:** Always replace `.filter().map()` chains with a single `for` loop that populates the target structure directly, especially when initializing a `Set` or processing large collections on the main thread.
