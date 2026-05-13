## 2025-02-18 - Replacing chained array methods with single loops for Set allocation
**Learning:** This codebase frequently creates new `Set` instances from arrays populated via chained `.filter().map()` operations in hot paths (like `tasks.ts` resolving, tool usages grouping). This anti-pattern forces the V8 engine to allocate two intermediate arrays before passing the result to the `Set` constructor, triggering excess GC pressure.
**Action:** Always use a single `for...of` loop to extract strings and populate `Set` objects dynamically in loops to save memory allocations.
