// ============================================================================
// Hooks Barrel Export
// ============================================================================

export { useFlightSearch, usePrefetchFlights } from './useFlightSearch';
export { useAirportSearch, toAirport } from './useAirportSearch';
export { useFlightFilters } from './useFlightFilters';
export { useSeatmap } from './useSeatmap';

// Optimization hooks
export {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledCallback,
  usePrevious,
  useStableCallback,
  useDeepMemo,
  useIntersectionObserver,
  useVirtualizedList,
} from './useOptimizations';
