
## 2024-04-25 - Avoid chained array methods when populating Sets
**Learning:** The codebase contains many instances where `.filter(x => ...).map(y => ...)` chains are used to populate a `Set` (especially common for filtering Task lists by status). This pattern creates two intermediate arrays, increasing garbage collection pressure and CPU time on the hot path.
**Action:** Instead of passing a chained array to the `Set` constructor, create an empty `Set` and populate it conditionally inside a single `for...of` loop. This avoids intermediate array allocations completely and makes iteration much faster, particularly for frequently-called React render functions or task watcher loops.
