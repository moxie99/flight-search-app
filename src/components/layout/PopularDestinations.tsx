// ============================================================================
// Popular Destinations Component
// Grid of destination cards with images and pricing
// ============================================================================

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  alpha,
  Skeleton,
} from '@mui/material';
import { TrendingUp, ArrowForward, FlightTakeoff } from '@mui/icons-material';
import { POPULAR_DESTINATIONS } from '../../config/constants';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DestinationCardProps {
  city: string;
  country: string;
  iataCode: string;
  price: number;
  image: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Destination Card Component
// -----------------------------------------------------------------------------

const DestinationCard: React.FC<DestinationCardProps> = ({
  city,
  country,
  iataCode,
  price,
  image,
  description,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <Card
      sx={{
        position: 'relative',
        height: { xs: 280, md: 320 },
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          '& .destination-image': {
            transform: 'scale(1.1)',
          },
          '& .destination-overlay': {
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
          },
          '& .destination-cta': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Image Skeleton */}
      {!imageLoaded && !imageError && (
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* Background Image */}
      <CardMedia
        component="img"
        image={imageError ? '/placeholder-destination.jpg' : image}
        alt={`${city}, ${country}`}
        className="destination-image"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: imageLoaded ? 1 : 0,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        className="destination-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Price Tag */}
      <Chip
        label={`From $${price}`}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'primary.main',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.875rem',
          px: 1,
          '& .MuiChip-label': {
            px: 1,
          },
        }}
      />

      {/* Airport Code Badge */}
      <Chip
        icon={<FlightTakeoff sx={{ fontSize: 14, color: 'inherit' }} />}
        label={iataCode}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          backgroundColor: alpha('#ffffff', 0.9),
          color: 'text.primary',
          fontWeight: 600,
          fontSize: '0.75rem',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          color: 'white',
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {city}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.9,
            mb: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {country}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            opacity: 0.8,
            fontStyle: 'italic',
          }}
        >
          {description}
        </Typography>

        {/* Hover CTA */}
        <Box
          className="destination-cta"
          sx={{
            mt: 2,
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'all 0.3s ease',
          }}
        >
          <Button
            variant="contained"
            size="small"
            endIcon={<ArrowForward />}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.9),
              },
            }}
          >
            Explore Flights
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const PopularDestinations: React.FC = () => {
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
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
            }}
          >
            <TrendingUp fontSize="small" />
            <Typography variant="caption" fontWeight={600} textTransform="uppercase">
              Trending Now
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
            Popular Destinations
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
            Discover the most sought-after destinations and find amazing deals for your next adventure
          </Typography>
        </Box>

        {/* Destination Grid */}
        <Grid container spacing={3}>
          {POPULAR_DESTINATIONS.map((destination) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={destination.id}>
              <DestinationCard
                city={destination.city}
                country={destination.country}
                iataCode={destination.iataCode}
                price={destination.price}
                image={destination.image}
                description={destination.description}
              />
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              borderWidth: 2,
              fontWeight: 600,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Explore All Destinations
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PopularDestinations;
