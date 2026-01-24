import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { ConfigProvider, App, Typography, theme as antTheme } from 'antd';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query } from '../../lib/types';
import { lightTheme, darkTheme } from './theme';
import AntRule from './components/AntRule';
import AntGroup from './components/AntGroup';

const defaultQuery: Query = {
  id: 'root',
  combinator: 'and',
  rules: [
    { id: 'rule-1', field: 'firstName', operator: 'equal', value: 'John' },
    { id: 'rule-2', field: 'email', operator: 'contains', value: '@company.com' },
    {
      id: 'group-1',
      combinator: 'or',
      rules: [
        { id: 'rule-3', field: 'age', operator: 'greater', value: 25 },
        { id: 'rule-4', field: 'salary', operator: 'between', value: [50000, 100000] },
      ],
    },
    { id: 'rule-5', field: 'isActive', operator: 'is_true' },
    { id: 'rule-6', field: 'hireDate', operator: 'greater', value: '2023-01-01' },
  ],
};

const fields = [
  { label: 'First Name', value: 'firstName', type: 'string' as const },
  { label: 'Last Name', value: 'lastName', type: 'string' as const },
  { label: 'Email', value: 'email', type: 'string' as const },
  { label: 'Age', value: 'age', type: 'number' as const },
  { label: 'Salary', value: 'salary', type: 'number' as const },
  { label: 'Is Active', value: 'isActive', type: 'boolean' as const },
  { label: 'Hire Date', value: 'hireDate', type: 'date' as const },
];

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
          Ant Design
        </Typography.Title>
        <Typography.Text style={{ color: token.colorTextSecondary }}>
          Enterprise-class UI design language for web applications
        </Typography.Text>
      </div>

      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
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
