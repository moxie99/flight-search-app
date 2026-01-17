// ============================================================================
// Flight List Component
// Rich Data Table with Pagination, Filtering, Dynamic Columns
// ============================================================================

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  Paper,
  Pagination,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Badge,
  Collapse,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  ViewModule,
  ViewList,
  ViewColumn,
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  ArrowUpward,
  ArrowDownward,
  FlightTakeoff,
  AttachMoney,
  Schedule,
  AirlineSeatReclineNormal,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { FlightCard } from './FlightCard';
import type { FlightOffer, SortOption } from '../../types';
import { formatPrice, formatIsoDuration, formatTime, getStopCount } from '../../utils/formatters';

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
}

type ViewMode = 'card' | 'table' | 'compact';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: number | string;
}

interface TableFilters {
  search: string;
  maxPrice: number | null;
  maxStops: number | null;
  airlines: string[];
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SORT_OPTIONS: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'price-asc', label: 'Price: Low to High', icon: <AttachMoney fontSize="small" /> },
  { value: 'price-desc', label: 'Price: High to Low', icon: <AttachMoney fontSize="small" /> },
  { value: 'duration-asc', label: 'Duration: Shortest', icon: <Schedule fontSize="small" /> },
  { value: 'departure-asc', label: 'Departure: Earliest', icon: <FlightTakeoff fontSize="small" /> },
];

const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50];

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'airline', label: 'Airline', visible: true, sortable: true, width: '15%' },
  { id: 'route', label: 'Route', visible: true, sortable: false, width: '20%' },
  { id: 'departure', label: 'Departure', visible: true, sortable: true, width: '15%' },
  { id: 'arrival', label: 'Arrival', visible: true, sortable: true, width: '15%' },
  { id: 'duration', label: 'Duration', visible: true, sortable: true, width: '10%' },
  { id: 'stops', label: 'Stops', visible: true, sortable: true, width: '10%' },
  { id: 'price', label: 'Price', visible: true, sortable: true, width: '15%' },
];

// -----------------------------------------------------------------------------
// Loading Skeleton (Memoized)
// -----------------------------------------------------------------------------

const FlightCardSkeleton: React.FC = React.memo(() => (
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
));

FlightCardSkeleton.displayName = 'FlightCardSkeleton';

// -----------------------------------------------------------------------------
// Table Row Skeleton
// -----------------------------------------------------------------------------

const TableRowSkeleton: React.FC = React.memo(() => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
    }}
  >
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <Skeleton key={i} variant="text" width={`${100 / 7}%`} height={24} />
    ))}
  </Box>
));

TableRowSkeleton.displayName = 'TableRowSkeleton';

// -----------------------------------------------------------------------------
// Empty State (Memoized)
// -----------------------------------------------------------------------------

const EmptyState: React.FC<{ hasFilters?: boolean; onClearFilters?: () => void }> = React.memo(
  ({ hasFilters, onClearFilters }) => (
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {hasFilters
          ? 'Try adjusting your table filters to see more results'
          : 'Try adjusting your search criteria'}
      </Typography>
      {hasFilters && onClearFilters && (
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={onClearFilters}
        >
          Clear Table Filters
        </Button>
      )}
    </Paper>
  )
);

EmptyState.displayName = 'EmptyState';

// -----------------------------------------------------------------------------
// Column Selector Component
// -----------------------------------------------------------------------------

