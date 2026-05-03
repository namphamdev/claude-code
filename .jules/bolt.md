## 2024-05-03 - Replacing array .filter().map() chains with for loops
**Learning:** Chaining array methods like `.filter().map()` to populate a `Set` causes unnecessary intermediate array allocations and garbage collection pressure, especially in hot paths like React render cycles and task operations.
**Action:** Use a single `for` loop that iterates over the source array, checks the condition, and adds the mapped value directly to the `Set` to reduce GC pressure.
