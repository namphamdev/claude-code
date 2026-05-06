## 2026-05-06 - Array chaining optimization
**Learning:** Refactoring `.filter(...).map(...)` into a single loop populating a `Set` directly improves performance by eliminating intermediate array allocations and reducing GC pressure, particularly in hot paths or with large collections.
**Action:** When working with large collections or hot paths, prefer a single `for` loop over chained array methods when building sets or new arrays.
