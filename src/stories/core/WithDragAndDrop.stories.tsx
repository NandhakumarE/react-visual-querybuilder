import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import type { Query } from "../../lib/types";
import "../stories.css";
import Rule from "./components/Rule";
import Group from "./components/Group";

const defaultQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "firstName", operator: "equal", value: "John" },
    { id: "rule-2", field: "lastName", operator: "equal", value: "Doe" },
    { id: "rule-3", field: "age", operator: "greater", value: 18 },
  ],
};

const nestedQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "firstName", operator: "equal", value: "John" },
    {
      id: "group-1",
      combinator: "or",
      rules: [
        { id: "rule-2", field: "lastName", operator: "equal", value: "Doe" },
        { id: "rule-3", field: "age", operator: "greater", value: 18 },
      ],
    },
    { id: "rule-4", field: "firstName", operator: "contains", value: "J" },
  ],
};

const lockedQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "firstName", operator: "equal", value: "John", isLocked: true },
    { id: "rule-2", field: "lastName", operator: "equal", value: "Doe" },
    { id: "rule-3", field: "age", operator: "greater", value: 18 },
  ],
};

const fields = [
  { label: "First Name", value: "firstName", type: "string" as const },
  { label: "Last Name", value: "lastName", type: "string" as const },
  { label: "Age", value: "age", type: "number" as const },
];

interface DemoProps {
  initialQuery?: Query;
}

const WithDragAndDropDemo = ({ initialQuery = defaultQuery }: DemoProps) => {
  const [query, setQuery] = useState<Query>(initialQuery);

  return (
    <div className="text-sm">
      <QueryBuilder
        value={query}
        onChange={(newValue) => setQuery(newValue)}
      >
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          renderRule={(props) => <Rule {...props} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof WithDragAndDropDemo> = {
  title: "Core/WithDragAndDrop",
  component: WithDragAndDropDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      // Render each story in iframe to isolate DnD contexts
      story: { inline: false, height: "350px" },
      source: { code: null },
      description: {
        component: `
## Drag and Drop

Use \`QueryBuilder.BuilderWithDnD\` for drag-and-drop support. This is a separate component built on top of the core library.

\`\`\`tsx
<QueryBuilder value={query} onChange={setQuery}>
  <QueryBuilder.BuilderWithDnD
    fields={fields}
    renderRule={(props) => <YourRule {...props} />}
    renderGroup={(props) => <YourGroup {...props} />}
  />
</QueryBuilder>
\`\`\`

### Features

- Drag and drop **rules** and **groups** to reorder
- Move items within the same group or across different groups
- Locked items cannot be dragged

### Attaching Drag Handle

Spread \`slots.dragHandles\` on your drag handle element:

\`\`\`tsx
renderRule={({ rule, slots }) => (
  <div className="rule">
    {/* Drag handle - spread slots.dragHandles here */}
    <div className="drag-handle" {...slots.dragHandles}>
      <GripIcon />
    </div>

    {/* Rest of your rule UI */}
  </div>
)}
\`\`\`

> **Note:** Don't attach drag handles to locked items. Check \`rule.isLocked\` before spreading.

### Keyboard Accessibility

Full keyboard support for reordering:

| Key | Action |
|-----|--------|
| \`Space\` | Pick up the focused item |
| \`↑\` / \`↓\` | Move item up or down |
| \`Enter\` | Drop the item at current position |
| \`Escape\` | Cancel drag operation |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WithDragAndDropDemo>;

export const Default: Story = {
  args: { initialQuery: defaultQuery },
  parameters: {
    docs: {
      description: {
        story: "Basic drag and drop. Grab the drag handle and reorder rules.",
      },
    },
  },
};

export const WithNestedGroups: Story = {
  args: { initialQuery: nestedQuery },
  parameters: {
    docs: {
      story: { inline: false, height: "450px" },
      description: {
        story: "Drag rules between groups or reorder groups themselves.",
      },
    },
  },
};

export const WithLockedItems: Story = {
  args: { initialQuery: lockedQuery },
  parameters: {
    docs: {
      description: {
        story: "Locked items (first rule) cannot be dragged. Notice the disabled drag handle.",
      },
    },
  },
};
