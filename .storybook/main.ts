import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  "stories": [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  // Disable auto-composition of external storybooks from dependencies
  "refs": () => ({}),
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
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

      // Set base path for GitHub Pages (when STORYBOOK_BASE env is set)
      if (process.env.STORYBOOK_BASE) {
        config.base = process.env.STORYBOOK_BASE;
      }

      return config;
  },
};
export default config;