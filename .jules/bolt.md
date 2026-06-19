## 2024-05-18 - Avoiding Intermediate Array Allocations
**Learning:** In hot paths and loops processing large collections (e.g., messages, task IDs, tools) inside functions such as `getTask`, `claimTask`, `findAvailableTask`, chaining array methods like `array.filter(condition).map(transform)` creates intermediate arrays which increases memory consumption and garbage collection pressure unnecessarily.
**Action:** Replace `array.filter(condition).map(transform)` chains with a single `for` loop that populates the destination structure (e.g., `Set` or `Array`) directly.
