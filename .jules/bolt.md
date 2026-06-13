## 2024-06-25 - Avoid array chaining (.map().filter()) on collections
**Learning:** For performance optimizations in hot paths or on large collections (like message arrays, LSP result arrays), chaining array methods like `.filter().map()` creates intermediate array allocations and increases garbage collection pressure.
**Action:** Use a single `for` or `for...of` loop to populate the target structure (e.g., a `Set`) directly to reduce intermediate allocations and garbage collection pressure, especially in performance-sensitive parts of the codebase.
