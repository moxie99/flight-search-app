// ============================================================================
// SeatDetailsPanel Component
// Panel showing details of selected seat with action buttons
// ============================================================================

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  alpha,
  Fade,
  Divider,
} from '@mui/material';
import {
  AirlineSeatReclineNormal,
  CheckCircle,
  AttachMoney,
  Visibility,
  OpenInFull,
  MeetingRoom,
  Window,
  Airlines,
  Close,
} from '@mui/icons-material';
import type { ProcessedSeat } from '../../types';
import { SEAT_CHARACTERISTIC_LABELS } from '../../types/seatmap.types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SeatDetailsPanelProps {
  seat: ProcessedSeat | null;
  onConfirm?: (seat: ProcessedSeat) => void;
  onClear?: () => void;
}

// -----------------------------------------------------------------------------
// Characteristic Icons
// -----------------------------------------------------------------------------

const getCharacteristicIcon = (code: string): React.ReactNode => {
  const iconProps = { sx: { fontSize: 16 } };
  
  switch (code) {
    case 'W':
      return <Window {...iconProps} />;
    case 'A':
      return <Airlines {...iconProps} />;
    case 'L':
      return <OpenInFull {...iconProps} />;
    case 'E':
      return <MeetingRoom {...iconProps} />;
    default:
      return <Visibility {...iconProps} />;
  }
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SeatDetailsPanel: React.FC<SeatDetailsPanelProps> = ({
  seat,
  onConfirm,
  onClear,
}) => {
  // Empty state
  if (!seat) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: alpha('#f7fafc', 0.8),
          border: 1,
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: alpha('#718096', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <AirlineSeatReclineNormal
            sx={{ fontSize: 28, color: 'text.disabled' }}
          />
        </Box>
        <Typography
          variant="subtitle2"
          sx={{ color: 'text.secondary', mb: 0.5 }}
        >
          No Seat Selected
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.disabled' }}
        >
          Click on an available seat to see details
        </Typography>
      </Paper>
    );
  }

  // Get characteristics to display
  const characteristics = seat.characteristicsCodes
    ?.filter(code => SEAT_CHARACTERISTIC_LABELS[code])
    .slice(0, 5) || [];

  return (
    <Fade in key={seat.number}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: 2,
          borderColor: 'success.main',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            backgroundColor: 'success.main',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Seat Selected
            </Typography>
          </Box>
          {onClear && (
            <Button
              size="small"
              onClick={onClear}
              startIcon={<Close sx={{ fontSize: 16 }} />}
              sx={{
                color: 'white',
                minWidth: 'auto',
                px: 1,
                py: 0.5,
                fontSize: '0.7rem',
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.15),
                },
              }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {/* Seat Number */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Seat Number
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.2 }}
              >
                {seat.number}
              </Typography>
            </Box>
            
            {/* Seat visual */}
            <Box
              sx={{
                width: 48,
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px 8px 4px 4px',
                border: 3,
                borderColor: 'success.main',
                backgroundColor: 'success.light',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '15%',
                  right: '15%',
                  height: 5,
                  backgroundColor: 'success.main',
                  borderRadius: '4px 4px 0 0',
                },
              }}
            >
              <AirlineSeatReclineNormal
                sx={{ fontSize: 24, color: 'success.dark' }}
              />
            </Box>
          </Box>

          {/* Location info */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Location
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              Row {seat.row}, Column {seat.column} •{' '}
              {seat.isWindow ? 'Window' : seat.isAisle ? 'Aisle' : 'Middle'} Seat
            </Typography>
          </Box>

          {/* Characteristics */}
          {characteristics.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 1 }}
              >
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {characteristics.map(code => (
                  <Chip
                    key={code}
                    label={SEAT_CHARACTERISTIC_LABELS[code]}
                    size="small"
                    icon={getCharacteristicIcon(code) as React.ReactElement}
                    sx={{
                      fontSize: '0.7rem',
                      height: 26,
                      backgroundColor: alpha('#4299e1', 0.1),
                      color: 'primary.dark',
                      '& .MuiChip-icon': {
                        color: 'primary.main',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Price */}
          {seat.displayPrice && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    Seat Price
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: 'success.main' }}
                >
                  {seat.displayPrice}
                </Typography>
              </Box>
            </>
          )}

          {/* Confirm Button */}
          {onConfirm && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              size="large"
              startIcon={<CheckCircle />}
              onClick={() => onConfirm(seat)}
              sx={{
                mt: 2,
                py: 1.25,
                fontWeight: 600,
              }}
            >
              Confirm Seat Selection
            </Button>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

export default SeatDetailsPanel;
