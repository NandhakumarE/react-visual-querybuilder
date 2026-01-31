import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { ConfigProvider, App, Typography, theme as antTheme } from 'antd';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query, Operator } from '../../lib/types';
import { lightTheme, darkTheme } from './theme';
import AntRule from './components/AntRule';
import AntGroup from './components/AntGroup';

const defaultQuery: Query = {
  id: 'root',
  combinator: 'and',
  rules: [
    { id: 'rule-1', field: 'firstName', operator: 'equal', value: 'John' },
    { id: 'rule-2', field: 'email', operator: 'ends_with', value: '@company.com' },
    {
      id: 'group-1',
      combinator: 'or',
      rules: [
        { id: 'rule-3', field: 'age', operator: 'greater', value: 25 },
        { id: 'rule-4', field: 'price', operator: 'between', value: [50000, 100000] },
      ],
    },
    { id: 'rule-5', field: 'isActive', operator: 'is_true' },
    { id: 'rule-6', field: 'scheduledAt', operator: 'greater', value: '2023-01-01T09:00' },
  ],
};

const fields = [
  { label: 'First Name', value: 'firstName', type: 'string' },
  { label: 'Last Name', value: 'lastName', type: 'string' },
  { label: 'Email', value: 'email', type: 'email' },
  { label: 'Age', value: 'age', type: 'number' },
  { label: 'Price', value: 'price', type: 'currency' },
  { label: 'Is Active', value: 'isActive', type: 'boolean' },
  { label: 'Scheduled At', value: 'scheduledAt', type: 'datetime' },
];

const operatorsByFieldType: Record<string, Operator[]> = {
  string: [
    { name: 'Is', value: 'equal', type: 'binary' },
    { name: 'Contains', value: 'contains', type: 'binary' },
    { name: 'Starts With', value: 'starts_with', type: 'binary' },
    { name: 'Ends With', value: 'ends_with', type: 'binary' },
    { name: 'Is Empty', value: 'is_empty', type: 'unary' },
  ],
  number: [
    { name: 'Equals', value: 'equal', type: 'binary' },
    { name: 'Greater Than', value: 'greater', type: 'binary' },
    { name: 'Less Than', value: 'less', type: 'binary' },
    { name: 'Between', value: 'between', type: 'range' },
  ],
  boolean: [
    { name: 'Is True', value: 'is_true', type: 'unary' },
    { name: 'Is False', value: 'is_false', type: 'unary' },
  ],
  email: [
    { name: 'Is', value: 'equal', type: 'binary' },
    { name: 'Contains', value: 'contains', type: 'binary' },
    { name: 'Ends With', value: 'ends_with', type: 'binary' },
    { name: 'Is Empty', value: 'is_empty', type: 'unary' },
  ],
  datetime: [
    { name: 'Before', value: 'less', type: 'binary' },
    { name: 'After', value: 'greater', type: 'binary' },
    { name: 'Between', value: 'between', type: 'range' },
    { name: 'Is Empty', value: 'is_empty', type: 'unary' },
  ],
  currency: [
    { name: 'Equals', value: 'equal', type: 'binary' },
    { name: 'Greater Than', value: 'greater', type: 'binary' },
    { name: 'Less Than', value: 'less', type: 'binary' },
    { name: 'Between', value: 'between', type: 'range' },
  ],
};

const withAntTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  return (
    <ConfigProvider
      theme={{
        ...(isDark ? darkTheme : lightTheme),
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      }}
    >
      <App>
        <div
          style={{
            padding: 24,
            minHeight: '100vh',
            backgroundColor: isDark ? '#0f0d15' : '#faf5ff',
          }}
        >
          <Story />
        </div>
      </App>
    </ConfigProvider>
  );
};

const AntDesignDemo = () => {
  const [query, setQuery] = useState<Query>(defaultQuery);
  const { token } = antTheme.useToken();

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            marginBottom: 4,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Builder Designed With Ant Design
        </Typography.Title>
        <Typography.Text style={{ color: token.colorTextSecondary }}>
          Enterprise-class UI design language for web applications
        </Typography.Text>
      </div>

      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          operatorsByFieldType={operatorsByFieldType}
          renderRule={(props) => <AntRule {...props} />}
          renderGroup={(props) => <AntGroup {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof AntDesignDemo> = {
  title: 'UI Libraries/Ant Design',
  component: AntDesignDemo,
  decorators: [withAntTheme],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '600px' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AntDesignDemo>;

export const Default: Story = {};
