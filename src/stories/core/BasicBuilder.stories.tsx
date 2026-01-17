import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import type { Query } from "../../lib/types";
import "../stories.css";
import Rule, { type RuleFeatures } from "./components/Rule";
import Group, { type GroupFeatures } from "./components/Group";

const defaultQuery: Query = {
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
      id: "rule-2",
      field: "age",
      operator: "greater",
      value: 18,
    },
  ],
};

const fields = [
  { label: "First Name", value: "firstName", type: "string" as const },
  { label: "Last Name", value: "lastName", type: "string" as const },
  { label: "Age", value: "age", type: "number" as const },
];

interface BasicBuilderDemoProps {
  ruleFeatures?: RuleFeatures;
  groupFeatures?: GroupFeatures;
}

const BasicBuilderDemo = ({ ruleFeatures, groupFeatures }: BasicBuilderDemoProps) => {
  const [query, setQuery] = useState<Query>(defaultQuery);

  const defaultRuleFeatures: RuleFeatures = { showDrag: false, ...ruleFeatures };
  const defaultGroupFeatures: GroupFeatures = { showDrag: false, ...groupFeatures };

  return (
    <div className="text-sm">
      <QueryBuilder value={query} onChange={(newValue) => setQuery(newValue)}>
        <QueryBuilder.Builder
          fields={fields}
          renderRule={(props) => <Rule {...props} features={defaultRuleFeatures} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} features={defaultGroupFeatures} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof BasicBuilderDemo> = {
  title: "Core/BasicBuilder",
  component: BasicBuilderDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      source: { code: null },
      description: {
        component: `
## Basic Builder (Without Drag & Drop)

A lightweight query builder without drag-and-drop. Use \`QueryBuilder.Builder\` instead of \`QueryBuilder.BuilderWithDnD\` when you don't need reordering.

\`\`\`tsx
<QueryBuilder value={query} onChange={setQuery}>
  <QueryBuilder.Builder
    fields={fields}
    renderRule={(props) => <YourRule {...props} />}
    renderGroup={(props) => <YourGroup {...props} />}
  />
</QueryBuilder>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BasicBuilderDemo>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Basic builder with all features enabled except drag & drop. Includes add, remove, clone, and lock functionality.",
      },
    },
  },
};

export const Simple: Story = {
  args: {
    ruleFeatures: { showClone: false, showLock: false },
    groupFeatures: { showClone: false, showLock: false },
  },
  parameters: {
    docs: {
      description: {
        story: "Simplified version with only essential actions: add and remove. No clone or lock buttons.",
      },
    },
  },
};


