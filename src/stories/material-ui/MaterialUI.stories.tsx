import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query } from '../../lib/types';
import { lightTheme, darkTheme } from './theme';
import MuiRule from './components/MuiRule';
import MuiGroup from './components/MuiGroup';

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

const withMuiTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Story />
      </Box>
    </ThemeProvider>
  );
};

const MaterialUIDemo = () => {
  const [query, setQuery] = useState<Query>(defaultQuery);

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.5,
            letterSpacing: '-0.02em',
          }}
        >
          Material UI
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Google's Material Design system for clean, modern interfaces
        </Typography>
      </Box>

      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          renderRule={(props) => <MuiRule {...props} />}
          renderGroup={(props) => <MuiGroup {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </Box>
  );
};

const meta: Meta<typeof MaterialUIDemo> = {
  title: 'UI Libraries/Material UI',
  component: MaterialUIDemo,
  decorators: [withMuiTheme],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '600px' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MaterialUIDemo>;

export const Default: Story = {};
