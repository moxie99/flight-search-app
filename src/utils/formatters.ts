// ============================================================================
// Formatters and Utility Functions
// ============================================================================

import { format, parseISO, differenceInMinutes } from 'date-fns';

// -----------------------------------------------------------------------------
// Duration Formatting
// -----------------------------------------------------------------------------

/**
 * Parse ISO 8601 duration string to total minutes
 * @param duration - ISO 8601 duration (e.g., "PT2H30M")
 */
export const parseDuration = (duration: string): number => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = parseInt(matches?.[1] || '0', 10);
  const minutes = parseInt(matches?.[2] || '0', 10);
  return hours * 60 + minutes;
};

/**
 * Format minutes to human-readable duration
 * @param minutes - Total minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format ISO 8601 duration to human-readable string
 * @param duration - ISO 8601 duration (e.g., "PT2H30M")
 */
export const formatIsoDuration = (duration: string): string => {
  return formatDuration(parseDuration(duration));
};

// -----------------------------------------------------------------------------
// Price Formatting
// -----------------------------------------------------------------------------

/**
 * Format price with currency symbol
 * @param price - Price value (number or string)
 * @param currency - Currency code (default: USD)
 */
export const formatPrice = (
  price: number | string,
  currency: string = 'USD'
): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

/**
 * Format price range
 */
export const formatPriceRange = (
  min: number,
  max: number,
  currency: string = 'USD'
): string => {
  return `${formatPrice(min, currency)} - ${formatPrice(max, currency)}`;
};

// -----------------------------------------------------------------------------
// Date/Time Formatting
// -----------------------------------------------------------------------------

/**
 * Format ISO datetime to time string
 * @param isoString - ISO datetime string
 */
export const formatTime = (isoString: string): string => {
  return format(parseISO(isoString), 'HH:mm');
};

/**
 * Format ISO datetime to date string
 * @param isoString - ISO datetime string
 */
export const formatDate = (isoString: string): string => {
  return format(parseISO(isoString), 'EEE, MMM d');
};

/**
 * Format ISO datetime to full datetime string
 * @param isoString - ISO datetime string
 */
export const formatDateTime = (isoString: string): string => {
  return format(parseISO(isoString), 'EEE, MMM d · HH:mm');
};

/**
 * Format date for API request (YYYY-MM-DD)
 * @param date - Date object
 */
export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Calculate duration between two ISO datetime strings
 */
export const calculateFlightDuration = (
  departure: string,
  arrival: string
): string => {
  const minutes = differenceInMinutes(parseISO(arrival), parseISO(departure));
  return formatDuration(minutes);
};

// -----------------------------------------------------------------------------
// Flight Formatting
// -----------------------------------------------------------------------------

/**
 * Format number of stops to human-readable string
 */
export const formatStops = (stops: number): string => {
  if (stops === 0) return 'Non-stop';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
};

/**
 * Get stop count from flight itinerary
 */
export const getStopCount = (segments: { numberOfStops: number }[]): number => {
  const segmentStops = segments.reduce(
    (sum, segment) => sum + segment.numberOfStops,
    0
  );
  const connections = Math.max(0, segments.length - 1);
  return segmentStops + connections;
};

/**
 * Format airline codes to string
 */
export const formatAirlines = (
  codes: string[],
  carriers?: Record<string, string>
): string => {
  if (!carriers) return codes.join(', ');
  return codes.map((code) => carriers[code] || code).join(', ');
};

// -----------------------------------------------------------------------------
// String Utilities
// -----------------------------------------------------------------------------

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// -----------------------------------------------------------------------------
// Number Utilities
// -----------------------------------------------------------------------------

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Round to specified decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
