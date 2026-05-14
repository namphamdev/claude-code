## 2024-05-14 - Optimize Set population by avoiding intermediate arrays
**Learning:** Chaining `.filter(...).map(...)` creates intermediate array allocations that increase garbage collection pressure. This is an anti-pattern when populating `Set`s in hot paths like React renders or tight polling loops (e.g., `useTaskListWatcher.ts`, `TaskListV2.tsx`, `tasks.ts`).
**Action:** Use a single `for` loop to filter and extract IDs directly into the target structure (e.g., `Set.add()`). This avoids allocating throw-away arrays.
