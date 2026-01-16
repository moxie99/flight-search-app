// ============================================================================
// Flight Details Modal Component
// Modern modal showing full flight details when user selects a flight
// ============================================================================

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery,
  alpha,
  Fade,
} from '@mui/material';
import {
  Close,
  FlightTakeoff,
  FlightLand,
  AccessTime,
  AirlineSeatReclineNormal,
  Luggage,
  CheckCircle,
  Schedule,
  Flight,
} from '@mui/icons-material';
import type { FlightOffer } from '../../types';
import {
  formatTime,
  formatDate,
  formatIsoDuration,
  formatPrice,
  formatStops,
  getStopCount,
} from '../../utils/formatters';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FlightDetailsModalProps {
  open: boolean;
  onClose: () => void;
  flight: FlightOffer | null;
  carriers?: Record<string, string>;
  onConfirm?: (flight: FlightOffer) => void;
}

// -----------------------------------------------------------------------------
// Flight Segment Timeline
// -----------------------------------------------------------------------------

interface SegmentTimelineProps {
  itinerary: FlightOffer['itineraries'][0];
  carriers?: Record<string, string>;
  label: string;
}

const SegmentTimeline: React.FC<SegmentTimelineProps> = ({
  itinerary,
  carriers,
  label,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          pb: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {label === 'Outbound' ? (
          <FlightTakeoff color="primary" />
        ) : (
          <FlightLand color="primary" />
        )}
        <Typography variant="subtitle1" fontWeight={600}>
          {label} Flight
        </Typography>
        <Chip
          label={formatIsoDuration(itinerary.duration)}
          size="small"
          icon={<AccessTime sx={{ fontSize: 14 }} />}
          sx={{ ml: 'auto' }}
        />
      </Box>

      <Stepper orientation="vertical" sx={{ ml: 1 }}>
        {itinerary.segments.map((segment, index) => {
          const carrierName = carriers?.[segment.carrierCode] || segment.carrierCode;
          const isLastSegment = index === itinerary.segments.length - 1;

          return (
            <Step key={index} active expanded>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flight
                      sx={{
                        fontSize: 18,
                        color: 'white',
                        transform: 'rotate(45deg)',
                      }}
                    />
                  </Box>
                )}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {formatTime(segment.departure.at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(segment.departure.at)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {segment.departure.iataCode}
                    </Typography>
                    {segment.departure.terminal && (
                      <Typography variant="caption" color="text.secondary">
                        Terminal {segment.departure.terminal}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </StepLabel>
              <StepContent>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    my: 1,
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                    borderStyle: 'dashed',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {carrierName}
                    </Typography>
                    <Chip
                      label={`${segment.carrierCode} ${segment.flightNumber}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatIsoDuration(segment.duration)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AirlineSeatReclineNormal sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {segment.aircraft?.code || 'Aircraft TBD'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Arrival info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isLastSegment ? 'success.main' : 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isLastSegment ? (
                      <CheckCircle sx={{ fontSize: 18, color: 'white' }} />
                    ) : (
                      <Schedule sx={{ fontSize: 18, color: 'white' }} />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {formatTime(segment.arrival.at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(segment.arrival.at)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {segment.arrival.iataCode}
                    </Typography>
                    {segment.arrival.terminal && (
                      <Typography variant="caption" color="text.secondary">
                        Terminal {segment.arrival.terminal}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Connection info */}
                {!isLastSegment && (
                  <Paper
                    sx={{
                      mt: 2,
                      p: 1.5,
                      backgroundColor: 'warning.light',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      ⏱️ Connection at {segment.arrival.iataCode}
                    </Typography>
                  </Paper>
                )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Modal Component
// -----------------------------------------------------------------------------

export const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({
  open,
  onClose,
  flight,
  carriers,
  onConfirm,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!flight) return null;

  const price = parseFloat(flight.price.grandTotal);
  const currency = flight.price.currency;
  const totalStops = flight.itineraries.reduce(
    (acc, it) => acc + getStopCount(it.segments),
    0
  );

  const handleConfirm = () => {
    onConfirm?.(flight);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      transitionDuration={300}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Flight Selected
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Review your selection before proceeding
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Summary Bar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            p: 2,
            backgroundColor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Chip
            icon={<Flight sx={{ transform: 'rotate(45deg)' }} />}
            label={`${flight.itineraries.length === 2 ? 'Round Trip' : 'One Way'}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={formatStops(totalStops)}
            color={totalStops === 0 ? 'success' : 'default'}
            variant="outlined"
          />
          <Chip
            icon={<AirlineSeatReclineNormal />}
            label={`${flight.numberOfBookableSeats} seats left`}
            variant="outlined"
          />
        </Box>

        {/* Flight Details */}
        <Box sx={{ p: 3 }}>
          {flight.itineraries.map((itinerary, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <Divider sx={{ my: 3 }} />}
              <SegmentTimeline
                itinerary={itinerary}
                carriers={carriers}
                label={idx === 0 ? 'Outbound' : 'Return'}
              />
            </React.Fragment>
          ))}
        </Box>

        {/* Price Summary */}
        <Box
          sx={{
            p: 3,
            backgroundColor: alpha(theme.palette.success.main, 0.05),
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Price Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Base fare (per person)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Taxes & fees included
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {formatPrice(price, currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total price per traveler
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ minWidth: 120 }}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          startIcon={<CheckCircle />}
          sx={{
            minWidth: 180,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Confirm Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlightDetailsModal;