interface ColumnSelectorProps {
  columns: ColumnConfig[];
  onToggleColumn: (columnId: string) => void;
  onResetColumns: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = React.memo(
  ({ columns, onToggleColumn, onResetColumns }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const visibleCount = columns.filter((c) => c.visible).length;

    return (
      <>
        <Tooltip title="Customize columns">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Badge badgeContent={visibleCount} color="primary" max={99}>
              <ViewColumn />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { minWidth: 200, maxHeight: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Visible Columns
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {visibleCount} of {columns.length} columns shown
            </Typography>
          </Box>
          <Divider />
          <FormGroup sx={{ px: 1 }}>
            {columns.map((column) => (
              <FormControlLabel
                key={column.id}
                control={
                  <Checkbox
                    checked={column.visible}
                    onChange={() => onToggleColumn(column.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">{column.label}</Typography>
                }
                sx={{ ml: 0 }}
              />
            ))}
          </FormGroup>
          <Divider />
          <Box sx={{ p: 1 }}>
            <Button
              size="small"
              fullWidth
              onClick={() => {
                onResetColumns();
                setAnchorEl(null);
              }}
            >
              Reset to Default
            </Button>
          </Box>
        </Menu>
      </>
    );
  }
);

ColumnSelector.displayName = 'ColumnSelector';

// -----------------------------------------------------------------------------
// Table Filter Bar Component
// -----------------------------------------------------------------------------

interface TableFilterBarProps {
  filters: TableFilters;
  onFiltersChange: (filters: TableFilters) => void;
  onClearFilters: () => void;
  airlines: { code: string; name: string }[];
  priceRange: { min: number; max: number };
}

const TableFilterBar: React.FC<TableFilterBarProps> = React.memo(
  ({ filters, onFiltersChange, onClearFilters, airlines, priceRange }) => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const hasActiveFilters =
      filters.search ||
      filters.maxPrice !== null ||
      filters.maxStops !== null ||
      filters.airlines.length > 0;

    const activeFilterCount =
      (filters.search ? 1 : 0) +
      (filters.maxPrice !== null ? 1 : 0) +
      (filters.maxStops !== null ? 1 : 0) +
      (filters.airlines.length > 0 ? 1 : 0);

    return (
      <Paper
        variant="outlined"
        sx={{
          mb: 2,
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        {/* Filter Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight={600}>
              Table Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={`${activeFilterCount} active`}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
          <IconButton size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Filter Content */}
        <Collapse in={expanded}>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Search Filter */}
              <TextField
                size="small"
                placeholder="Search flights..."
                value={filters.search}
                onChange={(e) =>
                  onFiltersChange({ ...filters, search: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => onFiltersChange({ ...filters, search: '' })}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Max Price Filter */}
              <TextField
                size="small"
                type="number"
                label="Max Price"
                value={filters.maxPrice ?? ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                inputProps={{
                  min: priceRange.min,
                  max: priceRange.max,
                }}
              />

              {/* Max Stops Filter */}
              <FormControl size="small">
                <Select
                  value={filters.maxStops === null ? 'any' : filters.maxStops}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxStops: e.target.value === 'any' ? null : Number(e.target.value),
                    })
                  }
                  displayEmpty
                >
                  <MenuItem value="any">Any stops</MenuItem>
                  <MenuItem value={0}>Non-stop only</MenuItem>
                  <MenuItem value={1}>1 stop max</MenuItem>
                  <MenuItem value={2}>2 stops max</MenuItem>
                </Select>
              </FormControl>

              {/* Airline Filter */}
              <FormControl size="small">
                <Select
                  multiple
                  value={filters.airlines}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      airlines: e.target.value as string[],
                    })
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <Typography color="text.secondary">All airlines</Typography>;
                    }
                    return `${selected.length} selected`;
                  }}
                >
                  {airlines.map((airline) => (
                    <MenuItem key={airline.code} value={airline.code}>
                      <Checkbox
                        checked={filters.airlines.includes(airline.code)}
                        size="small"
                      />
                      <Typography variant="body2">{airline.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  startIcon={<Clear />}
                  onClick={onClearFilters}
                >
                  Clear All Filters
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    );
  }
);

TableFilterBar.displayName = 'TableFilterBar';

// -----------------------------------------------------------------------------
// Table View Row Component
// -----------------------------------------------------------------------------

interface TableRowProps {
  flight: FlightOffer;
  columns: ColumnConfig[];
  carriers?: Record<string, string>;
  isLowest: boolean;
  onSelect?: (flight: FlightOffer) => void;
}

const FlightTableRow: React.FC<TableRowProps> = React.memo(
  ({ flight, columns, carriers, isLowest, onSelect }) => {
    const theme = useTheme();
    const firstSegment = flight.itineraries[0]?.segments[0];
    const lastSegment = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1];
    const stops = getStopCount(flight.itineraries[0]?.segments || []);
    const price = parseFloat(flight.price.grandTotal);
    const airlineCode = flight.validatingAirlineCodes[0];
    const airlineName = carriers?.[airlineCode] || airlineCode;

    const getColumnValue = (columnId: string) => {
      switch (columnId) {
        case 'airline':
          return (
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {airlineName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {airlineCode}
              </Typography>
            </Box>
          );
        case 'route':
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {firstSegment?.departure?.iataCode || '—'}
              </Typography>
              <FlightTakeoff sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={600}>
                {lastSegment?.arrival?.iataCode || '—'}
              </Typography>
            </Box>
          );
        case 'departure':
          return (
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {firstSegment?.departure?.at ? formatTime(firstSegment.departure.at) : '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {firstSegment?.departure?.iataCode}
              </Typography>
            </Box>
          );
        case 'arrival':
          return (
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {lastSegment?.arrival?.at ? formatTime(lastSegment.arrival.at) : '—'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lastSegment?.arrival?.iataCode}
              </Typography>
            </Box>
          );
        case 'duration':
          return (
            <Typography variant="body2">
              {flight.itineraries[0]?.duration
                ? formatIsoDuration(flight.itineraries[0].duration)
                : '—'}
            </Typography>
          );
        case 'stops':
          return (
            <Chip
              label={stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
              size="small"
              color={stops === 0 ? 'success' : 'default'}
              variant={stops === 0 ? 'filled' : 'outlined'}
              sx={{ fontWeight: stops === 0 ? 600 : 400 }}
            />
          );
        case 'price':
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                fontWeight={700}
                color={isLowest ? 'success.main' : 'primary.main'}
              >
                {formatPrice(price, flight.price.currency)}
              </Typography>
              {isLowest && (
                <Chip
                  label="Lowest"
                  size="small"
                  color="success"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              )}
            </Box>
          );
        default:
          return null;
      }
    };

    return (
      <Box
        onClick={() => onSelect?.(flight)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s',
          backgroundColor: isLowest ? alpha(theme.palette.success.main, 0.05) : 'transparent',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        {columns
          .filter((c) => c.visible)
          .map((column) => (
            <Box
              key={column.id}
              sx={{
                width: column.width,
                flexShrink: 0,
                pr: 2,
              }}
            >
              {getColumnValue(column.id)}
            </Box>
          ))}
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(flight);
            }}
          >
            Select
          </Button>
        </Box>
      </Box>
    );
  }
);

FlightTableRow.displayName = 'FlightTableRow';

// -----------------------------------------------------------------------------
// Compact View Row Component
// -----------------------------------------------------------------------------

interface CompactRowProps {
  flight: FlightOffer;
  carriers?: Record<string, string>;
  isLowest: boolean;
  onSelect?: (flight: FlightOffer) => void;
}

const CompactFlightRow: React.FC<CompactRowProps> = React.memo(
  ({ flight, carriers, isLowest, onSelect }) => {
    const firstSegment = flight.itineraries[0]?.segments[0];
    const lastSegment = flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1];
    const stops = getStopCount(flight.itineraries[0]?.segments || []);
    const price = parseFloat(flight.price.grandTotal);
    const airlineCode = flight.validatingAirlineCodes[0];
    const airlineName = carriers?.[airlineCode] || airlineCode;

    return (
      <Paper
        onClick={() => onSelect?.(flight)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          mb: 1,
          cursor: 'pointer',
          transition: 'all 0.2s',
          border: isLowest ? 2 : 1,
          borderColor: isLowest ? 'success.main' : 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 2,
          },
        }}
      >
        {/* Airline */}
        <Box sx={{ minWidth: 80 }}>
          <Typography variant="body2" fontWeight={600}>
            {airlineName}
          </Typography>
        </Box>

