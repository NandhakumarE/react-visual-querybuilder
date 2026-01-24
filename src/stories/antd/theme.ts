import type { ThemeConfig } from 'antd';

// Violet/Purple enterprise palette
export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#7c3aed', // Violet
    colorSuccess: '#10b981', // Emerald
    colorWarning: '#f59e0b', // Amber
    colorError: '#ef4444', // Red
    colorInfo: '#7c3aed', // Violet
    borderRadius: 8,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#faf5ff', // Very light purple tint
    colorBorder: '#e9d5ff', // Light purple border
    colorBorderSecondary: '#f3e8ff',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    controlHeight: 32,
    motionDurationMid: '0.2s',
  },
  components: {
    Button: {
      fontWeight: 500,
      paddingInline: 14,
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 16,
    },
    Segmented: {
      itemSelectedBg: '#7c3aed',
      itemSelectedColor: '#ffffff',
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#a78bfa', // Light violet for dark mode
    colorSuccess: '#34d399',
    colorWarning: '#fbbf24',
    colorError: '#f87171',
    colorInfo: '#a78bfa',
    borderRadius: 8,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    colorBgContainer: '#1e1b2e', // Dark purple tint
    colorBgElevated: '#2d2640',
    colorBgLayout: '#0f0d15', // Very dark purple
    colorBorder: '#3d3555',
    colorBorderSecondary: '#2d2640',
    colorText: '#f3f4f6',
    colorTextSecondary: '#9ca3af',
    controlHeight: 32,
    motionDurationMid: '0.2s',
  },
  components: {
    Button: {
      fontWeight: 500,
      paddingInline: 14,
    },
    Card: {
      headerBg: 'transparent',
      paddingLG: 16,
    },
    Segmented: {
      itemSelectedBg: '#a78bfa',
      itemSelectedColor: '#0f0d15',
    },
  },
};
