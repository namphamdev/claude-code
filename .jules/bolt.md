## 2025-06-10 - Avoid chained array methods in hot loops

**Learning:** Using chained array methods like `.filter().map()` to populate sets or extract data in React components during renders creates intermediate array allocations. This increases garbage collection pressure, particularly when list sizes grow or renders are frequent (such as the task list view).

**Action:** Replace `.filter().map()` chains with single-pass `for` loops that directly populate target structures (e.g. `Set`s) to avoid O(N) intermediate memory allocations and improve overall runtime performance.
