## 2024-06-25 - [Optimize `getToolUseIDs` to reduce allocations]
**Learning:** Chaining `.filter().map()` inside a `useMemo` that processes a large array of messages (like `normalizedMessages` which can be 27k+ items) creates intermediate arrays and causes unnecessary allocations, contributing to GC pressure and UI pauses during React re-renders.
**Action:** Replace `.filter().map()` chains with a single `for` loop that populates a `Set` or `Array` directly when operating on frequently updated or large collections.
