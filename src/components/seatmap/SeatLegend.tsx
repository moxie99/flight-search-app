// ============================================================================
// SeatLegend Component
// Color-coded legend explaining seat types and availability
// ============================================================================

import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import {
  AirlineSeatReclineNormal,
  Block,
  Star,
  CheckCircle,
} from '@mui/icons-material';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface LegendItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

interface SeatLegendProps {
  compact?: boolean;
}

// -----------------------------------------------------------------------------
// Legend Items
// -----------------------------------------------------------------------------

const legendItems: LegendItem[] = [
  {
    id: 'available',
    label: 'Available',
    bgColor: '#ebf8ff',
    borderColor: '#4299e1',
    textColor: '#2b6cb0',
    icon: <AirlineSeatReclineNormal sx={{ fontSize: 14 }} />,
  },
  {
    id: 'selected',
    label: 'Selected',
    bgColor: '#38a169',
    borderColor: '#2f855a',
    textColor: '#ffffff',
    icon: <CheckCircle sx={{ fontSize: 14 }} />,
  },
  {
    id: 'occupied',
    label: 'Occupied',
    bgColor: '#e2e8f0',
    borderColor: '#cbd5e0',
    textColor: '#a0aec0',
    icon: <Block sx={{ fontSize: 14 }} />,
  },
  {
    id: 'extra-legroom',
    label: 'Extra Legroom',
    bgColor: '#e9d8fd',
    borderColor: '#9f7aea',
    textColor: '#553c9a',
  },
  {
    id: 'premium',
    label: 'Premium',
    bgColor: '#fefcbf',
    borderColor: '#d69e2e',
    textColor: '#744210',
    icon: <Star sx={{ fontSize: 14 }} />,
  },
  {
    id: 'exit-row',
    label: 'Exit Row',
    bgColor: '#feebc8',
    borderColor: '#ed8936',
    textColor: '#c05621',
  },
];

// -----------------------------------------------------------------------------
// Legend Item Component
// -----------------------------------------------------------------------------

interface LegendItemDisplayProps {
  item: LegendItem;
  compact?: boolean;
}

const LegendItemDisplay: React.FC<LegendItemDisplayProps> = ({ item, compact }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? 0.75 : 1,
      }}
    >
      {/* Seat indicator */}
      <Box
        sx={{
          width: compact ? 20 : 24,
          height: compact ? 22 : 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px 4px 2px 2px',
          border: 2,
          borderColor: item.borderColor,
          backgroundColor: item.bgColor,
          color: item.textColor,
          position: 'relative',
          // Seat back effect
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 2,
            backgroundColor: item.borderColor,
            borderRadius: '2px 2px 0 0',
          },
        }}
      >
        {item.icon}
      </Box>
      
      {/* Label */}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontSize: compact ? '0.65rem' : '0.7rem',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
      </Typography>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SeatLegend: React.FC<SeatLegendProps> = ({ compact = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: compact ? 1.5 : 2,
        backgroundColor: alpha('#f7fafc', 0.8),
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: compact ? '0.6rem' : '0.65rem',
        }}
      >
        Seat Legend
      </Typography>
      
      {/* Legend items */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: compact ? 1.5 : 2,
        }}
      >
        {legendItems.map(item => (
          <LegendItemDisplay key={item.id} item={item} compact={compact} />
        ))}
      </Box>
    </Box>
  );
};

export default SeatLegend;
