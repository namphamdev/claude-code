## 2024-05-26 - Replace `.filter().map()` chains with for-loops on Set populations
**Learning:** Chaining array methods like `.filter().map()` on large collections in hot paths (like React renders or tight message loops) creates multiple intermediate arrays, leading to unnecessary allocations and garbage collection pressure in this codebase.
**Action:** When populating structures like `Set`s from arrays, use a single `for` loop to filter and add elements directly, especially in core component render functions and high-frequency utilities.
