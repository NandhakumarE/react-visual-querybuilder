import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/react-vite",
  viteFinal: (config) => {
      // Filter out vite-plugin-dts (not needed for Storybook, causes build errors)
      config.plugins = (config.plugins || []).filter((plugin) => {
        const pluginName = plugin && typeof plugin === 'object' && 'name' in plugin ? plugin.name : '';
        return pluginName !== 'vite:dts';
      });

      // Add tailwindcss
      config.plugins.push(tailwindcss());

      config.build = {
        ...config.build,
        chunkSizeWarningLimit: 1500,
      };

      return config;
  },
};
export default config;