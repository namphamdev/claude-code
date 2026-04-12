## 2026-04-12 - Cached GoogleAuth instance to avoid repeated API instantiations
**Learning:** Instantiating new GoogleAuth instances per api call repeatedly runs auth flow checks causing significant performance issues.
**Action:** Caching GoogleAuth using globalThis solves this and reduces api request time.
