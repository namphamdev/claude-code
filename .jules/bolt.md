## 2025-02-28 - Optimizing `.map().filter()` chains into single iterations
**Learning:** For performance optimizations in hot paths or on large collections (like LSP result arrays), avoid chaining array methods like `.map().filter()`. These operations create intermediate arrays causing redundant iteration and unnecessary memory allocations.
**Action:** Replace map/filter chains with a single `for` loop to populate the target structure (e.g., a `Set`). This reduces intermediate allocations, minimizes garbage collection pressure, and provides measurable speedup without sacrificing clarity.
