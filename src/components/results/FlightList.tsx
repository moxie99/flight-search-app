// ============================================================================
// Flight List Component
// Displays flight results with pagination and sorting
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
  Paper,
  useMediaQuery,
  useTheme,
  Grow,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { FlightCard } from './FlightCard';
import type { FlightOffer, SortOption } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FlightListProps {
  flights: FlightOffer[];
  carriers?: Record<string, string>;
  isLoading?: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onSelectFlight?: (flight: FlightOffer) => void;
  pageSize?: number;
}

// -----------------------------------------------------------------------------
// Sort Options
// -----------------------------------------------------------------------------

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
  { value: 'departure-asc', label: 'Departure: Earliest' },
];

// -----------------------------------------------------------------------------
// Loading Skeleton
// -----------------------------------------------------------------------------

const FlightCardSkeleton: React.FC = () => (
  <Paper sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Skeleton variant="text" width={60} height={40} />
            <Skeleton variant="text" width={40} height={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={4} sx={{ borderRadius: 1 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width={60} height={40} />
            <Skeleton variant="text" width={40} height={20} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: 150, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
        <Skeleton variant="text" width={100} height={50} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  </Paper>
);

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

const EmptyState: React.FC = () => (
  <Paper
    sx={{
      p: 6,
      textAlign: 'center',
      borderRadius: 2,
      backgroundColor: 'grey.50',
    }}
  >
    <Typography variant="h6" color="text.secondary" gutterBottom>
      No flights found
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Try adjusting your filters or search criteria
    </Typography>
  </Paper>
);

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const FlightList: React.FC<FlightListProps> = ({
  flights,
  carriers,
  isLoading = false,
  sortOption,
  onSortChange,
  onSelectFlight,
  pageSize = 10,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(flights.length / pageSize);
  const paginatedFlights = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return flights.slice(startIndex, startIndex + pageSize);
  }, [flights, page, pageSize]);

  // Find lowest price flight
  const lowestPriceId = useMemo(() => {
    if (flights.length === 0) return null;
    const sorted = [...flights].sort(
      (a, b) =>
        parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal)
    );
    return sorted[0].id;
  }, [flights]);

  // Reset page when flights change
  React.useEffect(() => {
    setPage(1);
  }, [flights.length]);

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value as SortOption);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    // Scroll to top of list
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Skeleton variant="text" width={150} height={30} />
          <Skeleton variant="rectangular" width={180} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        {[1, 2, 3, 4, 5].map((i) => (
          <FlightCardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (flights.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box>
      {/* Header with count and sort */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {flights.length} flight{flights.length !== 1 ? 's' : ''} found
        </Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            sx={{
              backgroundColor: 'background.paper',
              '& .MuiSelect-select': {
                py: 1,
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Flight Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1.5 }}>
        {paginatedFlights.map((flight, index) => (
          <Grow
            key={flight.id}
            in
            timeout={300 + index * 100}
            style={{ transformOrigin: '0 0' }}
          >
            <Box>
              <FlightCard
                flight={flight}
                carriers={carriers}
                onSelect={onSelectFlight}
                isLowest={flight.id === lowestPriceId && page === 1 && index === 0}
              />
            </Box>
          </Grow>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FlightList;
