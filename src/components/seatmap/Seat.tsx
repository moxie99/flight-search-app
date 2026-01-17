// ============================================================================
// Seat Component
// Individual seat visualization with status colors, hover effects, and accessibility
// ============================================================================

import React, { memo } from 'react';
import { Box, Tooltip, alpha, Typography } from '@mui/material';
import {
  AirlineSeatReclineNormal,
  Block,
  Star,
} from '@mui/icons-material';
import type { ProcessedSeat, SeatAvailabilityStatus } from '../../types';
import { SEAT_CHARACTERISTIC_LABELS } from '../../types/seatmap.types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SeatProps {
  seat: ProcessedSeat;
  onSelect?: (seat: ProcessedSeat) => void;
  size?: 'small' | 'medium' | 'large';
  showPrice?: boolean;
}

// -----------------------------------------------------------------------------
// Seat Status Colors
// -----------------------------------------------------------------------------

const getSeatColors = (
  seat: ProcessedSeat,
  status: SeatAvailabilityStatus
): { bg: string; border: string; text: string; hoverBg: string } => {
  // Selected state takes priority
  if (seat.isSelected) {
    return {
      bg: '#38a169',
      border: '#2f855a',
      text: '#ffffff',
      hoverBg: '#2f855a',
    };
  }

  // Unavailable states
  if (status === 'OCCUPIED') {
    return {
      bg: '#e2e8f0',
      border: '#cbd5e0',
      text: '#a0aec0',
      hoverBg: '#e2e8f0',
    };
  }

  if (status === 'BLOCKED') {
    return {
      bg: '#fed7d7',
      border: '#fc8181',
      text: '#c53030',
      hoverBg: '#fed7d7',
    };
  }

  // Available states with variations
  if (seat.isExtraLegroom) {
    return {
      bg: '#e9d8fd',
      border: '#9f7aea',
      text: '#553c9a',
      hoverBg: '#d6bcfa',
    };
  }

  if (seat.isPremium) {
    return {
      bg: '#fefcbf',
      border: '#d69e2e',
      text: '#744210',
      hoverBg: '#faf089',
    };
  }

  if (seat.isExitRow) {
    return {
      bg: '#feebc8',
      border: '#ed8936',
      text: '#c05621',
      hoverBg: '#fbd38d',
    };
  }

  // Standard available seat
  return {
    bg: '#ebf8ff',
    border: '#4299e1',
    text: '#2b6cb0',
    hoverBg: '#bee3f8',
  };
};

// -----------------------------------------------------------------------------
// Get Seat Characteristics Label
// -----------------------------------------------------------------------------

const getSeatCharacteristicsLabel = (seat: ProcessedSeat): string => {
  const labels: string[] = [];
  
  if (seat.isWindow) labels.push('Window');
  if (seat.isAisle) labels.push('Aisle');
  if (seat.isMiddle && !seat.isWindow && !seat.isAisle) labels.push('Middle');
  if (seat.isExtraLegroom) labels.push('Extra Legroom');
  if (seat.isExitRow) labels.push('Exit Row');
  if (seat.isPremium) labels.push('Premium');
  
  // Add any other characteristics
  seat.characteristicsCodes?.forEach(code => {
    const label = SEAT_CHARACTERISTIC_LABELS[code];
    if (label && !labels.includes(label)) {
      labels.push(label);
    }
  });
  
  return labels.join(' • ');
};

// -----------------------------------------------------------------------------
// Seat Size Configurations
// -----------------------------------------------------------------------------

const seatSizes = {
  small: { width: 28, height: 32, fontSize: '0.6rem', iconSize: 14 },
  medium: { width: 36, height: 40, fontSize: '0.7rem', iconSize: 18 },
  large: { width: 44, height: 48, fontSize: '0.8rem', iconSize: 22 },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const Seat: React.FC<SeatProps> = memo(({
  seat,
  onSelect,
  size = 'medium',
  showPrice = false,
}) => {
  const isAvailable = seat.availabilityStatus === 'AVAILABLE';
  const colors = getSeatColors(seat, seat.availabilityStatus);
  const dimensions = seatSizes[size];
  const characteristics = getSeatCharacteristicsLabel(seat);

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(seat);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isAvailable && onSelect) {
      e.preventDefault();
      onSelect(seat);
    }
  };

  // Tooltip content
  const tooltipContent = (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        Seat {seat.number}
      </Typography>
      {characteristics && (
        <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
          {characteristics}
        </Typography>
      )}
      {!isAvailable && (
        <Typography variant="caption" display="block" color="error.light" sx={{ mt: 0.5 }}>
          {seat.availabilityStatus === 'OCCUPIED' ? 'Occupied' : 'Blocked'}
        </Typography>
      )}
      {isAvailable && seat.displayPrice && (
        <Typography variant="caption" display="block" sx={{ mt: 0.5, fontWeight: 600 }}>
          {seat.displayPrice}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
      <Box
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={isAvailable ? 0 : -1}
        aria-label={`Seat ${seat.number}${characteristics ? `, ${characteristics}` : ''}${
          !isAvailable ? ', unavailable' : ''
        }${seat.isSelected ? ', selected' : ''}`}
        aria-pressed={seat.isSelected}
        aria-disabled={!isAvailable}
        sx={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px 6px 4px 4px',
          border: 2,
          borderColor: colors.border,
          backgroundColor: colors.bg,
          color: colors.text,
          cursor: isAvailable ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          position: 'relative',
          userSelect: 'none',
          outline: 'none',
          
          // Seat back effect
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 4,
            backgroundColor: colors.border,
            borderRadius: '4px 4px 0 0',
          },
          
          // Focus ring for accessibility
          '&:focus-visible': {
            boxShadow: `0 0 0 3px ${alpha(colors.border, 0.5)}`,
          },
          
          // Hover effect (only for available seats)
          ...(isAvailable && {
            '&:hover': {
              backgroundColor: colors.hoverBg,
              transform: 'scale(1.08)',
              boxShadow: `0 4px 12px ${alpha(colors.border, 0.4)}`,
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }),
          
          // Selected animation
          ...(seat.isSelected && {
            animation: 'seatPulse 1.5s ease-in-out infinite',
            '@keyframes seatPulse': {
              '0%, 100%': {
                boxShadow: `0 0 0 0 ${alpha(colors.border, 0.7)}`,
              },
              '50%': {
                boxShadow: `0 0 0 4px ${alpha(colors.border, 0.3)}`,
              },
            },
          }),
        }}
      >
        {/* Seat icon or indicator */}
        {seat.availabilityStatus === 'BLOCKED' ? (
          <Block sx={{ fontSize: dimensions.iconSize, opacity: 0.6 }} />
        ) : seat.isPremium ? (
          <Star sx={{ fontSize: dimensions.iconSize - 2 }} />
        ) : (
          <AirlineSeatReclineNormal
            sx={{
              fontSize: dimensions.iconSize,
              opacity: isAvailable ? 1 : 0.4,
            }}
          />
        )}
        
        {/* Seat number */}
        <Typography
          variant="caption"
          sx={{
            fontSize: dimensions.fontSize,
            fontWeight: 600,
            lineHeight: 1,
            mt: 0.25,
          }}
        >
          {seat.column}
        </Typography>
        
        {/* Price badge (for larger sizes) */}
        {showPrice && isAvailable && seat.displayPrice && size === 'large' && (
          <Box
            sx={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              px: 0.5,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: 'success.main',
              color: 'white',
              fontSize: '0.55rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {seat.displayPrice}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
});

Seat.displayName = 'Seat';

export default Seat;
