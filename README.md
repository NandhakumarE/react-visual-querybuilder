# React Visual Query Builder

![Status](https://img.shields.io/badge/status-work%20in%20progress-yellow)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

A headless, fully-typed React query builder using compound components and render props. Build complex filter UIs with any design system — zero styling opinions.

## Why?

Most query builders are tightly coupled to specific UI libraries or come with opinionated styles. This library provides:

- **Complete UI freedom** — Render with MUI, Chakra, Ant Design, Tailwind, or vanilla HTML
- **Inversion of control** — You own the markup, we handle the logic
- **Type safety** — Full TypeScript inference for query structures and operators

## Features

| Feature | Description |
|---------|-------------|
| Headless | No styles, no markup — bring your own components |
| Compound Components | Clean `<QueryBuilder.Builder>` composition API |
| Render Props | Full control via `renderRule` and `renderGroup` |
| Immutable Updates | Predictable state with structural sharing |
| Type Inference | Operators auto-filter based on field type |
| Nested Groups | Recursive AND/OR groups with `maxDepth` control |
| Slot Actions | Pre-wired handlers for add, remove, clone, lock |
| Drag & Drop | Reorder rules and groups (dnd-kit) |

## Quick Start

```tsx
import { QueryBuilder } from 'react-visual-querybuilder';

<QueryBuilder value={query} onChange={setQuery} maxDepth={3}>
  <QueryBuilder.Builder
    fields={[
      { label: 'Name', value: 'name', type: 'string' },
      { label: 'Age', value: 'age', type: 'number' },
    ]}
    renderRule={({ rule, fields, operators, onChange, slots }) => (
      <div className="rule">
        <FieldSelect value={rule.field} options={fields} onChange={onChange} />
        <OperatorSelect value={rule.operator} options={operators} onChange={onChange} />
        <ValueInput value={rule.value} onChange={onChange} />
        <button onClick={slots.onRemove}>Remove</button>
      </div>
    )}
    renderGroup={({ group, children, slots, onChange }) => (
      <div className="group">
        <CombinatorToggle value={group.combinator} onChange={onChange} />
        <button onClick={slots.onAddRule}>+ Rule</button>
        <button onClick={slots.onAddGroup}>+ Group</button>
        {children}
      </div>
    )}
  />
</QueryBuilder>
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Headless architecture | Maximum flexibility, framework agnostic |
| Compound components | Implicit state sharing without prop drilling |
| Path-based operations | O(depth) updates with structural sharing |
| Render props over slots | Full control vs. limited customization |
| Cascading lock state | UX: locked parent = locked children |

## Tech Stack

- **React 19** — Latest concurrent features
- **TypeScript 5.9** — Strict mode, no `any`
- **Vite 7** — Fast builds, library mode
- **Vitest** — Unit testing with coverage


## License

MIT
