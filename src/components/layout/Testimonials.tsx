// ============================================================================
// Testimonials Component
// Customer reviews with ratings and avatars
// ============================================================================

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Rating,
  alpha,
} from '@mui/material';
import { FormatQuote, Star } from '@mui/icons-material';
import { TESTIMONIALS } from '../../config/constants';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TestimonialCardProps {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

// -----------------------------------------------------------------------------
// Testimonial Card Component
// -----------------------------------------------------------------------------

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  avatar,
  rating,
  text,
  date,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          borderColor: 'primary.light',
        },
      }}
    >
      {/* Quote Icon */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: (theme) => alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <FormatQuote sx={{ fontSize: 48, transform: 'scaleX(-1)' }} />
      </Box>

      {/* Rating */}
      <Box sx={{ mb: 2 }}>
        <Rating
          value={rating}
          readOnly
          size="small"
          icon={<Star sx={{ fontSize: 20, color: '#faaf00' }} />}
          emptyIcon={<Star sx={{ fontSize: 20 }} />}
        />
      </Box>

      {/* Quote Text */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.primary',
          lineHeight: 1.8,
          mb: 3,
          flex: 1,
          fontSize: { xs: '0.95rem', md: '1rem' },
          fontStyle: 'italic',
        }}
      >
        "{text}"
      </Typography>

      {/* Author Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pt: 3,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: 48,
            height: 48,
            border: 2,
            borderColor: 'primary.light',
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
            }}
          >
            {location}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.7rem',
          }}
        >
          {formattedDate}
        </Typography>
      </Box>
    </Paper>
  );
};

// -----------------------------------------------------------------------------
// Stats Bar Component
// -----------------------------------------------------------------------------

const ReviewStats: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, md: 4 },
        flexWrap: 'wrap',
        mb: { xs: 4, md: 6 },
        py: 3,
        px: 4,
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        borderRadius: 3,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
          }}
        >
          4.9
        </Typography>
        <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ mt: 0.5 }} />
        <Typography variant="caption" color="text.secondary" display="block">
          Average Rating
        </Typography>
      </Box>

      <Box
        sx={{
          width: 1,
          height: 50,
          backgroundColor: 'divider',
          display: { xs: 'none', sm: 'block' },
        }}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
          }}
        >
          50K+
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Reviews
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          From Real Travelers
        </Typography>
      </Box>

      <Box
        sx={{
          width: 1,
          height: 50,
          backgroundColor: 'divider',
          display: { xs: 'none', sm: 'block' },
        }}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'success.main',
            lineHeight: 1,
          }}
        >
          98%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Satisfaction
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Would Recommend
        </Typography>
      </Box>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const Testimonials: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              mb: 2,
              borderRadius: 5,
              backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.1),
              color: 'warning.dark',
            }}
          >
            <Star fontSize="small" />
            <Typography variant="caption" fontWeight={600} textTransform="uppercase">
              Testimonials
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
            What Our Travelers Say
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
            Join thousands of satisfied customers who found their perfect flights with SpotterSearch
          </Typography>
        </Box>

        {/* Review Stats */}
        <ReviewStats />

        {/* Testimonials Grid */}
        <Grid container spacing={3}>
          {TESTIMONIALS.map((testimonial) => (
            <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
              <TestimonialCard
                name={testimonial.name}
                location={testimonial.location}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
                text={testimonial.text}
                date={testimonial.date}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;
