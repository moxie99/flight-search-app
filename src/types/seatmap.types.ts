// ============================================================================
// Seatmap Types - Amadeus Seatmap API Response Interfaces
// Enterprise-grade TypeScript definitions for aircraft seatmap data
// ============================================================================

import type { CabinClass } from './flight.types';

// -----------------------------------------------------------------------------
// Core Seatmap Types
// -----------------------------------------------------------------------------

export interface SeatmapResponse {
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: Seatmap[];
  dictionaries?: SeatmapDictionaries;
}

export interface Seatmap {
  type: 'seatmap';
  id: string;
  departure: SeatmapAirportInfo;
  arrival: SeatmapAirportInfo;
  carrierCode: string;
  number: string;
  operating?: {
    carrierCode: string;
    number: string;
  };
  aircraft: {
    code: string;
  };
  class: string;
  flightOfferId: string;
  segmentId: string;
  decks: Deck[];
}

export interface SeatmapAirportInfo {
  iataCode: string;
  terminal?: string;
  at: string;
}

// -----------------------------------------------------------------------------
// Deck and Cabin Configuration
// -----------------------------------------------------------------------------

export interface Deck {
  deckType: DeckType;
  deckConfiguration: DeckConfiguration;
  facilities?: Facility[];
  seats?: Seat[];
}

export type DeckType = 'UPPER' | 'MAIN' | 'LOWER';

export interface DeckConfiguration {
  width: number;
  length: number;
  startSeatRow: number;
  endSeatRow: number;
  startWingsX?: number;
  endWingsX?: number;
  startWingsRow?: number;
  endWingsRow?: number;
  exitRowsX?: number[];
}

// -----------------------------------------------------------------------------
// Facilities (Galleys, Lavatories, etc.)
// -----------------------------------------------------------------------------

export interface Facility {
  code: FacilityCode;
  column: string;
  row: string;
  position: FacilityPosition;
  coordinates: Coordinates;
}

export type FacilityCode =
  | 'LA' // Lavatory
  | 'GA' // Galley
  | 'ST' // Storage
  | 'CL' // Closet
  | 'BA' // Bar
  | 'LG' // Lounge
  | 'SO' // Stairs to Other Deck
  | 'BU' // Bulkhead;

export type FacilityPosition = 'FRONT' | 'REAR';

// -----------------------------------------------------------------------------
// Seat Types
// -----------------------------------------------------------------------------

