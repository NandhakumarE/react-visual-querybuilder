# react-querybuilder-lite

[![npm version](https://img.shields.io/npm/v/react-querybuilder-lite.svg)](https://www.npmjs.com/package/react-querybuilder-lite)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-querybuilder-lite)](https://bundlephobia.com/package/react-querybuilder-lite)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb)
[![License](https://img.shields.io/npm/l/react-querybuilder-lite)](https://github.com/NandhakumarE/react-visual-querybuilder/blob/main/LICENSE)

A lightweight, headless React query builder with drag-and-drop support. Build complex filter UIs with any design system — zero styling opinions.

## Why This Library?

Most query builders ship with opinionated styles or are tightly coupled to specific UI libraries. This library provides:

- **Complete UI freedom** — Use MUI, Chakra, Ant Design, Tailwind, or vanilla HTML
- **Inversion of control** — You own the markup, we handle the logic
- **Type safety** — Full TypeScript inference for queries, operators, and fields
- **Lightweight** — ~8KB without DnD, ~23KB with DnD (minified + gzipped)

## Features

| Feature | Description |
|---------|-------------|
| Headless | No styles, no markup — bring your own components |
| Compound Components | Clean `<QueryBuilder.Builder>` composition API |
| Render Props | Full control via `renderRule` and `renderGroup` |
| Drag & Drop | Optional reordering via dnd-kit integration |
| Immutable Updates | Predictable state with structural sharing |
| Type Inference | Operators auto-filter based on field type |
| Nested Groups | Recursive AND/OR groups with `maxDepth` control |
| Lock Protection | Prevent modification of locked rules/groups |
| Slot Actions | Pre-wired handlers for add, remove, clone, lock |

## Installation

```bash
npm install react-querybuilder-lite
```

```bash
yarn add react-querybuilder-lite
```

```bash
pnpm add react-querybuilder-lite
```

**Peer Dependencies:** React 18 or 19

## Quick Start

```tsx
import { useState } from 'react';
import { QueryBuilder, type Query } from 'react-querybuilder-lite';

const fields = [
  { label: 'Name', value: 'name', type: 'string' },
  { label: 'Age', value: 'age', type: 'number' },
];

const initialQuery: Query = {
  id: 'root',
  combinator: 'and',
  rules: [],
};

function App() {
  const [query, setQuery] = useState<Query>(initialQuery);

  return (
    <QueryBuilder value={query} onChange={setQuery} maxDepth={3}>
      <QueryBuilder.Builder
        fields={fields}
        renderRule={({ rule, fields, operators, onChange, slots }) => (
          <div className="rule">
            <select
              value={rule.field}
              onChange={(e) => onChange({ field: e.target.value })}
            >
              <option value="">Select field</option>
              {fields.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            <select
              value={rule.operator}
              onChange={(e) => onChange({ operator: e.target.value })}
            >
              {operators.map((op) => (
                <option key={op.value} value={op.value}>{op.name}</option>
              ))}
            </select>

            <input
              value={rule.value ?? ''}
              onChange={(e) => onChange({ value: e.target.value })}
            />

            <button onClick={slots.onRemove}>Remove</button>
          </div>
        )}
        renderGroup={({ group, children, onChange, slots }) => (
          <div className="group">
            <select
              value={group.combinator}
              onChange={(e) => onChange({ combinator: e.target.value })}
            >
              <option value="and">AND</option>
              <option value="or">OR</option>
            </select>

            <button onClick={slots.onAddRule}>+ Rule</button>
            <button onClick={slots.onAddGroup}>+ Group</button>

            <div className="rules">{children}</div>
          </div>
        )}
      />
    </QueryBuilder>
  );
}
```

## With Drag & Drop

Use `QueryBuilder.BuilderWithDnD` to enable drag-and-drop reordering.

```tsx
import { QueryBuilder, type Query } from 'react-querybuilder-lite';

<QueryBuilder value={query} onChange={setQuery}>
  <QueryBuilder.BuilderWithDnD
    fields={fields}
    renderRule={({ rule, fields, operators, onChange, slots }) => (
      <div className="rule">
        {/* Drag handle - spread slots.dragHandles on any element */}
        <span className="drag-handle" {...slots.dragHandles}>⠿</span>

        <select value={rule.field} onChange={(e) => onChange({ field: e.target.value })}>
          {fields.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>

        {/* ... rest of your UI */}
      </div>
    )}
    renderGroup={({ group, children, onChange, slots }) => (
      <div className="group">
        <span className="drag-handle" {...slots.dragHandles}>⠿</span>

        <select value={group.combinator} onChange={(e) => onChange({ combinator: e.target.value })}>
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>

        <button onClick={slots.onAddRule}>+ Rule</button>
        <button onClick={slots.onAddGroup}>+ Group</button>

        {children}
      </div>
    )}
  />
</QueryBuilder>
```

## API Reference

### `<QueryBuilder>`

Root component that provides state management context.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `Query` | Yes | The query state |
| `onChange` | `(query: Query) => void` | Yes | Called when query changes |
| `maxDepth` | `number` | No | Maximum nesting depth. `1` = no nesting, `2` = one level, etc. |
| `children` | `ReactNode` | Yes | Must contain `Builder` or `BuilderWithDnD` |

### `<QueryBuilder.Builder>`

Renders the query tree without drag-and-drop.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `Field[]` | Yes | Available fields for rules |
| `renderRule` | `(props: RuleRenderProps) => ReactNode` | Yes | Render function for rules |
| `renderGroup` | `(props: GroupRenderProps) => ReactNode` | Yes | Render function for groups |
| `operatorsByFieldType` | `Record<FieldType, Operator[]>` | No | Custom operator mapping |

### `<QueryBuilder.BuilderWithDnD>`

Same props as `Builder`, plus optional drag preview customization.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `renderDragPreview` | `(props: DragPreviewProps) => ReactNode` | No | Custom drag overlay |

### Render Props

#### `RuleRenderProps`

```typescript
interface RuleRenderProps {
  rule: Rule;                    // Current rule data
  path: number[];                // Position in tree (e.g., [0, 1])
  depth: number;                 // Nesting level
  fields: Field[];               // Available fields
  operators: Operator[];         // Operators for selected field type
  selectedField?: Field;         // Currently selected field
  selectedOperator?: Operator;   // Currently selected operator
  slots: {
    onRemove: () => void;        // Remove this rule
    onClone: () => void;         // Duplicate this rule
    onToggleLock: () => void;    // Toggle lock state
    dragHandles: DragHandleType; // Spread on drag handle element
  };
  onChange: (updates: Partial<Rule>) => void;  // Update rule
}
```

#### `GroupRenderProps`

```typescript
interface GroupRenderProps {
  group: RuleGroup;              // Current group data
  path: number[];                // Position in tree
  depth: number;                 // Nesting level
  children: ReactNode;           // Rendered child rules/groups
  slots: {
    onAddRule: () => void;       // Add rule to this group
    onAddGroup: () => void;      // Add nested group
    onRemove: () => void;        // Remove this group
    onClone: () => void;         // Duplicate this group
    onToggleLock: () => void;    // Toggle lock state
    dragHandles: DragHandleType; // Spread on drag handle element
  };
  onChange: (updates: Partial<RuleGroup>) => void;  // Update group
}
```

## Types

### Core Types

```typescript
// The root query structure
type Query = RuleGroup;

interface RuleGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<Rule | RuleGroup>;
  isLocked?: boolean;
}

interface Rule {
  id: string;
  field: string;
  operator: OperatorKey;
  value?: Value;
  isLocked?: boolean;
}

interface Field {
  label: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}
```

### Operators

Built-in operators organized by type:

| Type | Operators |
|------|-----------|
| Unary | `is_empty`, `is_not_empty`, `is_true`, `is_false` |
| Binary | `equal`, `not_equal`, `less`, `less_or_equal`, `greater`, `greater_or_equal`, `contains`, `starts_with`, `ends_with` |
| Range | `between`, `not_between` |
| List | `in`, `not_in` |

Operators are automatically filtered by field type:

| Field Type | Available Operators |
|------------|---------------------|
| `string` | `is_empty`, `is_not_empty`, `equal`, `not_equal`, `contains`, `starts_with`, `ends_with`, `in`, `not_in` |
| `number` | `is_empty`, `is_not_empty`, `equal`, `not_equal`, `less`, `less_or_equal`, `greater`, `greater_or_equal`, `between`, `not_between`, `in`, `not_in` |
| `boolean` | `is_empty`, `is_not_empty`, `is_true`, `is_false` |
| `date` | `is_empty`, `is_not_empty`, `equal`, `not_equal`, `less`, `greater`, `between`, `not_between`, `in`, `not_in` |

## Live Demos

<!-- TODO: Add Storybook link after deployment -->
Coming soon — Storybook examples with various design systems.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Headless architecture | Maximum flexibility, framework agnostic |
| Compound components | Implicit state sharing without prop drilling |
| Path-based operations | O(depth) updates with structural sharing |
| Render props over slots | Full control vs. limited customization |
| Cascading lock state | UX: locked parent = locked children |
| Optional DnD entry point | Respects bundle budgets |

## Contributing

Contributions are welcome! Please open an issue or submit a PR.

## License

MIT
