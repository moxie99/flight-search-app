// ============================================================================
// Flight Card Component
// Displays individual flight offer with all details
// ============================================================================

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Tooltip,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
  AirlineSeatReclineNormal,
  ExpandMore,
  ExpandLess,
  Circle,
} from '@mui/icons-material';
import type { FlightOffer } from '../../types';
import {
  formatTime,
  formatIsoDuration,
  formatPrice,
  formatStops,
  getStopCount,
} from '../../utils/formatters';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FlightCardProps {
  flight: FlightOffer;
  carriers?: Record<string, string>;
  onSelect?: (flight: FlightOffer) => void;
  isLowest?: boolean;
}

// -----------------------------------------------------------------------------
// Segment Display Component
// -----------------------------------------------------------------------------

interface SegmentDisplayProps {
  segment: FlightOffer['itineraries'][0]['segments'][0];
  carrierName?: string;
}

const SegmentDisplay: React.FC<SegmentDisplayProps> = ({
  segment,
  carrierName,
}) => (
  <Box sx={{ py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {carrierName || segment.carrierCode} {segment.flightNumber}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
        <Typography variant="h6" fontWeight={600}>
          {formatTime(segment.departure.at)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {segment.departure.iataCode}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {formatIsoDuration(segment.duration)}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 2,
            backgroundColor: 'grey.300',
            position: 'relative',
            my: 0.5,
          }}
        >
          <FlightTakeoff
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 14,
              color: 'primary.main',
            }}
          />
          <FlightLand
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 14,
              color: 'primary.main',
            }}
          />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', minWidth: 60 }}>
        <Typography variant="h6" fontWeight={600}>
          {formatTime(segment.arrival.at)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {segment.arrival.iataCode}
        </Typography>
      </Box>
    </Box>
  </Box>
);

// -----------------------------------------------------------------------------
// Itinerary Display Component
// -----------------------------------------------------------------------------

interface ItineraryDisplayProps {
  itinerary: FlightOffer['itineraries'][0];
  carriers?: Record<string, string>;
  label: string;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
  itinerary,
  carriers,
  label,
}) => {
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const stops = getStopCount(itinerary.segments);

  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: 'block' }}
      >
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Departure */}
        <Box sx={{ minWidth: 80 }}>
          <Typography variant="h5" fontWeight={700}>
            {formatTime(firstSegment.departure.at)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {firstSegment.departure.iataCode}
          </Typography>
        </Box>

        {/* Flight Path */}
        <Box sx={{ flex: 1, px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: 2,
                backgroundColor: 'grey.300',
                position: 'relative',
              }}
            >
              {/* Stop indicators */}
              {stops > 0 &&
                itinerary.segments.slice(0, -1).map((_, idx) => (
                  <Tooltip
                    key={idx}
                    title={`Stop at ${itinerary.segments[idx].arrival.iataCode}`}
                  >
                    <Circle
                      sx={{
                        position: 'absolute',
                        left: `${((idx + 1) / itinerary.segments.length) * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 10,
                        color: 'warning.main',
                      }}
                    />
                  </Tooltip>
                ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              mt: 0.5,
            }}
          >
            <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatIsoDuration(itinerary.duration)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              •
            </Typography>
            <Typography
              variant="caption"
              color={stops === 0 ? 'success.main' : 'text.secondary'}
              fontWeight={stops === 0 ? 600 : 400}
            >
              {formatStops(stops)}
            </Typography>
          </Box>
        </Box>

        {/* Arrival */}
        <Box sx={{ minWidth: 80, textAlign: 'right' }}>
          <Typography variant="h5" fontWeight={700}>
            {formatTime(lastSegment.arrival.at)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lastSegment.arrival.iataCode}
          </Typography>
        </Box>
      </Box>

      {/* Carrier info */}
      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {itinerary.segments
            .map(
              (seg) =>
                carriers?.[seg.carrierCode] || seg.carrierCode
            )
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(', ')}
        </Typography>
      </Box>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Flight Card Component
// -----------------------------------------------------------------------------

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  carriers,
  onSelect,
  isLowest = false,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const price = parseFloat(flight.price.grandTotal);
  const currency = flight.price.currency;

  return (
    <Card
      sx={{
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      {isLowest && (
        <Chip
          label="Lowest Price"
          color="success"
          size="small"
          sx={{
            position: 'absolute',
            top: 0,
            left: 16,
            fontWeight: 600,
            fontSize: '0.7rem',
            marginTop: 0.2
          }}
        />
      )}

      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Flight Details */}
          <Box sx={{ flex: 1 }}>
            {flight.itineraries.map((itinerary, idx) => (
              <Box key={idx}>
                {idx > 0 && <Divider sx={{ my: 2 }} />}
                <ItineraryDisplay
                  itinerary={itinerary}
                  carriers={carriers}
                  label={idx === 0 ? 'Outbound' : 'Return'}
                />
              </Box>
            ))}
          </Box>

          {/* Price and Action */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'stretch', md: 'flex-end' },
              justifyContent: 'center',
              minWidth: { md: 150 },
              gap: 1,
            }}
          >
            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
              >
                {formatPrice(price, currency)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                per person
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => onSelect?.(flight)}
              sx={{ mt: 1 }}
            >
              Select
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AirlineSeatReclineNormal
                sx={{ fontSize: 16, color: 'text.secondary' }}
              />
              <Typography variant="caption" color="text.secondary">
                {flight.numberOfBookableSeats} seats left
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Expand Details */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ color: 'text.secondary' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {expanded ? 'Hide details' : 'Flight details'}
            </Typography>
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Divider sx={{ my: 2 }} />
          <Box>
            {flight.itineraries.map((itinerary, itinIdx) => (
              <Box key={itinIdx} sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  {itinIdx === 0 ? 'Outbound Flight' : 'Return Flight'}
                </Typography>
                {itinerary.segments.map((segment, segIdx) => (
                  <Box key={segIdx}>
                    {segIdx > 0 && (
                      <Box
                        sx={{
                          py: 1,
                          px: 2,
                          backgroundColor: 'warning.light',
                          borderRadius: 1,
                          my: 1,
                        }}
                      >
                        <Typography variant="caption" fontWeight={500}>
                          Connection at{' '}
                          {segment.departure.iataCode}
                        </Typography>
                      </Box>
                    )}
                    <SegmentDisplay
                      segment={segment}
                      carrierName={carriers?.[segment.carrierCode]}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
