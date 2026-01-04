# React Visual Query Builder

  A headless, fully-typed React query builder with compound components, render props, and drag-and-drop support. Build complex filter UIs with any design system.

  ## 🚧 Work in Progress

  This library is currently under active development. Features and API may change.

  ## Features (Planned)

  - **Headless & Unstyled** — Bring your own UI components
  - **Compound Components** — Intuitive `<QueryBuilder.Builder>` API
  - **Render Props** — Full control over rule and group rendering
  - **Type-Safe** — 100% TypeScript with strict types
  - **Immutable Updates** — Predictable state management
  - **Drag & Drop** — Reorder rules and groups
  - **Nested Groups** — Unlimited depth with `maxDepth` control
  - **Slot-based Actions** — Customizable lock, clone, remove buttons

  ## Installation

  ```bash
  npm install react-visual-querybuilder

  ⚠️ Not yet published to npm. Coming soon.

  Basic Usage

  import { QueryBuilder } from 'react-visual-querybuilder';

  <QueryBuilder value={query} onChange={setQuery}>
    <QueryBuilder.Builder
      fields={fields}
      renderRule={({ rule, fields, operators, onChange, slots }) => (
        // Your custom rule UI
      )}
      renderGroup={({ group, children, slots }) => (
        // Your custom group UI
      )}
    />
  </QueryBuilder>

  License

  MIT
  ```
