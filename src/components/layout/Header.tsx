// ============================================================================
// Header Component
// App header with logo and navigation
// ============================================================================

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useScrollTrigger,
  alpha,
} from '@mui/material';
import { Flight } from '@mui/icons-material';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const Header: React.FC = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 2 : 0}
      sx={{
        backgroundColor: trigger
          ? alpha('#ffffff', 0.95)
          : 'transparent',
        backdropFilter: trigger ? 'blur(10px)' : 'none',
        borderBottom: trigger ? 1 : 0,
        borderColor: 'divider',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
                boxShadow: '0 4px 12px rgba(26, 54, 93, 0.3)',
              }}
            >
              <Flight
                sx={{
                  fontSize: 26,
                  color: 'white',
                  transform: 'rotate(45deg)',
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: trigger ? 'primary.main' : 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  transition: 'color 0.3s ease',
                }}
              >
                SkySearch
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: trigger ? 'text.secondary' : alpha('#ffffff', 0.8),
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  transition: 'color 0.3s ease',
                }}
              >
                Find your perfect flight
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
