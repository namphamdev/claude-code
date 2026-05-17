## 2024-05-17 - Avoid Chaining .filter().map() in Hot Paths
**Learning:** Chaining array methods like `.filter().map()` to build Sets or pass arrays to other components creates intermediate array allocations that add significant garbage collection pressure during frequent operations (like React renders or tight loop tasks).
**Action:** When populating a `Set` or constructing a new list in a hot path, replace chained `.filter().map()` calls with a single `for` loop that iterates over the original collection and directly adds elements to the target structure.
