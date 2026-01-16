// ============================================================================
// Hero Section Component
// Landing section with background and search form
// ============================================================================

import React from 'react';
import { Box, Container, Typography, alpha } from '@mui/material';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface HeroSectionProps {
  children: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 'auto', md: 420 },
        pt: { xs: 4, md: 6 },
        pb: { xs: 4, md: 12 },
        overflow: 'hidden',
        // Gradient background
        background: `linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #1a365d 100%)`,
        // Animated gradient overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, ${alpha('#4299e1', 0.15)} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, ${alpha('#805ad5', 0.1)} 0%, transparent 40%),
            radial-gradient(ellipse at 60% 80%, ${alpha('#38b2ac', 0.1)} 0%, transparent 40%)
          `,
          animation: 'gradientShift 15s ease infinite',
        },
        '@keyframes gradientShift': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.7,
          },
        },
        // Decorative elements
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.03),
          filter: 'blur(60px)',
        },
      }}
    >
      {/* Pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77),
            linear-gradient(60deg, #ffffff77 25%, transparent 25.5%, transparent 75%, #ffffff77 75%, #ffffff77)
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Text */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 700,
              mb: 1.5,
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            }}
          >
            Discover Your Next Adventure
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: alpha('#ffffff', 0.85),
              fontWeight: 400,
              fontSize: { xs: '0.95rem', md: '1.125rem' },
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Compare flights from hundreds of airlines and find the best deals
            for your journey
          </Typography>
        </Box>

        {/* Search Form */}
        <Box
          sx={{
            maxWidth: 1000,
            mx: 'auto',
            position: 'relative',
            // Lift the form above the hero for visual overlap effect
            transform: { md: 'translateY(40px)' },
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
