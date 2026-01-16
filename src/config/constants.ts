// ============================================================================
// Application Constants
// ============================================================================

export const API_CONFIG = {
  AMADEUS_BASE_URL: import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com',
  AMADEUS_AUTH_URL: `${import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com'}/v1/security/oauth2/token`,
  AMADEUS_CLIENT_ID: import.meta.env.VITE_AMADEUS_CLIENT_ID || '',
  AMADEUS_CLIENT_SECRET: import.meta.env.VITE_AMADEUS_CLIENT_SECRET || '',
} as const;

export const QUERY_KEYS = {
  FLIGHTS: 'flights',
  FLIGHT_OFFERS: 'flight-offers',
  AIRPORTS: 'airports',
  AIRPORT_SEARCH: 'airport-search',
  PRICE_ANALYSIS: 'price-analysis',
} as const;

export const CACHE_TIME = {
  FLIGHTS: 1000 * 60 * 5, // 5 minutes
  AIRPORTS: 1000 * 60 * 30, // 30 minutes
  TOKEN: 1000 * 60 * 25, // 25 minutes (token expires in 30)
} as const;

export const DEFAULT_SEARCH_PARAMS = {
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: 'ECONOMY' as const,
  currencyCode: 'USD',
  max: 50,
} as const;

export const CABIN_CLASS_OPTIONS = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
] as const;

export const STOP_OPTIONS = [
  { value: 'non-stop', label: 'Non-stop', maxStops: 0 },
  { value: '1-stop', label: '1 Stop', maxStops: 1 },
  { value: '2+-stops', label: '2+ Stops', maxStops: 2 },
] as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;