export interface Seat {
  cabin: CabinClass;
  number: string;
  characteristicsCodes: SeatCharacteristicCode[];
  travelerPricing?: TravelerSeatPricing[];
  coordinates: Coordinates;
  availabilityStatus: SeatAvailabilityStatus;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type SeatAvailabilityStatus = 'AVAILABLE' | 'BLOCKED' | 'OCCUPIED';

// Amadeus seat characteristic codes
export type SeatCharacteristicCode =
  | 'A'   // Aisle seat
  | 'W'   // Window seat
  | 'M'   // Middle seat
  | 'L'   // Leg space seat (extra legroom)
  | 'E'   // Exit row seat
  | 'B'   // Bassinet facility
  | 'K'   // Bulkhead seat
  | 'G'   // Adjacent to galley
  | 'V'   // Adjacent to lavatory
  | 'N'   // No seat at this location
  | 'I'   // Seat suitable for adult with infant
  | 'C'   // Center section seat
  | 'H'   // Handicapped facility
  | 'P'   // Preferential seat
  | 'Q'   // Quiet zone seat
  | 'R'   // Right side of aircraft
  | 'S'   // Left side of aircraft
  | '1'   // Rear facing seat
  | '2'   // Forward facing seat
  | 'CH'  // Chargeable seat
  | 'RS'  // Restricted recline seat
  | 'OW'  // Overwing seat
  | 'LS'  // Last seat in row
  | 'D'   // No seat - Loss of facility
  | 'U'   // Upper deck
  | 'AA'  // All aisle seats
  | 'AB'  // Adjacent to bar
  | 'AR'  // Arm rest movable (for disabled)
  | 'AS'  // Adjacent to storage
  | 'BI'  // Blind seat (no window)
  | 'CC'  // Center seat (not window or aisle)
  | 'DE'  // Designated exit
  | 'EC'  // Electronic connection available
  | 'FC'  // Front of cabin class
  | 'GF'  // General facility
  | 'GN'  // Adjacent to galley (narrow)
  | 'GR'  // Ground level
  | 'GW'  // Adjacent to galley (wide)
  | 'IA'  // Individual air conditioning
  | 'IE'  // Individual entertainment screen
  | 'IL'  // Individual light
  | 'IN'  // Individual phone/headset
  | 'IV'  // Individual video screen
  | 'JA'  // Jump seat
  | 'LA'  // Lavatory adjacent
  | 'LC'  // Last row of cabin
  | 'LF'  // Lifejacket under seat
  | 'LH'  // Long haul seat
  | 'MA'  // Medically approved seat
  | 'MN'  // Module not for common use
  | 'MS'  // Missing seat
  | 'NA'  // No adult (child only)
  | 'NE'  // Near emergency exit
  | 'NS'  // No smoking zone
  | 'OB'  // Obstructed view
  | 'PC'  // Power connection available
  | 'PR'  // Priority seat
  | 'PS'  // Premiere class seat
  | 'RB'  // Removable bulkhead
  | 'SC'  // Skycouch
  | 'SL'  // Sleeperette (extra recline)
  | 'SM'  // Smoking zone
  | 'SO'  // Storage space below
  | 'ST'  // Standard seat
  | 'TA'  // Table adjacent
  | 'UP'  // Upper deck
  | 'WA'  // Window and aisle together
  | 'WC'  // Wheelchair accessible
  | 'WI'  // With entertainment
  | 'X'   // No facility at this position
  | 'Z';  // Buffer zone

// -----------------------------------------------------------------------------
// Seat Pricing
// -----------------------------------------------------------------------------

export interface TravelerSeatPricing {
  travelerId: string;
  seatAvailabilityStatus: SeatAvailabilityStatus;
  price?: SeatPrice;
}

export interface SeatPrice {
  currency: string;
  total: string;
  base?: string;
  taxes?: SeatTax[];
}

export interface SeatTax {
  amount: string;
  code: string;
}

// -----------------------------------------------------------------------------
// Dictionaries
// -----------------------------------------------------------------------------

export interface SeatmapDictionaries {
  facilities?: Record<string, string>;
  seatCharacteristics?: Record<string, string>;
}

// -----------------------------------------------------------------------------
// UI State Types
// -----------------------------------------------------------------------------

export interface SelectedSeat {
  seatNumber: string;
  segmentId: string;
  cabin: CabinClass;
  characteristics: SeatCharacteristicCode[];
  price?: SeatPrice;
}

export interface SeatmapViewState {
  selectedSeats: Record<string, SelectedSeat>; // keyed by segmentId
  activeSegmentIndex: number;
}

// -----------------------------------------------------------------------------
// Helper Types for UI Components
// -----------------------------------------------------------------------------

export interface ProcessedSeat extends Seat {
  row: number;
  column: string;
  isWindow: boolean;
  isAisle: boolean;
  isMiddle: boolean;
  isExitRow: boolean;
  isExtraLegroom: boolean;
  isPremium: boolean;
  isSelected: boolean;
  displayPrice?: string;
}

export interface CabinSection {
  cabin: CabinClass;
  displayName: string;
  seats: ProcessedSeat[];
  rows: number[];
  columns: string[];
  startRow: number;
  endRow: number;
}

export interface SeatGridConfig {
  columns: string[];
  aisleAfterColumns: string[];
  totalRows: number;
}

// -----------------------------------------------------------------------------
// Seat Characteristic Display Mapping
// -----------------------------------------------------------------------------

export const SEAT_CHARACTERISTIC_LABELS: Partial<Record<SeatCharacteristicCode, string>> = {
  'A': 'Aisle',
  'W': 'Window',
  'M': 'Middle',
  'L': 'Extra Legroom',
  'E': 'Exit Row',
  'B': 'Bassinet',
  'K': 'Bulkhead',
  'G': 'Near Galley',
  'V': 'Near Lavatory',
  'P': 'Preferred',
  'Q': 'Quiet Zone',
  'OW': 'Over Wing',
  'CH': 'Chargeable',
  'RS': 'Limited Recline',
  'IE': 'Entertainment Screen',
  'PC': 'Power Outlet',
};

export const CABIN_CLASS_DISPLAY: Record<CabinClass, string> = {
  'FIRST': 'First Class',
  'BUSINESS': 'Business Class',
  'PREMIUM_ECONOMY': 'Premium Economy',
  'ECONOMY': 'Economy',
};

// -----------------------------------------------------------------------------
// Seat Status Colors (for UI reference)
// -----------------------------------------------------------------------------

export const SEAT_STATUS_COLORS = {
  available: '#1a365d',      // Primary blue
  selected: '#38a169',       // Success green
  occupied: '#a0aec0',       // Grey
  blocked: '#e2e8f0',        // Light grey
  premium: '#d69e2e',        // Gold/amber
  extraLegroom: '#805ad5',   // Purple
  exitRow: '#ed8936',        // Orange
} as const;
