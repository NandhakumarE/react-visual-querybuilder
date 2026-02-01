import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query, Operator } from '../../lib/types';
import CustomRule from './components/CustomRule';
import CustomGroup from './components/CustomGroup';
import './styles.css';

const defaultQuery: Query = {
  id: 'root',
  combinator: 'and',
  rules: [
    {
      id: 'group-1',
      combinator: 'or',
      rules: [
        { id: 'rule-1', field: 'firstPurchaseDate', operator: 'greater', value: '2024-01-01' },
        { id: 'rule-2', field: 'highPurchasePower', operator: 'is_true', value: '' },
        { id: 'rule-3', field: 'totalSpend', operator: 'greater', value: 5000 },
      ],
    },
    {
      id: 'group-2',
      combinator: 'and',
      rules: [
        { id: 'rule-4', field: 'email', operator: 'ends_with', value: '@gmail.com' },
        { id: 'rule-5', field: 'lastActivity', operator: 'between', value: ['2024-01-01T00:00', '2024-12-31T23:59'] },
      ],
    },
    {
      id: 'group-3',
      combinator: 'or',
      rules: [
        { id: 'rule-6', field: 'isSubscribed', operator: 'is_true', value: '' },
        { id: 'rule-7', field: 'totalSpend', operator: 'greater', value: 10000 },
      ],
    },
  ],
};

const fields = [
  { label: 'First Purchase Date', value: 'firstPurchaseDate', type: 'date' },
  { label: 'High Purchase Power', value: 'highPurchasePower', type: 'boolean' },
  { label: 'Email', value: 'email', type: 'email' },
  { label: 'Total Spend', value: 'totalSpend', type: 'currency' },
  { label: 'Last Activity', value: 'lastActivity', type: 'datetime' },
  { label: 'Is Subscribed', value: 'isSubscribed', type: 'boolean' },
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
  date: [
    { name: 'Is', value: 'equal', type: 'binary' },
    { name: 'Before', value: 'less', type: 'binary' },
    { name: 'After', value: 'greater', type: 'binary' },
    { name: 'Between', value: 'between', type: 'range' },
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

const withCustomTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  return (
    <div className={`custom-qb-wrapper ${isDark ? 'dark' : ''}`}>
      <Story />
    </div>
  );
};

const CustomDemo = () => {
  const [query, setQuery] = useState<Query>(defaultQuery);

  return (
    <div className="custom-qb-container">
      <div className="custom-qb-header">
        <div>
          <h2 className="custom-qb-title">Custom Style</h2>
          <p className="custom-qb-subtitle">Fully customizable with plain CSS and your own design system</p>
        </div>
      </div>
      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          operatorsByFieldType={operatorsByFieldType}
          renderRule={(props) => <CustomRule {...props} />}
          renderGroup={(props) => <CustomGroup {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </div>
  );
};

const meta: Meta<typeof CustomDemo> = {
  title: 'UI Libraries/Custom Style UI',
  component: CustomDemo,
  decorators: [withCustomTheme],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '700px' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CustomDemo>;

export const Default: Story = {};
