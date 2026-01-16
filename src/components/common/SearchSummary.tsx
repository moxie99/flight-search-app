// ============================================================================
// Search Summary Component
// Shows what the user searched for with edit capability
// ============================================================================

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  CalendarMonth,
  Person,
  Edit,
  SwapHoriz,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import type { FlightSearchParams } from '../../types';

interface SearchSummaryProps {
  searchParams: FlightSearchParams;
  onEdit?: () => void;
}

export const SearchSummary: React.FC<SearchSummaryProps> = ({
  searchParams,
  onEdit,
}) => {
  const totalTravelers =
    searchParams.adults +
    (searchParams.children || 0) +
    (searchParams.infants || 0);

  const formatDateDisplay = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'EEE, MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        backgroundColor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Route */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoff sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          {searchParams.originLocationCode}
        </Typography>
        <SwapHoriz sx={{ fontSize: 18, opacity: 0.7 }} />
        <FlightLand sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={600}>
          {searchParams.destinationLocationCode}
        </Typography>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: 'rgba(255,255,255,0.3)', display: { xs: 'none', sm: 'block' } }}
      />

      {/* Dates */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonth sx={{ fontSize: 18, opacity: 0.8 }} />
        <Typography variant="body2">
          {formatDateDisplay(searchParams.departureDate)}
          {searchParams.returnDate && (
            <> — {formatDateDisplay(searchParams.returnDate)}</>
          )}
        </Typography>
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: 'rgba(255,255,255,0.3)', display: { xs: 'none', sm: 'block' } }}
      />

      {/* Travelers */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person sx={{ fontSize: 18, opacity: 0.8 }} />
        <Typography variant="body2">
          {totalTravelers} traveler{totalTravelers !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Cabin Class */}
      {searchParams.travelClass && (
        <Chip
          label={searchParams.travelClass.replace('_', ' ')}
          size="small"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.75rem',
          }}
        />
      )}

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Edit Button */}
      {onEdit && (
        <Tooltip title="Modify search">
          <IconButton
            onClick={onEdit}
            size="small"
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

export default SearchSummary;
