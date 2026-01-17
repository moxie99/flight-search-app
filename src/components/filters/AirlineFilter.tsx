// ============================================================================
// Airline Filter Component
// Multi-select airline filter with debounced search (optimized for performance)
// ============================================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useDebounce } from '../../hooks';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AirlineOption {
  code: string;
  name: string;
  count: number;
}

interface AirlineFilterProps {
  airlines: AirlineOption[];
  selectedAirlines: string[];
  onChange: (airlines: string[]) => void;
  disabled?: boolean;
  maxVisible?: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const SEARCH_DEBOUNCE_DELAY = 200; // ms

// -----------------------------------------------------------------------------
// Airline Checkbox Item (Memoized)
// -----------------------------------------------------------------------------

interface AirlineCheckboxProps {
  airline: AirlineOption;
  isSelected: boolean;
  disabled: boolean;
  onChange: (code: string) => void;
}

const AirlineCheckbox: React.FC<AirlineCheckboxProps> = React.memo(
  ({ airline, isSelected, disabled, onChange }) => {
    const handleChange = useCallback(() => {
      onChange(airline.code);
    }, [airline.code, onChange]);

    return (
      <FormControlLabel
        disabled={disabled}
        control={
          <Checkbox
            checked={isSelected}
            onChange={handleChange}
            size="small"
          />
        }
        label={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                mr: 1,
              }}
            >
              {airline.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ flexShrink: 0 }}
            >
              ({airline.count})
            </Typography>
          </Box>
        }
        sx={{
          ml: 0,
          mb: 0.5,
          width: '100%',
          '& .MuiFormControlLabel-label': {
            flex: 1,
            overflow: 'hidden',
          },
        }}
      />
    );
  }
);

AirlineCheckbox.displayName = 'AirlineCheckbox';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const AirlineFilterComponent: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onChange,
  disabled = false,
  maxVisible = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Debounce search term for filtering
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_DELAY);

  // Memoized filtered airlines
  const filteredAirlines = useMemo(() => {
    if (!debouncedSearchTerm) return airlines;
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return airlines.filter(
      (airline) =>
        airline.name.toLowerCase().includes(searchLower) ||
        airline.code.toLowerCase().includes(searchLower)
    );
  }, [airlines, debouncedSearchTerm]);

  // Memoized visible airlines
  const visibleAirlines = useMemo(() => {
    return showAll ? filteredAirlines : filteredAirlines.slice(0, maxVisible);
  }, [filteredAirlines, showAll, maxVisible]);

  // Derived state
  const hasMore = filteredAirlines.length > maxVisible;
  const remainingCount = filteredAirlines.length - maxVisible;
  const allSelected = selectedAirlines.length === filteredAirlines.length && filteredAirlines.length > 0;

  // Selected airlines set for O(1) lookup
  const selectedSet = useMemo(
    () => new Set(selectedAirlines),
    [selectedAirlines]
  );

  // Memoized handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleAirlineToggle = useCallback(
    (airlineCode: string) => {
      if (selectedAirlines.includes(airlineCode)) {
        onChange(selectedAirlines.filter((code) => code !== airlineCode));
      } else {
        onChange([...selectedAirlines, airlineCode]);
      }
    },
    [selectedAirlines, onChange]
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(filteredAirlines.map((a) => a.code));
    }
  }, [allSelected, filteredAirlines, onChange]);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  if (airlines.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Airlines
      </Typography>

      {/* Search Input */}
      {airlines.length > 5 && (
        <TextField
          size="small"
          fullWidth
          placeholder="Search airlines..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />
      )}

      {/* Select All */}
      {filteredAirlines.length > 1 && (
        <Box sx={{ mb: 1 }}>
          <Button
            size="small"
            onClick={handleSelectAll}
            disabled={disabled}
            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </Button>
        </Box>
      )}

      {/* Airline Checkboxes */}
      <FormGroup>
        {visibleAirlines.map((airline) => (
          <AirlineCheckbox
            key={airline.code}
            airline={airline}
            isSelected={selectedSet.has(airline.code)}
            disabled={disabled}
            onChange={handleAirlineToggle}
          />
        ))}
      </FormGroup>

      {/* Show More/Less */}
      {hasMore && !debouncedSearchTerm && (
        <Button
          size="small"
          onClick={handleToggleShowAll}
          endIcon={showAll ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {showAll ? 'Show less' : `Show ${remainingCount} more`}
        </Button>
      )}

      {/* No Results */}
      {filteredAirlines.length === 0 && debouncedSearchTerm && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No airlines match "{debouncedSearchTerm}"
        </Typography>
      )}
    </Box>
  );
};

// Custom comparison for memoization
const arePropsEqual = (
  prevProps: AirlineFilterProps,
  nextProps: AirlineFilterProps
): boolean => {
  // Compare airlines array by length and codes
  if (prevProps.airlines.length !== nextProps.airlines.length) return false;
  
  // Compare selected airlines
  if (prevProps.selectedAirlines.length !== nextProps.selectedAirlines.length) return false;
  if (prevProps.selectedAirlines.some((code, i) => code !== nextProps.selectedAirlines[i])) {
    return false;
  }
  
  // Compare other props
  return (
    prevProps.disabled === nextProps.disabled &&
    prevProps.maxVisible === nextProps.maxVisible
  );
};

export const AirlineFilter = React.memo(AirlineFilterComponent, arePropsEqual);

export default AirlineFilter;
