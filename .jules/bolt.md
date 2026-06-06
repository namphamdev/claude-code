## 2024-06-06 - Avoid Chained Array Methods in Set Instantiations
**Learning:** Initializing Sets with chained array methods (`new Set(array.filter(..).map(..))`) in hot paths like React render loops or frequent utilities causes significant garbage collection pressure due to intermediate array allocation.
**Action:** When filtering or mapping data into a Set on critical hot paths, avoid chaining array methods. Instead, use a single `for` loop over the source array to add items directly to the Set, mitigating GC pressure and memory spikes.
