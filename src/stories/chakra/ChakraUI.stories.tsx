import { useState } from 'react';
import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { ChakraProvider, Box, Heading, Text } from '@chakra-ui/react';
import { QueryBuilder } from '../../lib/components/QueryBuilder';
import type { Query, Operator } from '../../lib/types';
import { system } from './theme';
import ChakraRule from './components/ChakraRule';
import ChakraGroup from './components/ChakraGroup';

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

const withChakraTheme: Decorator = (Story, context) => {
  const isDark = context.globals.theme === 'dark';
  return (
    <ChakraProvider value={system}>
      <Box
        p={6}
        minH="100vh"
        bg={{ base: '#f0fdfa', _dark: '#042f2e' }}
        className={isDark ? 'dark' : ''}
      >
        <Story />
      </Box>
    </ChakraProvider>
  );
};

const ChakraUIDemo = () => {
  const [query, setQuery] = useState<Query>(defaultQuery);

  return (
    <Box maxW="1000px">
      <Box mb={6}>
        <Heading
          size="lg"
          fontWeight="600"
          letterSpacing="-0.02em"
          color={{ base: 'teal.900', _dark: 'teal.50' }}
          mb={1}
        >
          Builder Designed With Chakra UI
        </Heading>
        <Text color={{ base: 'teal.700', _dark: 'teal.300' }} fontSize="14px">
          Simple, modular and accessible component library
        </Text>
      </Box>

      <QueryBuilder value={query} onChange={setQuery}>
        <QueryBuilder.BuilderWithDnD
          fields={fields}
          operatorsByFieldType={operatorsByFieldType}
          renderRule={(props) => <ChakraRule {...props} />}
          renderGroup={(props) => <ChakraGroup {...props} rootId={query.id} />}
        />
      </QueryBuilder>
    </Box>
  );
};

const meta: Meta<typeof ChakraUIDemo> = {
  title: 'UI Libraries/Chakra UI',
  component: ChakraUIDemo,
  decorators: [withChakraTheme],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { inline: false, height: '600px' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChakraUIDemo>;

export const Default: Story = {};
