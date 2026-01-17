// ============================================================================
// Flight Search Engine - Main Application
// Enterprise-grade flight search with React Query, MUI, and Recharts
// Optimized with memoization, derived state, and context
// ============================================================================

import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
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
  TrustStats,
  PopularDestinations,
  WhyChooseUs,
  Testimonials,
  NewsletterSignup,
  Footer,
} from './components';

// Hooks
import { useFlightSearch, useFlightFilters, useStableCallback } from './hooks';

// Utils
import { formatIsoDuration, parseDuration } from './utils/formatters';

// Types
import type { FlightSearchParams, FlightOffer } from './types';

// -----------------------------------------------------------------------------
// Memoized Landing Page Section
// Prevents re-renders when search state changes
// -----------------------------------------------------------------------------

const LandingPageSections = memo(() => (
  <Fade in timeout={800}>
    <Box>
      <TrustStats />
      <PopularDestinations />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSignup />
    </Box>
  </Fade>
));

LandingPageSections.displayName = 'LandingPageSections';

// -----------------------------------------------------------------------------
// Memoized Error Alert
// -----------------------------------------------------------------------------

interface ErrorAlertProps {
  error: Error | null;
  isError: boolean;
  onClose: () => void;
}

const ErrorAlert = memo<ErrorAlertProps>(({ error, isError, onClose }) => {
  if (!isError) return null;
  
  return (
    <Fade in>
      <Alert severity="error" sx={{ mb: 3 }} onClose={onClose}>
        <AlertTitle>Error</AlertTitle>
        {error?.message || 'An error occurred while searching for flights.'}
      </Alert>
    </Fade>
  );
});

ErrorAlert.displayName = 'ErrorAlert';

// -----------------------------------------------------------------------------
// Memoized API Warning
// -----------------------------------------------------------------------------

const ApiWarning = memo(() => {
  if (import.meta.env.VITE_AMADEUS_CLIENT_ID) return null;
  
  return (
    <Fade in>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <AlertTitle>API Credentials Required</AlertTitle>
        To search for real flights, please set your Amadeus API credentials in a{' '}
        <code>.env</code> file. See <code>.env.example</code> for reference.
      </Alert>
    </Fade>
  );
});

ApiWarning.displayName = 'ApiWarning';

// -----------------------------------------------------------------------------
// Memoized Empty Results State
// -----------------------------------------------------------------------------

const EmptyResultsState = memo(() => (
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
));

EmptyResultsState.displayName = 'EmptyResultsState';

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

  // Notification states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<string | null>(null);

  // Flight search with optimized callbacks
  const {
    flights,
    dictionaries,
    isLoading,
    isError,
    error,
    isFetching,
  } = useFlightSearch(searchParams, {
    enabled: !!searchParams,
    onSuccess: useCallback(() => {
      setShowSuccess(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }, []),
    onError: useCallback((err: Error) => {
      setErrorMessage(err.message);
    }, []),
  });

  // Flight filters with memoized hook
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

  // Derived state: Price range for filters (memoized)
  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 1000 };
    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  // Derived state: Fastest flight duration (memoized)
  const fastestDuration = useMemo(() => {
    if (flights.length === 0) return undefined;
    const durations = flights.map((f) => {
      const duration = f.itineraries[0]?.duration || 'PT0H';
      return parseDuration(duration);
    });
    const fastest = Math.min(...durations);
    return formatIsoDuration(`PT${Math.floor(fastest / 60)}H${fastest % 60}M`);
  }, [flights]);

  // Derived state: Active filter count (memoized)
  const activeFilterCount = useMemo(() => {
    return (
      filters.stops.length +
      filters.airlines.length +
      (filters.priceRange.min > priceRange.min ||
      filters.priceRange.max < priceRange.max
        ? 1
        : 0)
    );
  }, [filters.stops.length, filters.airlines.length, filters.priceRange, priceRange]);

  // Derived state: Currency (memoized)
  const currency = useMemo(() => flights[0]?.price.currency || 'USD', [flights]);

  // Stable handlers using useStableCallback to prevent unnecessary re-renders
  const handleSearch = useStableCallback((params: FlightSearchParams) => {
    setSearchParams(params);
    setHasSearched(true);
    resetFilters();
    setErrorMessage(null);
  });

  const handleSelectFlight = useStableCallback((flight: FlightOffer) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  });

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleConfirmFlight = useStableCallback((flight: FlightOffer) => {
    setIsModalOpen(false);
    setSelectedFlight(null);
    
    // Format booking confirmation message
    const price = parseFloat(flight.price.grandTotal);
    const flightCurrency = flight.price.currency;
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: flightCurrency,
      minimumFractionDigits: 0,
    }).format(price);
    setBookingConfirmation(`Flight confirmed! ${formattedPrice} - Redirecting to payment...`);
  });

  const handleCloseError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleEditSearch = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenMobileFilters = useCallback(() => {
    setMobileFiltersOpen(true);
  }, []);

  const handleCloseMobileFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
  }, []);

  const handleCloseBookingConfirmation = useCallback(() => {
    setBookingConfirmation(null);
  }, []);

  // Memoized loading state check
  const showLoading = isLoading && hasSearched;
  const showResults = !isLoading && flights.length > 0;
  const showEmpty = !isLoading && hasSearched && flights.length === 0 && !isError;

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
            <ErrorAlert error={error} isError={isError} onClose={handleCloseError} />

            {/* API Credentials Warning */}
            <ApiWarning />

            {/* Loading State */}
            {showLoading && (
              <Fade in>
                <Box>
                  <LoadingOverlay />
                </Box>
              </Fade>
            )}

            {/* Results Content */}
            {showResults && (
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
                    currency={currency}
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
                            currency={currency}
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
            {showEmpty && <EmptyResultsState />}

            {/* Mobile Filter FAB */}
            {isMobile && flights.length > 0 && (
              <Zoom in={!isLoading}>
                <Fab
                  color="primary"
                  onClick={handleOpenMobileFilters}
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
                onMobileClose={handleCloseMobileFilters}
              />
            )}
          </Container>
        </Box>
      )}

      {/* Landing Page Sections - No Search Yet */}
      {!hasSearched && <LandingPageSections />}

      {/* Footer - Always visible */}
      <Footer />

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
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" variant="filled">
          Found {flights.length} flight{flights.length !== 1 ? 's' : ''} for you!
        </Alert>
      </Snackbar>

      {/* Booking Confirmation Snackbar */}
      <Snackbar
        open={!!bookingConfirmation}
        autoHideDuration={5000}
        onClose={handleCloseBookingConfirmation}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseBookingConfirmation}
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
