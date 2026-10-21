## 2025-05-19 - Cache Intl.DateTimeFormat in Hot Path Functions

**Learning:** `Intl.DateTimeFormat` instantiations are extremely slow and expensive. When rendering UIs (like the frontend displaying many message timestamps), creating new instances inside loop blocks or formatters degrades performance significantly.
**Action:** Always cache instances of `Intl.DateTimeFormat`, locale strings parsed from environment variables, and `Intl.Segmenter` globally in the module using a lazy-initialization pattern, avoiding repeated recalculation in hot-paths.
