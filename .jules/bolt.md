## 2024-05-18 - Avoid chaining .filter().map() when creating Sets
**Learning:** In React components and core utilities dealing with `tasks` lists (like `Spinner.tsx` and `TaskListV2.tsx`), chaining `.filter().map()` to construct intermediate arrays before feeding them into a `new Set()` increases GC pressure and garbage creation on every hot render or state change. The project explicitly lists this as an anti-pattern.
**Action:** Replace `new Set(items.filter(...).map(...))` with a single `for...of` loop where the target `Set` is populated directly.
