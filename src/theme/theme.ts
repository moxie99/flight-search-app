// ============================================================================
// MUI Theme Configuration
// Custom theme for Flight Search Engine
// ============================================================================

import { createTheme, alpha } from '@mui/material/styles';

// -----------------------------------------------------------------------------
// Color Palette
// -----------------------------------------------------------------------------

const colors = {
  // Primary - Deep blue for trust and professionalism
  primary: {
    main: '#1a365d',
    light: '#2c5282',
    dark: '#0d1b2a',
    contrastText: '#ffffff',
  },
  // Secondary - Vibrant coral for CTAs and highlights
  secondary: {
    main: '#e85d4c',
    light: '#ff7b6b',
    dark: '#c43e2e',
    contrastText: '#ffffff',
  },
  // Accent - Teal for success states and positive indicators
  accent: {
    main: '#0d9488',
    light: '#14b8a6',
    dark: '#0f766e',
  },
  // Neutrals
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// -----------------------------------------------------------------------------
// Theme Creation
// -----------------------------------------------------------------------------

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
    grey: colors.grey,
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[600],
    },
    divider: colors.grey[200],
  },
  
  typography: {
    fontFamily: '"DM Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: colors.grey[500],
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ...Array(18).fill('none'),
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.secondary.main} 0%, ${colors.secondary.light} 100%)`,
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: `1px solid ${colors.grey[100]}`,
          transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: colors.grey[50],
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: '#ffffff',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            },
            '& fieldset': {
              borderColor: colors.grey[200],
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderColor: colors.grey[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: `1px solid ${colors.grey[100]}`,
        },
        option: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '10px 12px',
          '&[aria-selected="true"]': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
          '&.Mui-focused': {
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: colors.grey[100],
          '&:hover': {
            backgroundColor: colors.grey[200],
          },
        },
        colorPrimary: {
          backgroundColor: alpha(colors.primary.main, 0.1),
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.2),
          },
        },
        colorSecondary: {
          backgroundColor: alpha(colors.secondary.main, 0.1),
          color: colors.secondary.main,
          '&:hover': {
            backgroundColor: alpha(colors.secondary.main, 0.2),
          },
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
        },
        track: {
          border: 'none',
        },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: '#fff',
          border: `2px solid ${colors.primary.main}`,
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${alpha(colors.primary.main, 0.16)}`,
          },
        },
        rail: {
          backgroundColor: colors.grey[200],
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.grey[200],
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: colors.grey[100],
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.grey[800],
          borderRadius: 8,
          fontSize: '0.8125rem',
          padding: '8px 12px',
        },
      },
    },
  },
});

export default theme;
