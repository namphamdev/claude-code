## 2025-02-14 - Replace Chained Array Methods
**Learning:** Chaining `.filter().map()` causes unnecessary memory allocations and CPU overhead by generating multiple intermediate arrays and iterating twice. For frequent operations or potentially large datasets (like `allTasks` arrays), this compounds GC pressure and delays processing.
**Action:** Replace `array.filter(...).map(...)` chains with a single `for...of` loop where items are conditionally added to a target accumulator (array or `Set`).
