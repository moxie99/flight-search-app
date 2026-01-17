// ============================================================================
// Flight Context
// Optimized context for flight search state management
// Uses context splitting to minimize re-renders
// ============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
} from 'react';
import type { FlightOffer, FlightSearchParams, SortOption } from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface FlightState {
  searchParams: FlightSearchParams | null;
  hasSearched: boolean;
  selectedFlight: FlightOffer | null;
  isModalOpen: boolean;
  sortOption: SortOption;
}

interface FlightActions {
  setSearchParams: (params: FlightSearchParams) => void;
  setSelectedFlight: (flight: FlightOffer | null) => void;
  openModal: (flight: FlightOffer) => void;
  closeModal: () => void;
  setSortOption: (option: SortOption) => void;
  resetSearch: () => void;
}

// -----------------------------------------------------------------------------
// Contexts (Split for optimization)
// Components only re-render when the context they consume changes
// -----------------------------------------------------------------------------

const FlightStateContext = createContext<FlightState | null>(null);
const FlightActionsContext = createContext<FlightActions | null>(null);

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------

interface FlightProviderProps {
  children: React.ReactNode;
}

export const FlightProvider: React.FC<FlightProviderProps> = ({ children }) => {
  // State
  const [searchParams, setSearchParamsState] = useState<FlightSearchParams | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlightState] = useState<FlightOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOptionState] = useState<SortOption>('price-asc');

  // Use refs to track previous values for optimization
  const prevSearchParamsRef = useRef<FlightSearchParams | null>(null);

  // Memoized state object
  const state = useMemo<FlightState>(
    () => ({
      searchParams,
      hasSearched,
      selectedFlight,
      isModalOpen,
      sortOption,
    }),
    [searchParams, hasSearched, selectedFlight, isModalOpen, sortOption]
  );

  // Memoized actions (stable references)
  const actions = useMemo<FlightActions>(
    () => ({
      setSearchParams: (params: FlightSearchParams) => {
        prevSearchParamsRef.current = searchParams;
        setSearchParamsState(params);
        setHasSearched(true);
      },
      setSelectedFlight: (flight: FlightOffer | null) => {
        setSelectedFlightState(flight);
      },
      openModal: (flight: FlightOffer) => {
        setSelectedFlightState(flight);
        setIsModalOpen(true);
      },
      closeModal: () => {
        setIsModalOpen(false);
        // Optionally clear selected flight after modal animation
        setTimeout(() => {
          setSelectedFlightState(null);
        }, 300);
      },
      setSortOption: (option: SortOption) => {
        setSortOptionState(option);
      },
      resetSearch: () => {
        setSearchParamsState(null);
        setHasSearched(false);
        setSelectedFlightState(null);
        setIsModalOpen(false);
        setSortOptionState('price-asc');
      },
    }),
    [searchParams] // Only searchParams needed for prevSearchParamsRef comparison
  );

  return (
    <FlightStateContext.Provider value={state}>
      <FlightActionsContext.Provider value={actions}>
        {children}
      </FlightActionsContext.Provider>
    </FlightStateContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// Custom Hooks
// -----------------------------------------------------------------------------

/**
 * Hook to access flight state
 * Only causes re-renders when state changes
 */
export const useFlightState = (): FlightState => {
  const context = useContext(FlightStateContext);
  if (!context) {
    throw new Error('useFlightState must be used within a FlightProvider');
  }
  return context;
};

/**
 * Hook to access flight actions
 * Actions are stable and don't cause re-renders
 */
export const useFlightActions = (): FlightActions => {
  const context = useContext(FlightActionsContext);
  if (!context) {
    throw new Error('useFlightActions must be used within a FlightProvider');
  }
  return context;
};

/**
 * Hook to access both state and actions
 */
export const useFlight = (): FlightState & FlightActions => {
  const state = useFlightState();
  const actions = useFlightActions();
  return { ...state, ...actions };
};

/**
 * Hook to select specific state values (optimizes re-renders)
 */
export const useFlightSelector = <T,>(selector: (state: FlightState) => T): T => {
  const state = useFlightState();
  return useMemo(() => selector(state), [selector, state]);
};

// -----------------------------------------------------------------------------
// Specialized Hooks for Common Use Cases
// -----------------------------------------------------------------------------

/**
 * Hook for search-related state and actions
 */
export const useFlightSearch2 = () => {
  const { searchParams, hasSearched } = useFlightState();
  const { setSearchParams, resetSearch } = useFlightActions();
  
  return useMemo(
    () => ({
      searchParams,
      hasSearched,
      setSearchParams,
      resetSearch,
    }),
    [searchParams, hasSearched, setSearchParams, resetSearch]
  );
};

/**
 * Hook for modal-related state and actions
 */
export const useFlightModal = () => {
  const { selectedFlight, isModalOpen } = useFlightState();
  const { openModal, closeModal, setSelectedFlight } = useFlightActions();
  
  return useMemo(
    () => ({
      selectedFlight,
      isModalOpen,
      openModal,
      closeModal,
      setSelectedFlight,
    }),
    [selectedFlight, isModalOpen, openModal, closeModal, setSelectedFlight]
  );
};

/**
 * Hook for sorting-related state and actions
 */
export const useFlightSort = () => {
  const { sortOption } = useFlightState();
  const { setSortOption } = useFlightActions();
  
  return useMemo(
    () => ({
      sortOption,
      setSortOption,
    }),
    [sortOption, setSortOption]
  );
};

export default FlightProvider;
