## 2024-05-19 - React component micro-optimizations and codebase styling

**Learning:** When making small optimizations like adding `useMemo` in React components, it's very important to avoid using auto-formatters blindly (e.g. `biome format`) unless the entire codebase already conforms to the formatter's rules. Otherwise, the auto-formatter might apply large stylistic changes (like adding semicolons across a file that previously omitted them) which pollutes the diff and violates the requirement for optimizations to be < 50 lines. The codebase uses a semicolon-free style.

**Action:** Before running auto-format tools on modified files, check if the changes are going to introduce a large number of style modifications that weren't part of the actual logic change. If so, apply the formatting manually to match the existing style (e.g. semicolon-free) and keep the diff small.
