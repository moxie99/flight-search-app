// ============================================================================
// CabinLayout Component
// Renders aircraft cabin sections with visual hierarchy
// ============================================================================

import React from 'react';
import { Box, Typography, Paper, Chip, alpha, Divider } from '@mui/material';
import {
  Flight,
  AirlineSeatReclineExtra,
  WorkspacePremium,
  Diamond,
  Chair,
} from '@mui/icons-material';
import { SeatGrid } from './SeatGrid';
import type { CabinSection, ProcessedSeat, CabinClass } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CabinLayoutProps {
  cabinSections: CabinSection[];
  selectedSeatNumber?: string;
  onSeatSelect?: (seat: ProcessedSeat) => void;
  seatSize?: 'small' | 'medium' | 'large';
  showPrices?: boolean;
}

interface CabinHeaderProps {
  cabin: CabinClass;
  displayName: string;
  seatCount: number;
  availableCount: number;
}

// -----------------------------------------------------------------------------
// Cabin Icons
// -----------------------------------------------------------------------------

const getCabinIcon = (cabin: CabinClass): React.ReactNode => {
  const iconProps = { sx: { fontSize: 20 } };
  
  switch (cabin) {
    case 'FIRST':
      return <Diamond {...iconProps} />;
    case 'BUSINESS':
      return <WorkspacePremium {...iconProps} />;
    case 'PREMIUM_ECONOMY':
      return <AirlineSeatReclineExtra {...iconProps} />;
    case 'ECONOMY':
    default:
      return <Chair {...iconProps} />;
  }
};

const getCabinColor = (cabin: CabinClass): string => {
  switch (cabin) {
    case 'FIRST':
      return '#805ad5'; // Purple
    case 'BUSINESS':
      return '#d69e2e'; // Gold
    case 'PREMIUM_ECONOMY':
      return '#3182ce'; // Blue
    case 'ECONOMY':
    default:
      return '#38a169'; // Green
  }
};

// -----------------------------------------------------------------------------
// Cabin Header Component
// -----------------------------------------------------------------------------

const CabinHeader: React.FC<CabinHeaderProps> = ({
  cabin,
  displayName,
  seatCount,
  availableCount,
}) => {
  const color = getCabinColor(cabin);
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        px: 2,
        backgroundColor: alpha(color, 0.08),
        borderLeft: 4,
        borderColor: color,
        borderRadius: '0 8px 8px 0',
        mb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: alpha(color, 0.15),
            color: color,
          }}
        >
          {getCabinIcon(cabin)}
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          {displayName}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          label={`${availableCount} available`}
          size="small"
          sx={{
            backgroundColor: alpha(color, 0.15),
            color: color,
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
          }}
        >
          of {seatCount} seats
        </Typography>
      </Box>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Aircraft Nose Component
// -----------------------------------------------------------------------------

const AircraftNose: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 3,
        pt: 2,
      }}
    >
      {/* Nose shape */}
      <Box
        sx={{
          width: 60,
          height: 30,
          backgroundColor: alpha('#1a365d', 0.1),
          borderRadius: '50% 50% 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
        }}
      >
        <Flight
          sx={{
            fontSize: 20,
            color: 'primary.main',
            transform: 'rotate(-90deg)',
          }}
        />
      </Box>
      
      {/* Cockpit indicator */}
      <Box
        sx={{
          width: 120,
          py: 0.5,
          px: 2,
          backgroundColor: 'primary.main',
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Front of Aircraft
        </Typography>
      </Box>
      
      {/* Connecting line */}
      <Box
        sx={{
          width: 2,
          height: 20,
          backgroundColor: alpha('#1a365d', 0.2),
          mt: 0.5,
        }}
      />
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const CabinLayout: React.FC<CabinLayoutProps> = ({
  cabinSections,
  selectedSeatNumber,
  onSeatSelect,
  seatSize = 'medium',
  showPrices = false,
}) => {
  if (cabinSections.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          color: 'text.secondary',
        }}
      >
        <Typography>No seat data available</Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
      }}
    >
      {/* Aircraft outline */}
      <Box
        sx={{
          position: 'relative',
          mx: 'auto',
          maxWidth: 500,
          px: 2,
          // Fuselage border effect
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 80,
            bottom: 20,
            width: 3,
            backgroundColor: alpha('#1a365d', 0.15),
            borderRadius: 2,
          },
          '&::before': {
            left: 8,
          },
          '&::after': {
            right: 8,
          },
        }}
      >
        {/* Aircraft Nose */}
        <AircraftNose />
        
        {/* Cabin Sections */}
        {cabinSections.map((section, index) => {
          const availableCount = section.seats.filter(
            s => s.availabilityStatus === 'AVAILABLE'
          ).length;
          
          return (
            <Box key={section.cabin} sx={{ mb: 3 }}>
              {/* Section divider */}
              {index > 0 && (
                <Divider
                  sx={{
                    my: 2,
                    '&::before, &::after': {
                      borderColor: alpha('#1a365d', 0.2),
                    },
                  }}
                >
                  <Chip
                    label="Cabin Divider"
                    size="small"
                    sx={{
                      fontSize: '0.6rem',
                      height: 20,
                      backgroundColor: alpha('#1a365d', 0.08),
                      color: 'text.secondary',
                    }}
                  />
                </Divider>
              )}
              
              {/* Cabin Header */}
              <CabinHeader
                cabin={section.cabin}
                displayName={section.displayName}
                seatCount={section.seats.length}
                availableCount={availableCount}
              />
              
              {/* Seat Grid */}
              <SeatGrid
                cabinSection={section}
                selectedSeatNumber={selectedSeatNumber}
                onSeatSelect={onSeatSelect}
                seatSize={seatSize}
                showPrices={showPrices}
              />
            </Box>
          );
        })}
        
        {/* Aircraft tail indicator */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            pb: 3,
          }}
        >
          <Box
            sx={{
              width: 2,
              height: 20,
              backgroundColor: alpha('#1a365d', 0.2),
              mb: 0.5,
            }}
          />
          <Box
            sx={{
              width: 80,
              py: 0.5,
              px: 2,
              backgroundColor: alpha('#1a365d', 0.08),
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Rear
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CabinLayout;
