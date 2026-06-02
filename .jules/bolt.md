## 2023-11-20 - Array Allocation Overheads in Rendering
**Learning:** Chaining array operations like `.filter().map()` is an anti-pattern for large collections, especially in React components or hot loop functions (like `tasks.ts`), because it forces intermediate array allocations and increases garbage collection pressure.
**Action:** Always replace chained `.filter().map()` calls with a simple `for` loop that iterates once and aggregates the result directly (e.g. adding directly to a `Set`).
