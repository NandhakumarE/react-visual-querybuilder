import { createTheme, type ThemeOptions } from '@mui/material/styles';

// Google-inspired blue palette
const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 13,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '6px 14px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8', // Google Blue
      light: '#4285f4',
      dark: '#1557b0',
    },
    secondary: {
      main: '#34a853', // Google Green
      light: '#5bb974',
      dark: '#1e8e3e',
    },
    error: {
      main: '#ea4335', // Google Red
    },
    warning: {
      main: '#fbbc04', // Google Yellow
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#e8eaed',
    action: {
      hover: 'rgba(26, 115, 232, 0.04)',
      selected: 'rgba(26, 115, 232, 0.08)',
    },
  },
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8ab4f8', // Google Blue (dark mode)
      light: '#aecbfa',
      dark: '#669df6',
    },
    secondary: {
      main: '#81c995', // Google Green (dark mode)
      light: '#a8dab5',
      dark: '#5bb974',
    },
    error: {
      main: '#f28b82',
    },
    warning: {
      main: '#fdd663',
    },
    background: {
      default: '#202124',
      paper: '#292a2d',
    },
    text: {
      primary: '#e8eaed',
      secondary: '#9aa0a6',
    },
    divider: '#3c4043',
    action: {
      hover: 'rgba(138, 180, 248, 0.08)',
      selected: 'rgba(138, 180, 248, 0.12)',
    },
  },
});
