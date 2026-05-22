## 2024-05-22 - Avoid chaining array methods for building Sets

**Learning:** When generating a `Set` from an array, chaining methods like `.filter().map()` causes unnecessary intermediate array allocations, resulting in increased memory overhead and garbage collection pressure, particularly on hot paths or large arrays (like tasks and messages).

**Action:** Replace instances of `.filter().map()` inside `new Set(...)` constructors with single `for...of` loops that manually iterate through the source array and invoke `Set.prototype.add()` to build the data structure directly.
