## 2025-02-12 - Avoid array method chaining when populating Sets
**Learning:** Chaining array methods like `.filter().map()` to populate a target structure (like a `Set`) creates unnecessary intermediate arrays. In hot paths (like React components rendering loops) or with large collections, this increases garbage collection pressure.
**Action:** When populating structures like Sets, use a single `for...of` loop to iterate and add elements directly, rather than chaining `.filter().map()`.
