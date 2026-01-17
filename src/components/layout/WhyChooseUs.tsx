// ============================================================================
// Why Choose Us Component
// Feature highlights section with icons and descriptions
// ============================================================================

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  alpha,
} from '@mui/material';
import {
  LocalOffer,
  Visibility,
  Speed,
  Security,
  Verified,
} from '@mui/icons-material';
import { WHY_CHOOSE_US_FEATURES } from '../../config/constants';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

// -----------------------------------------------------------------------------
// Icon Mapper
// -----------------------------------------------------------------------------

const getFeatureIcon = (iconName: string): React.ReactNode => {
  const iconProps = { sx: { fontSize: 32 } };

  switch (iconName) {
    case 'LocalOffer':
      return <LocalOffer {...iconProps} />;
    case 'Visibility':
      return <Visibility {...iconProps} />;
    case 'Speed':
      return <Speed {...iconProps} />;
    case 'Security':
      return <Security {...iconProps} />;
    default:
      return <Verified {...iconProps} />;
  }
};

// -----------------------------------------------------------------------------
// Feature Card Component
// -----------------------------------------------------------------------------

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  index,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        height: '100%',
        borderRadius: 3,
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 40px rgba(26, 54, 93, 0.12)',
          borderColor: 'primary.light',
          '&::before': {
            opacity: 1,
          },
          '& .feature-icon-wrapper': {
            transform: 'scale(1.1)',
            backgroundColor: (theme) => theme.palette.primary.main,
            color: 'white',
          },
        },
      }}
    >
      {/* Icon */}
      <Box
        className="feature-icon-wrapper"
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          transition: 'all 0.3s ease',
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: 'text.primary',
          fontSize: { xs: '1.05rem', md: '1.15rem' },
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          lineHeight: 1.7,
          fontSize: { xs: '0.875rem', md: '0.925rem' },
        }}
      >
        {description}
      </Typography>

      {/* Feature Number */}
      <Typography
        sx={{
          position: 'absolute',
          top: 16,
          right: 20,
          fontSize: '3rem',
          fontWeight: 700,
          color: (theme) => alpha(theme.palette.primary.main, 0.06),
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Typography>
    </Paper>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const WhyChooseUs: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: (theme) => alpha(theme.palette.grey[100], 0.5),
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              mb: 2,
              borderRadius: 5,
              backgroundColor: (theme) => alpha(theme.palette.success.main, 0.1),
              color: 'success.dark',
            }}
          >
            <Verified fontSize="small" />
            <Typography variant="caption" fontWeight={600} textTransform="uppercase">
              Why SpotterSearch
            </Typography>
          </Box>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: 'text.primary',
            }}
          >
            Why Travelers Choose Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            We're committed to making your travel experience seamless, affordable, and worry-free
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3}>
          {WHY_CHOOSE_US_FEATURES.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.id}>
              <FeatureCard
                icon={getFeatureIcon(feature.icon)}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
