## 2024-05-30 - [Performance] Optimization on Set Creation
**Learning:** Found a performance bottleneck related to creating `Set`s from chained array methods (`.filter().map()`). In `src/utils/tasks.ts`, `allTasks.filter(t => t.status !== 'completed').map(t => t.id)` creates intermediate arrays. Using a `reduce` or loop to populate the `Set` is noticeably faster and reduces memory allocations.
**Action:** Replace `new Set(allTasks.filter(...).map(...))` with a `reduce` that populates a `Set` directly.
