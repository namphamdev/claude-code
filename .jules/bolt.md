## 2025-02-12 - Avoid chaining map and filter in hot paths
**Learning:** Chaining array methods like `.filter().map()` in large arrays (such as LSP symbol results and global task lists) allocates intermediate arrays that are immediately thrown away, causing unnecessary GC pressure and CPU overhead.
**Action:** When extracting data or building Sets from large arrays, replace `.map().filter()` chains with a single `for` loop that iterates over the source array and directly populates the target structure.
