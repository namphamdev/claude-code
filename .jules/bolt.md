
## 2024-10-24 - Cached Intl.DateTimeFormat instantiation
**Learning:** Native Date methods like `toLocaleString()` and `toLocaleTimeString()` are extremely slow in hot paths (like parsing logs or formatting lists of chat messages) because they internally instantiate `Intl.DateTimeFormat` on every invocation. In Node/Bun, this takes around 0.1ms to 0.3ms per call, adding up significantly when called thousands of times.
**Action:** Created `getDateTimeFormat(locale, options)` in `src/utils/intl.ts` to construct and cache `Intl.DateTimeFormat` instances. We serialize the configuration object by sorting its keys into a string for determinism. Use this cache for any hot path formatting operations.
