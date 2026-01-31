import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder } from "../../lib/components/QueryBuilder";
import { operators, type Query, type Operator } from "../../lib/types";
import "../stories.css";
import Rule from "./components/Rule";
import Group from "./components/Group";

// Queries for each field type
const stringQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "firstName", operator: "equal", value: "John" },
    { id: "rule-2", field: "lastName", operator: "contains", value: "son" },
  ],
};

const numberQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "age", operator: "greater", value: 18 },
    { id: "rule-2", field: "salary", operator: "between", value: [50000, 100000] },
  ],
};

const booleanQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "isActive", operator: "is_true" },
    { id: "rule-2", field: "isVerified", operator: "is_false" },
  ],
};

const dateQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "createdAt", operator: "greater", value: "2024-01-01" },
    { id: "rule-2", field: "updatedAt", operator: "less", value: "2024-12-31" },
  ],
};

// Fields for each type
const stringFields = [
  { label: "First Name", value: "firstName", type: "string" as const },
  { label: "Last Name", value: "lastName", type: "string" as const },
  { label: "Email", value: "email", type: "string" as const },
];

const numberFields = [
  { label: "Age", value: "age", type: "number" as const },
  { label: "Salary", value: "salary", type: "number" as const },
  { label: "Score", value: "score", type: "number" as const },
];

const booleanFields = [
  { label: "Is Active", value: "isActive", type: "boolean" as const },
  { label: "Is Verified", value: "isVerified", type: "boolean" as const },
  { label: "Is Admin", value: "isAdmin", type: "boolean" as const },
];

const dateFields = [
  { label: "Created At", value: "createdAt", type: "date" as const },
  { label: "Updated At", value: "updatedAt", type: "date" as const },
  { label: "Birth Date", value: "birthDate", type: "date" as const },
];

// Custom field types example
const customQuery: Query = {
  id: "root",
  combinator: "and",
  rules: [
    { id: "rule-1", field: "email", operator: "ends_with", value: "@company.com" },
    { id: "rule-2", field: "scheduledAt", operator: "greater", value: "2024-01-01T09:00" },
    { id: "rule-3", field: "price", operator: "between", value: [100, 500] },
  ],
};

const customFields = [
  { label: "Email Address", value: "email", type: "email" },
  { label: "Scheduled At", value: "scheduledAt", type: "datetime" },
  { label: "Price", value: "price", type: "currency" },
];

// Custom operators for custom field types
const customOperatorsByFieldType: Record<string, Operator[]> = {
  email: [
    { name: "Is", value: "equal", type: "binary" },
    { name: "Contains", value: "contains", type: "binary" },
    { name: "Ends With", value: "ends_with", type: "binary" },
    { name: "Is Empty", value: "is_empty", type: "unary" },
  ],
  datetime: [
    { name: "Before", value: "less", type: "binary" },
    { name: "After", value: "greater", type: "binary" },
    { name: "Between", value: "between", type: "range" },
    { name: "Is Empty", value: "is_empty", type: "unary" },
  ],
  currency: [
    { name: "Equals", value: "equal", type: "binary" },
    { name: "Greater Than", value: "greater", type: "binary" },
    { name: "Less Than", value: "less", type: "binary" },
    { name: "Between", value: "between", type: "range" },
  ],
};

export const operatorsByFieldType = {
  string: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.contains,
    operators.starts_with,
    operators.ends_with,
    operators.in,
    operators.not_in,
  ],
  number: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.less,
    operators.less_or_equal,
    operators.greater,
    operators.greater_or_equal,
    operators.between,
    operators.not_between,
    operators.in,
    operators.not_in,
  ],
  boolean: [
    operators.is_empty,
    operators.is_not_empty,
    operators.is_true,
    operators.is_false,
  ],
  date: [
    operators.is_empty,
    operators.is_not_empty,
    operators.equal,
    operators.not_equal,
    operators.less,
    operators.less_or_equal,
    operators.greater,
    operators.greater_or_equal,
    operators.between,
    operators.not_between,
    operators.in,
    operators.not_in,
  ],
};

interface OperatorsDemoProps {
  initialQuery?: Query;
  fields?: { label: string; value: string; type: "string" | "number" | "boolean" | "date" }[];
}

