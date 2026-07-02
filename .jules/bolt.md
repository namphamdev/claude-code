## 2024-07-02 - Intl Object Initialization Cost
**Learning:** Instantiating `Intl` objects like `Intl.DateTimeFormat` and `Intl.NumberFormat` is surprisingly expensive in JavaScript. Using them for one-off validations in hot loops (e.g., in `getLocale` or `getBudgetContinuationMessage`) can create measurable CPU bottlenecks.
**Action:** Always cache `Intl` formatter instances or their validation results at the module level for reuse instead of allocating them repeatedly inside functions or loops.
