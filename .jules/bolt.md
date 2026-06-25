## 2025-02-27 - Caching Intl validation in frequent utilities
**Learning:** Instantiating `Intl` formatters (e.g., `new Intl.DateTimeFormat(tag)`) purely to validate strings is an expensive operation (~0.05-0.1ms each). When done inside utility formatting functions that run frequently (like chat message timestamp formatters on every render), it creates a significant performance bottleneck.
**Action:** When deriving or validating static system properties like locales using `Intl`, cache the result in a module-level variable to avoid repeated instantiation overhead on subsequent calls.
