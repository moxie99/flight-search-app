// ============================================================================
// Flight Search Engine - Type Definitions
// Enterprise-grade TypeScript interfaces for flight data
// ============================================================================

// -----------------------------------------------------------------------------
// Core Flight Types
// -----------------------------------------------------------------------------

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
}

export interface FlightSegment {
  id: string;
  departure: {
    iataCode: string;
    terminal?: string;
    at: string; // ISO datetime
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  carrierName?: string;
  flightNumber: string;
  aircraft: {
    code: string;
    name?: string;
  };
  duration: string; // ISO 8601 duration (e.g., "PT2H30M")
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightPrice {
  currency: string;
  total: string;
  base: string;
  fees?: Array<{
    amount: string;
    type: string;
  }>;
  grandTotal: string;
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: FlightPrice;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags?: {
      weight?: number;
      weightUnit?: string;
      quantity?: number;
    };
  }>;
}

// -----------------------------------------------------------------------------
// Search Parameters
// -----------------------------------------------------------------------------

export type TripType = 'one-way' | 'round-trip';
export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';

export interface TravelerCount {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: CabinClass;
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  max?: number; // max results
}

// -----------------------------------------------------------------------------
// Filter Types
// -----------------------------------------------------------------------------

export interface FlightFilters {
  stops: StopFilter[];
  priceRange: PriceRange;
  airlines: string[];
  departureTimeRange: TimeRange;
  arrivalTimeRange: TimeRange;
  duration: number | null; // max duration in minutes
}

export type StopFilter = 'non-stop' | '1-stop' | '2+-stops';

export interface PriceRange {
  min: number;
  max: number;
}

export interface TimeRange {
  start: string; // HH:mm
  end: string;
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface AmadeusFlightSearchResponse {
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
  data: FlightOffer[];
  dictionaries?: {
    locations: Record<string, { cityCode: string; countryCode: string }>;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    carriers: Record<string, string>;
  };
}

export interface AmadeusAirportSearchResponse {
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    iataCode: string;
    address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
    };
  }>;
}

export interface AmadeusTokenResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

// -----------------------------------------------------------------------------
// UI State Types
// -----------------------------------------------------------------------------

export interface SearchFormState {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  tripType: TripType;
  travelers: TravelerCount;
  cabinClass: CabinClass;
}

export interface PriceGraphDataPoint {
  date: string;
  price: number;
  label: string;
}

export interface FilteredFlightResults {
  flights: FlightOffer[];
  priceStats: {
    min: number;
    max: number;
    average: number;
  };
  airlineOptions: Array<{
    code: string;
    name: string;
    count: number;
  }>;
}

// -----------------------------------------------------------------------------
// Utility Types
// -----------------------------------------------------------------------------

export type SortOption = 'price-asc' | 'price-desc' | 'duration-asc' | 'departure-asc';

export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
