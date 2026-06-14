## 2025-01-20 - Optimize LSP result array processing by avoiding intermediate allocations
**Learning:** Chaining `.map().filter()` on large collections (like LSP result arrays in `src/tools/LSPTool/LSPTool.ts`) creates multiple intermediate arrays, leading to increased memory allocation and garbage collection pressure, which can become a bottleneck.
**Action:** Use a single `for` loop to directly populate a target data structure (like a `Set`) when transforming and filtering elements from potentially large collections to improve performance.
