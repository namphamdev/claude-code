## 2025-02-23 - Avoid .filter().map() chains for large collections in hot paths
**Learning:** Chaining array methods like `.filter().map()` creates intermediate arrays, adding garbage collection pressure and reducing performance, especially in components that re-render frequently (like `TaskListV2` or `Spinner`) or on large data sets (like `tasks` arrays).
**Action:** Replace intermediate array allocations like `new Set(arr.filter(...).map(...))` with a single `for` loop that populates the target structure directly.
