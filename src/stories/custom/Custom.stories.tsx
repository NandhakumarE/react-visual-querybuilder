import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query } from '../../lib/types';
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
        { id: 'rule-3', field: 'totalOrders', operator: 'greater', value: 5 },
      ],
    },
    {
      id: 'group-2',
      combinator: 'and',
      rules: [
        { id: 'rule-4', field: 'email', operator: 'contains', value: '@gmail.com' },
        { id: 'rule-5', field: 'lastActivity', operator: 'between', value: ['2024-01-01', '2024-12-31'] },
      ],
    },
    {
      id: 'group-3',
      combinator: 'or',
      rules: [
        { id: 'rule-6', field: 'isSubscribed', operator: 'is_true', value: '' },
        { id: 'rule-7', field: 'totalOrders', operator: 'greater_or_equal', value: 10 },
      ],
    },
  ],
};

const fields = [
  { label: 'First Purchase Date', value: 'firstPurchaseDate', type: 'date' as const },
  { label: 'High Purchase Power', value: 'highPurchasePower', type: 'boolean' as const },
  { label: 'Email', value: 'email', type: 'string' as const },
  { label: 'Total Orders', value: 'totalOrders', type: 'number' as const },
  { label: 'Last Activity', value: 'lastActivity', type: 'date' as const },
  { label: 'Is Subscribed', value: 'isSubscribed', type: 'boolean' as const },
];

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