        {/* Route & Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, mx: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600}>
              {firstSegment?.departure?.at ? formatTime(firstSegment.departure.at) : '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {firstSegment?.departure?.iataCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Box sx={{ width: 40, height: 1, backgroundColor: 'grey.300' }} />
            <Typography variant="caption">
              {flight.itineraries[0]?.duration
                ? formatIsoDuration(flight.itineraries[0].duration)
                : '—'}
            </Typography>
            <Box sx={{ width: 40, height: 1, backgroundColor: 'grey.300' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" fontWeight={600}>
              {lastSegment?.arrival?.at ? formatTime(lastSegment.arrival.at) : '—'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {lastSegment?.arrival?.iataCode}
            </Typography>
          </Box>
        </Box>

        {/* Stops */}
        <Chip
          label={stops === 0 ? 'Direct' : `${stops} stop`}
          size="small"
          color={stops === 0 ? 'success' : 'default'}
          sx={{ minWidth: 70 }}
        />

        {/* Price */}
        <Box sx={{ minWidth: 100, textAlign: 'right', ml: 2 }}>
          <Typography
            variant="body1"
            fontWeight={700}
            color={isLowest ? 'success.main' : 'primary.main'}
          >
            {formatPrice(price, flight.price.currency)}
          </Typography>
          {isLowest && (
            <Typography variant="caption" color="success.main" fontWeight={600}>
              Best price
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }
);

CompactFlightRow.displayName = 'CompactFlightRow';

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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  // Column configuration state
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  // Table filters state
  const [tableFilters, setTableFilters] = useState<TableFilters>({
    search: '',
    maxPrice: null,
    maxStops: null,
    airlines: [],
  });

