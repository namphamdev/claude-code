## 2026-06-26 - Cached Intl formatters for UI updates
**Learning:** Instantiating `Intl` formatters (e.g., `Intl.NumberFormat`, `Intl.DateTimeFormat`) is an expensive operation (~0.05-0.1ms each), especially in functions that run frequently like chat label formatters or token budget trackers. Even for validation logic, it incurs a steep performance cost.
**Action:** Cache these instances or their results at the module level for reuse instead of allocating them repeatedly inside functions or loops.
