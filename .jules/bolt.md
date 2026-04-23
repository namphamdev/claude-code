## 2024-06-12 - [Array count optimization]
**Learning:** `for...of` loops, while readable, allocate iterator objects under the hood. In heavily utilized utility functions like `count` in `src/utils/array.ts`, substituting them with traditional index-based `for` loops avoids iterator allocation overhead and yields faster execution speeds in tight loops.
**Action:** Use traditional index-based `for` loops for performance-critical utility functions that iterate over arrays.
