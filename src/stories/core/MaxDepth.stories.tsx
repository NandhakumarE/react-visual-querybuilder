import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import type { Query } from "../../lib/types";
import "../stories.css";
import Rule from "./components/Rule";
import Group from "./components/Group";

const flatQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "firstName", operator: "equal", value: "John" },
    { id: "rule-2", field: "age", operator: "greater", value: 18 },
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
        { id: "rule-2", field: "age", operator: "greater", value: 18 },
      ],
    },
  ],
};

const fields = [
  { label: "First Name", value: "firstName", type: "string" as const },
  { label: "Last Name", value: "lastName", type: "string" as const },
  { label: "Age", value: "age", type: "number" as const },
];

interface MaxDepthDemoProps {
  maxDepth?: number;
  initialQuery?: Query;
}

const MaxDepthDemo = ({ maxDepth = 2, initialQuery = nestedQuery }: MaxDepthDemoProps) => {
  const [query, setQuery] = useState<Query>(initialQuery);

  return (
    <div className="text-sm">
      <QueryBuilder
        value={query}
        maxDepth={maxDepth}
        onChange={(newValue) => setQuery(newValue)}
      >
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          renderRule={(props) => <Rule {...props} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} maxDepth={maxDepth} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof MaxDepthDemo> = {
  title: "Core/MaxDepth",
  component: MaxDepthDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: false, height: "350px" },
      source: { code: null },
      description: {
        component: `
## Max Depth

Limit how deeply users can nest groups. Pass \`maxDepth\` to the \`QueryBuilder\` component.

\`\`\`tsx
<QueryBuilder value={query} onChange={setQuery} maxDepth={2}>
  ...
</QueryBuilder>
\`\`\`

> **Note:** Even if the "Add Group" button is visible at the maximum depth, clicking it won't create a group. The library handles this internally.
        `,
      },
    },
  },
  argTypes: {
    maxDepth: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum nesting depth for groups",
    },
    initialQuery: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof MaxDepthDemo>;

export const Depth1: Story = {
  args: { maxDepth: 1, initialQuery: flatQuery },
  parameters: {
    docs: {
      description: {
        story: "No nested groups allowed. Only rules at the root level.",
      },
    },
  },
};

export const Depth2: Story = {
  args: { maxDepth: 2 },
  parameters: {
    docs: {
      description: {
        story: "One level of nesting allowed. Groups can contain rules but not other groups.",
      },
    },
  },
};

export const Depth5: Story = {
  args: { maxDepth: 5 },
  parameters: {
    docs: {
      description: {
        story: "Deep nesting allowed. Useful for complex query scenarios.",
      },
    },
  },
};
