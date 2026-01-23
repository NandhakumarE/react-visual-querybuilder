import type { Preview } from '@storybook/react-vite';
import type { Decorator } from '@storybook/react';
import '../src/stories/stories.css';

const withThemeWrapper: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'light';
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withThemeWrapper],
};

export default preview;
