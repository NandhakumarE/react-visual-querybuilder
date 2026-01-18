import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import type { Query } from "../../lib/types";
import "../stories.css";
import Rule from "./components/Rule";
import Group from "./components/Group";

// Query with both locked rule and locked group
const queryWithBothLocked: Query = {
  id: "root",
  combinator: "and",
  rules: [
    {
      id: "rule-1",
      field: "firstName",
      operator: "equal",
      value: "John",
      isLocked: true,
    },
    {
      id: "rule-2",
      field: "age",
      operator: "greater",
      value: 18,
      isLocked: false,
    },
    {
      id: "group-1",
      combinator: "or",
      isLocked: true,
      rules: [
        {
          id: "rule-3",
          field: "lastName",
          operator: "contains",
          value: "Doe",
          isLocked: true,
        },
      ],
    },
  ],
};

// Query with only locked rule
const queryWithLockedRule: Query = {
  id: "root",
  combinator: "and",
  rules: [
    {
      id: "rule-1",
      field: "firstName",
      operator: "equal",
      value: "John",
      isLocked: true,
    },
    {
      id: "rule-2",
      field: "age",
      operator: "greater",
      value: 18,
      isLocked: false,
    },
  ],
};

// Query with only locked group
const queryWithLockedGroup: Query = {
  id: "root",
  combinator: "and",
  rules: [
    {
      id: "rule-1",
      field: "firstName",
      operator: "equal",
      value: "John",
    },
    {
      id: "group-1",
      combinator: "or",
      isLocked: true,
      rules: [
        {
          id: "rule-2",
          field: "age",
          operator: "greater",
          value: 18,
          isLocked: true,
        },
        {
          id: "rule-3",
          field: "lastName",
          operator: "contains",
          value: "Doe",
          isLocked: true,
        },
      ],
    },
  ],
};

const fields = [
  { label: "First Name", value: "firstName", type: "string" as const },
  { label: "Last Name", value: "lastName", type: "string" as const },
  { label: "Age", value: "age", type: "number" as const },
];

const LockedDemo = ({ initialQuery }: { initialQuery: Query }) => {
  const [query, setQuery] = useState<Query>(initialQuery);

  return (
    <div className="text-sm">
      <QueryBuilder value={query} onChange={(newValue) => setQuery(newValue)}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          renderRule={(props) => <Rule {...props} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof LockedDemo> = {
  title: "Core/LockFeature",
  component: LockedDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: false, height: "350px" },
      source: { code: null },
      description: {
        component: `
## Lock/Unlock Rules & Groups

This library provides built-in support for locking rules and groups. Locked items cannot be edited, deleted, cloned, or dragged.

### API

**Toggle Lock State**

Call \`slots.onToggleLock()\` to toggle the lock state of a rule or group:

\`\`\`tsx
renderRule={({ rule, slots }) => (
  <button onClick={slots.onToggleLock}>
    {rule.isLocked ? "Unlock" : "Lock"}
  </button>
)}
\`\`\`

**Lock State Property**

The lock state is stored in the \`isLocked\` property of each rule/group:

\`\`\`tsx
const query: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "1", field: "name", operator: "equal", value: "John", isLocked: true },
    { id: "group-1", combinator: "or", isLocked: true, rules: [...] },
  ],
};
\`\`\`

### Library-Level Protection

The library automatically prevents all modifications to locked items at the data layer:

| Action | Blocked when locked |
|--------|---------------------|
| Edit field/operator/value | ✅ |
| Remove rule/group | ✅ |
| Clone rule/group | ✅ |
| Drag & drop | ✅ |
| Add rule/group inside locked group | ✅ |

> **Note:** Protection happens at the library level, not just UI. Even if you bypass UI restrictions, the library will reject modifications to locked items.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LockedDemo>;

export const Default: Story = {
  args: {
    initialQuery: queryWithBothLocked,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows both a locked rule (first rule) and a locked group. Try clicking the lock icons to toggle states.",
      },
    },
  },
};

export const RuleLock: Story = {
  args: {
    initialQuery: queryWithLockedRule,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates locking individual rules. The first rule is locked - it cannot be edited, deleted, cloned, or dragged.",
      },
    },
  },
};

export const GroupLock: Story = {
  args: {
    initialQuery: queryWithLockedGroup,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates locking an entire group. When a group is locked, all rules inside it are also protected. You cannot add, remove, or modify anything inside the locked group.",
      },
    },
  },
};
