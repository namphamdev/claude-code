## 2024-06-21 - Optimizing large Set initializations
**Learning:** Initializing `Set` collections by chaining `.map().filter()` over large arrays (like `allMessages` in `sessionStorage.ts` or LSP tool results) creates unnecessary intermediate arrays, increasing GC pressure and computation time.
**Action:** Replace `new Set(arr.map(x => x.prop).filter(Boolean))` with a single `for...of` loop when dealing with potentially large arrays to avoid intermediate array allocations.
