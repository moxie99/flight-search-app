// ============================================================================
// Loading Overlay Component
// Full-screen loading state with animated airplane
// ============================================================================

import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const fly = keyframes`
  0% {
    transform: translateX(-100px) translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateX(0) translateY(-20px) rotate(0deg);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100px) translateY(0) rotate(0deg);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
`;

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = 'Searching for the best flights...',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      {/* Animated Airplane */}
      <Box
        sx={{
          position: 'relative',
          width: 200,
          height: 60,
          mb: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          sx={{
            position: 'absolute',
            width: 40,
            height: 40,
            fill: 'primary.main',
            animation: `${fly} 2s ease-in-out infinite`,
            left: '50%',
            top: '50%',
            marginLeft: '-20px',
            marginTop: '-20px',
          }}
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </Box>
        
        {/* Trail dots */}
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.light',
              left: `${30 + i * 20}%`,
              top: '50%',
              marginTop: '-4px',
              animation: `${pulse} 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {message}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Comparing prices across multiple airlines
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
