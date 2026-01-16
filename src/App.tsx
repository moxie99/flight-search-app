// ============================================================================
// Flight Search Engine - Main Application
// Enterprise-grade flight search with React Query, MUI, and Recharts
// ============================================================================

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Fab,
  Badge,
  useMediaQuery,
  useTheme,
  Zoom,
  Alert,
  AlertTitle,
  Snackbar,
  Fade,
  Grow,
} from '@mui/material';
import { FilterList, CheckCircle } from '@mui/icons-material';

// Components
import {
  Header,
  HeroSection,
  SearchForm,
  FlightList,
  PriceGraph,
  FilterPanel,
  SearchSummary,
  QuickFilters,
  LoadingOverlay,
  FlightDetailsModal,
} from './components';

// Hooks
import { useFlightSearch, useFlightFilters } from './hooks';

// Utils
import { formatIsoDuration, parseDuration } from './utils/formatters';

// Types
import type { FlightSearchParams, FlightOffer } from './types';

// -----------------------------------------------------------------------------
// Main App Component
// -----------------------------------------------------------------------------

const App: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Selected flight modal state
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success notification
  const [showSuccess, setShowSuccess] = useState(false);

  // Booking confirmation notification
  const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(null);

  // Flight search
  const {
    flights,
    dictionaries,
    isLoading,
    isError,
    error,
    isFetching,
  } = useFlightSearch(searchParams, {
    enabled: !!searchParams,
    onSuccess: () => {
      setShowSuccess(true);
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    },
    onError: (err) => {
      setErrorMessage(err.message);
    },
  });

  // Flight filters
  const {
    filteredFlights,
    priceStats,
    airlineOptions,
    filters,
    sortOption,
    setStopFilters,
    setPriceRange,
    setAirlineFilters,
    setSortOption,
    resetFilters,
    hasActiveFilters,
  } = useFlightFilters({
    flights,
    dictionaries,
  });

  // Price range for filters
  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Calculate fastest flight duration
  const fastestDuration = useMemo(() => {
    if (flights.length === 0) return undefined;
    const durations = flights.map((f) => {
      const duration = f.itineraries[0]?.duration || 'PT0H';
      return parseDuration(duration);
    });
    const fastest = Math.min(...durations);
    return formatIsoDuration(`PT${Math.floor(fastest / 60)}H${fastest % 60}M`);
  }, [flights]);

  // Handlers
  const handleSearch = useCallback((params: FlightSearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    resetFilters();
    setErrorMessage(null);
  }, [resetFilters]);

  const handleSelectFlight = useCallback((flight: FlightOffer) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleConfirmFlight = useCallback((flight: FlightOffer) => {
    // In a real app, this would navigate to booking
    console.log('Confirmed flight:', flight);
    setIsModalOpen(false);
    setSelectedFlight(null);
    // Show booking confirmation toast
    const price = parseFloat(flight.price.grandTotal);
    const currency = flight.price.currency;
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
    setBookingConfirmation(`Flight confirmed! ${formattedPrice} - Redirecting to payment...`);
  }, []);

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleEditSearch = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Active filter count for mobile badge
  const activeFilterCount =
    filters.stops.length +
    filters.airlines.length +
    (filters.priceRange.min > priceRange.min ||
    filters.priceRange.max < priceRange.max
      ? 1
      : 0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section with Search */}
      <HeroSection>
        <SearchForm onSearch={handleSearch} isLoading={isLoading || isFetching} />
      </HeroSection>

      {/* Results Section */}
      {hasSearched && (
        <Box ref={resultsRef}>
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
            {/* Error Alert */}
            {isError && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  onClose={handleCloseError}
                >
                  <AlertTitle>Error</AlertTitle>
                  {error?.message || 'An error occurred while searching for flights.'}
                </Alert>
              </Fade>
            )}

            {/* API Credentials Warning */}
            {!import.meta.env.VITE_AMADEUS_CLIENT_ID && (
              <Fade in>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <AlertTitle>API Credentials Required</AlertTitle>
                  To search for real flights, please set your Amadeus API credentials in a{' '}
                  <code>.env</code> file. See <code>.env.example</code> for reference.
                </Alert>
              </Fade>
            )}

            {/* Loading State */}
            {isLoading && (
              <Fade in>
                <Box>
                  <LoadingOverlay />
                </Box>
              </Fade>
            )}

            {/* Results Content */}
            {!isLoading && flights.length > 0 && (
              <Fade in timeout={500}>
                <Box>
                  {/* Search Summary */}
                  {searchParams && (
                    <SearchSummary
                      searchParams={searchParams}
                      onEdit={handleEditSearch}
                    />
                  )}

                  {/* Quick Filters */}
                  <QuickFilters
                    selectedStops={filters.stops}
                    onStopsChange={setStopFilters}
                    cheapestPrice={priceStats.min}
                    fastestDuration={fastestDuration}
                    currency={flights[0]?.price.currency}
                  />

                  <Grid container spacing={3}>
                    {/* Filters - Desktop */}
                    {!isMobile && (
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Grow in timeout={600}>
                          <Box>
                            <FilterPanel
                              filters={filters}
                              airlineOptions={airlineOptions}
                              priceRange={priceRange}
                              onStopsChange={setStopFilters}
                              onPriceRangeChange={setPriceRange}
                              onAirlinesChange={setAirlineFilters}
                              onReset={resetFilters}
                              hasActiveFilters={hasActiveFilters}
                              disabled={isLoading || flights.length === 0}
                            />
                          </Box>
                        </Grow>
                      </Grid>
                    )}

                    {/* Main Content */}
                    <Grid size={{ xs: 12, md: isMobile ? 12 : 9 }}>
                      {/* Price Graph */}
                      <Grow in timeout={700}>
                        <Box sx={{ mb: 3 }}>
                          <PriceGraph
                            flights={filteredFlights}
                            isLoading={isLoading}
                            currency={flights[0]?.price.currency || 'USD'}
                          />
                        </Box>
                      </Grow>

                      {/* Flight List */}
                      <Fade in timeout={800}>
                        <Box>
                          <FlightList
                            flights={filteredFlights}
                            carriers={dictionaries?.carriers}
                            isLoading={isLoading}
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            onSelectFlight={handleSelectFlight}
                          />
                        </Box>
                      </Fade>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* Empty Results State */}
            {!isLoading && hasSearched && flights.length === 0 && !isError && (
              <Fade in>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: 40, height: 40, fill: 'grey.400' }}
                    >
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </Box>
                  </Box>
                  <Box sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1.25rem', mb: 1 }}>
                    No flights found
                  </Box>
                  <Box sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
                    We couldn't find any flights matching your criteria. Try adjusting your dates or destinations.
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Mobile Filter FAB */}
            {isMobile && flights.length > 0 && (
              <Zoom in={!isLoading}>
                <Fab
                  color="primary"
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    boxShadow: '0 4px 20px rgba(26, 54, 93, 0.3)',
                  }}
                >
                  <Badge
                    badgeContent={activeFilterCount}
                    color="secondary"
                    overlap="circular"
                  >
                    <FilterList />
                  </Badge>
                </Fab>
              </Zoom>
            )}

            {/* Mobile Filter Drawer */}
            {isMobile && (
              <FilterPanel
                filters={filters}
                airlineOptions={airlineOptions}
                priceRange={priceRange}
                onStopsChange={setStopFilters}
                onPriceRangeChange={setPriceRange}
                onAirlinesChange={setAirlineFilters}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
                disabled={isLoading || flights.length === 0}
                mobileOpen={mobileFiltersOpen}
                onMobileClose={() => setMobileFiltersOpen(false)}
              />
            )}
          </Container>
        </Box>
      )}

      {/* Initial State - No Search Yet */}
      {!hasSearched && (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
          <Fade in timeout={800}>
            <Box
              sx={{
                py: 6,
                px: 3,
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  mx: 'auto',
                  boxShadow: '0 8px 32px rgba(26, 54, 93, 0.2)',
                  animation: 'pulse 3s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                      boxShadow: '0 8px 32px rgba(26, 54, 93, 0.2)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 12px 40px rgba(26, 54, 93, 0.3)',
                    },
                  },
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  sx={{
                    width: 40,
                    height: 40,
                    fill: 'white',
                    transform: 'rotate(45deg)',
                  }}
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </Box>
              </Box>
              <Box sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
                Enter your travel details above to search for available flights.
                Compare prices, filter by stops, airlines, and more.
              </Box>
            </Box>
          </Fade>
        </Container>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess && flights.length > 0}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" variant="filled">
          Found {flights.length} flight{flights.length !== 1 ? 's' : ''} for you!
        </Alert>
      </Snackbar>

      {/* Booking Confirmation Snackbar */}
      <Snackbar
        open={!!bookingConfirmation}
        autoHideDuration={5000}
        onClose={() => setBookingConfirmation(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setBookingConfirmation(null)}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{
            minWidth: 300,
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          {bookingConfirmation}
        </Alert>
      </Snackbar>

      {/* Flight Details Modal */}
      <FlightDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        flight={selectedFlight}
        carriers={dictionaries?.carriers}
        onConfirm={handleConfirmFlight}
      />
    </Box>
  );
};

export default App;