const OperatorsDemo = ({
  initialQuery = stringQuery,
  fields = stringFields
}: OperatorsDemoProps) => {
  const [query, setQuery] = useState<Query>(initialQuery);

  return (
    <div className="qb-container text-sm">
      <QueryBuilder
        value={query}
        onChange={(newValue) => setQuery(newValue)}
      >
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          operatorsByFieldType={operatorsByFieldType}
          renderRule={(props) => <Rule {...props} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof OperatorsDemo> = {
  title: "Core/Operators",
  component: OperatorsDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      story: { inline: false, height: "400px" },
      source: { code: null },
      description: {
        component: `
## Custom Operators

The library exports an \`operators\` constant with all available operators. You can pick and customize which operators are available for each field type.

\`\`\`tsx
import { operators } from "react-querybuilder-lite";

const operatorsByFieldType = {
  string: [operators.equal, operators.contains, operators.starts_with],
  number: [operators.equal, operators.greater, operators.less],
  boolean: [operators.is_true, operators.is_false],
  date: [operators.equal, operators.greater, operators.less],
};

<QueryBuilder.Builder
  fields={fields}
  operatorsByFieldType={operatorsByFieldType}
  ...
/>
\`\`\`

### Field Types

The library supports 4 field types: \`string\`, \`number\`, \`boolean\`, \`date\`

### Operators 

| Type | Default Operators |
|------|-------------------|
| **string** | \`is_empty\`, \`is_not_empty\`, \`equal\`, \`not_equal\`, \`contains\`, \`starts_with\`, \`ends_with\`, \`in\`, \`not_in\` |
| **number** | \`is_empty\`, \`is_not_empty\`, \`equal\`, \`not_equal\`, \`less\`, \`less_or_equal\`, \`greater\`, \`greater_or_equal\`, \`between\`, \`not_between\`, \`in\`, \`not_in\` |
| **boolean** | \`is_empty\`, \`is_not_empty\`, \`is_true\`, \`is_false\` |
| **date** | \`is_empty\`, \`is_not_empty\`, \`equal\`, \`not_equal\`, \`less\`, \`less_or_equal\`, \`greater\`, \`greater_or_equal\`, \`between\`, \`not_between\`, \`in\`, \`not_in\` |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OperatorsDemo>;

export const StringOperators: Story = {
  args: { initialQuery: stringQuery, fields: stringFields },
  parameters: {
    docs: {
      description: {
        story: "String fields support text-based operators: `equal`, `contains`, `starts_with`, `ends_with`, etc.",
      },
    },
  },
};

export const NumberOperators: Story = {
  args: { initialQuery: numberQuery, fields: numberFields },
  parameters: {
    docs: {
      description: {
        story: "Number fields support comparison operators: `less`, `greater`, `between`, etc.",
      },
    },
  },
};

export const BooleanOperators: Story = {
  args: { initialQuery: booleanQuery, fields: booleanFields },
  parameters: {
    docs: {
      description: {
        story: "Boolean fields support simple true/false checks: `is_true`, `is_false`.",
      },
    },
  },
};

export const DateOperators: Story = {
  args: { initialQuery: dateQuery, fields: dateFields },
  parameters: {
    docs: {
      description: {
        story: "Date fields support comparison and range operators similar to numbers.",
      },
    },
  },
};

// Self-contained Custom Field Types Demo
const CustomFieldTypesDemo = () => {
  const [query, setQuery] = useState<Query>(customQuery);

  return (
    <div className="qb-container text-sm">
      <QueryBuilder
        value={query}
        onChange={(newValue) => setQuery(newValue)}
      >
        <QueryBuilder.BuilderWithDnD
          fields={customFields}
          operatorsByFieldType={customOperatorsByFieldType}
          renderRule={(props) => <Rule {...props} />}
          renderGroup={(props) => <Group {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

export const CustomFieldTypes: StoryObj<typeof CustomFieldTypesDemo> = {
  render: () => <CustomFieldTypesDemo />,
  parameters: {
    docs: {
      description: {
        story: `
You can define **custom field types** beyond the defaults (string, number, boolean, date).

This example uses custom types: \`email\`, \`datetime\`, and \`currency\` with their own operators.

\`\`\`tsx
const customFields = [
  { label: "Email Address", value: "email", type: "email" },
  { label: "Scheduled At", value: "scheduledAt", type: "datetime" },
  { label: "Price", value: "price", type: "currency" },
];

const customOperatorsByFieldType = {
  email: [
    { name: "Is", value: "equal", type: "binary" },
    { name: "Contains", value: "contains", type: "binary" },
    { name: "Ends With", value: "ends_with", type: "binary" },
    { name: "Is Empty", value: "is_empty", type: "unary" },
  ],
  datetime: [
    { name: "Before", value: "less", type: "binary" },
    { name: "After", value: "greater", type: "binary" },
    { name: "Between", value: "between", type: "range" },
  ],
  currency: [
    { name: "Equals", value: "equal", type: "binary" },
    { name: "Greater Than", value: "greater", type: "binary" },
    { name: "Less Than", value: "less", type: "binary" },
    { name: "Between", value: "between", type: "range" },
  ],
};

<QueryBuilder.Builder
  fields={customFields}
  operatorsByFieldType={customOperatorsByFieldType}
  ...
/>
\`\`\`
        `,
      },
    },
  },
};
