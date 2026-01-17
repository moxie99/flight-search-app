// ============================================================================
// Trust Stats Component
// Animated statistics display showing key platform metrics
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, alpha, useTheme } from '@mui/material';
import {
  FlightTakeoff,
  People,
  Public,
  SupportAgent,
} from '@mui/icons-material';
import { TRUST_STATS } from '../../config/constants';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  isVisible: boolean;
  delay: number;
}

// -----------------------------------------------------------------------------
// Animated Counter Hook
// -----------------------------------------------------------------------------

const useAnimatedCounter = (
  end: number,
  duration: number = 2000,
  isVisible: boolean,
  delay: number = 0
): number => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(end * easeOutQuart));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [end, duration, isVisible, delay]);

  return count;
};

// -----------------------------------------------------------------------------
// Stat Item Component
// -----------------------------------------------------------------------------

const StatItem: React.FC<StatItemProps> = ({
  value,
  suffix,
  label,
  description,
  icon,
  isVisible,
  delay,
}) => {
  const animatedValue = useAnimatedCounter(value, 2000, isVisible, delay);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: { xs: 2, md: 3 },
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.2)} 100%)`,
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h3"
        component="div"
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          fontSize: { xs: '2rem', md: '2.5rem' },
          lineHeight: 1,
          mb: 0.5,
        }}
      >
        {animatedValue}
        {suffix}
      </Typography>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          fontSize: { xs: '1rem', md: '1.125rem' },
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.8rem', md: '0.875rem' },
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Icon Mapper
// -----------------------------------------------------------------------------

const getStatIcon = (id: string): React.ReactNode => {
  const iconProps = { sx: { fontSize: 32 } };
  
  switch (id) {
    case 'airlines':
      return <FlightTakeoff {...iconProps} />;
    case 'travelers':
      return <People {...iconProps} />;
    case 'destinations':
      return <Public {...iconProps} />;
    case 'support':
      return <SupportAgent {...iconProps} />;
    default:
      return <FlightTakeoff {...iconProps} />;
  }
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const TrustStats: React.FC = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 6, md: 8 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {TRUST_STATS.map((stat, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={stat.id}>
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
                icon={getStatIcon(stat.id)}
                isVisible={isVisible}
                delay={index * 150}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TrustStats;