  // Reset page when flights or filters change
  useEffect(() => {
    setPage(0);
  }, [flights.length, tableFilters]);

  // Derived: Available airlines for filter
  const availableAirlines = useMemo(() => {
    const airlinesMap = new Map<string, string>();
    flights.forEach((flight) => {
      flight.validatingAirlineCodes.forEach((code) => {
        if (!airlinesMap.has(code)) {
          airlinesMap.set(code, carriers?.[code] || code);
        }
      });
    });
    return Array.from(airlinesMap.entries()).map(([code, name]) => ({ code, name }));
  }, [flights, carriers]);

  // Derived: Price range for filter
  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Apply table filters
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      // Search filter
      if (tableFilters.search) {
        const searchLower = tableFilters.search.toLowerCase();
        const airlineCode = flight.validatingAirlineCodes[0];
        const airlineName = carriers?.[airlineCode] || '';
        const origin = flight.itineraries[0]?.segments[0]?.departure?.iataCode || '';
        const destination =
          flight.itineraries[0]?.segments[flight.itineraries[0].segments.length - 1]?.arrival
            ?.iataCode || '';

        const matchesSearch =
          airlineCode?.toLowerCase().includes(searchLower) ||
          airlineName.toLowerCase().includes(searchLower) ||
          origin.toLowerCase().includes(searchLower) ||
          destination.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Max price filter
      if (tableFilters.maxPrice !== null) {
        const price = parseFloat(flight.price.grandTotal);
        if (price > tableFilters.maxPrice) return false;
      }

      // Max stops filter
      if (tableFilters.maxStops !== null) {
        const stops = getStopCount(flight.itineraries[0]?.segments || []);
        if (stops > tableFilters.maxStops) return false;
      }

      // Airlines filter
      if (tableFilters.airlines.length > 0) {
        const hasAirline = flight.validatingAirlineCodes.some((code) =>
          tableFilters.airlines.includes(code)
        );
        if (!hasAirline) return false;
      }

      return true;
    });
  }, [flights, tableFilters, carriers]);

  // Find lowest price flight (memoized)
  const lowestPriceId = useMemo(() => {
    if (filteredFlights.length === 0) return null;
    const sorted = [...filteredFlights].sort(
      (a, b) => parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal)
    );
    return sorted[0].id;
  }, [filteredFlights]);

  // Paginated flights
  const paginatedFlights = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredFlights.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredFlights, page, rowsPerPage]);

  // Check if table filters are active
  const hasTableFilters =
    !!tableFilters.search ||
    tableFilters.maxPrice !== null ||
    tableFilters.maxStops !== null ||
    tableFilters.airlines.length > 0;

  // Handlers
  const handleSortChange = useCallback(
    (event: SelectChangeEvent) => {
      onSortChange(event.target.value as SortOption);
    },
    [onSortChange]
  );

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleViewModeChange = useCallback(
    (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
      if (newMode) setViewMode(newMode);
    },
    []
  );

  const handleToggleColumn = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
  }, []);

  const handleClearFilters = useCallback(() => {
    setTableFilters({
      search: '',
      maxPrice: null,
      maxStops: null,
      airlines: [],
    });
  }, []);

  const handleSelectFlight = useCallback(
    (flight: FlightOffer) => {
      onSelectFlight?.(flight);
    },
    [onSelectFlight]
  );

  // Loading state
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
        {viewMode === 'table' ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRowSkeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <FlightCardSkeleton key={i} />
            ))}
          </>
        )}
      </Box>
    );
  }

  // Empty state (before filters)
  if (flights.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box>
      {/* Toolbar */}
      <Paper
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        {/* Left: Results count & Sort */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''}
            {hasTableFilters && ` (filtered from ${flights.length})`}
          </Typography>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  {sortOption.includes('asc') ? (
                    <ArrowUpward fontSize="small" color="action" />
                  ) : (
                    <ArrowDownward fontSize="small" color="action" />
                  )}
                </InputAdornment>
              }
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {option.icon}
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Right: View mode & Column selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && viewMode === 'table' && (
            <ColumnSelector
              columns={columns}
              onToggleColumn={handleToggleColumn}
              onResetColumns={handleResetColumns}
            />
          )}

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="card">
              <Tooltip title="Card view">
                <ViewModule />
              </Tooltip>
            </ToggleButton>
            {!isMobile && (
              <ToggleButton value="table">
                <Tooltip title="Table view">
                  <ViewList />
                </Tooltip>
              </ToggleButton>
            )}
            <ToggleButton value="compact">
              <Tooltip title="Compact view">
                <AirlineSeatReclineNormal />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Table Filter Bar */}
      <TableFilterBar
        filters={tableFilters}
        onFiltersChange={setTableFilters}
        onClearFilters={handleClearFilters}
        airlines={availableAirlines}
        priceRange={priceRange}
      />

      {/* Empty state after filtering */}
      {filteredFlights.length === 0 ? (
        <EmptyState hasFilters={hasTableFilters} onClearFilters={handleClearFilters} />
      ) : (
        <>
          {/* Table Header (for table view) */}
          {viewMode === 'table' && !isMobile && (
            <Paper sx={{ mb: 0.5, borderRadius: '8px 8px 0 0' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                {columns
                  .filter((c) => c.visible)
                  .map((column) => (
                    <Box
                      key={column.id}
                      sx={{
                        width: column.width,
                        flexShrink: 0,
                        pr: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                        textTransform="uppercase"
                      >
                        {column.label}
                      </Typography>
                    </Box>
                  ))}
                <Box sx={{ ml: 'auto', width: 80 }} />
              </Box>
            </Paper>
          )}

          {/* Flight List */}
          <Paper sx={{ borderRadius: viewMode === 'table' ? '0 0 8px 8px' : 2, overflow: 'hidden' }}>
            {viewMode === 'card' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                {paginatedFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    carriers={carriers}
                    onSelect={handleSelectFlight}
                    isLowest={flight.id === lowestPriceId}
                  />
                ))}
              </Box>
            ) : viewMode === 'table' ? (
              <Box>
                {paginatedFlights.map((flight) => (
                  <FlightTableRow
                    key={flight.id}
                    flight={flight}
                    columns={columns}
                    carriers={carriers}
                    isLowest={flight.id === lowestPriceId}
                    onSelect={handleSelectFlight}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                {paginatedFlights.map((flight) => (
                  <CompactFlightRow
                    key={flight.id}
                    flight={flight}
                    carriers={carriers}
                    isLowest={flight.id === lowestPriceId}
                    onSelect={handleSelectFlight}
                  />
                ))}
              </Box>
            )}
          </Paper>

          {/* Pagination */}
          <Paper
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              p: 2,
              gap: 2,
              borderRadius: 2,
            }}
          >
            {/* Page size selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 70 }}>
                <Select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Results info */}
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, filteredFlights.length)} of{' '}
              {filteredFlights.length} results
            </Typography>

            {/* Pagination controls */}
            <Pagination
              count={Math.ceil(filteredFlights.length / rowsPerPage)}
              page={page + 1}
              onChange={(e, p) => handlePageChange(e, p - 1)}
              color="primary"
              showFirstButton
              showLastButton
              size={isMobile ? 'small' : 'medium'}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default FlightList;
