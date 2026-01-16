// ============================================================================
// Airport Autocomplete Component
// Debounced search with rich airport suggestions
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  LocationOn,
} from '@mui/icons-material';
import { useAirportSearch, toAirport } from '../../hooks';
import type { Airport } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AirportAutocompleteProps {
  label: string;
  placeholder?: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  type: 'origin' | 'destination';
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

interface AirportOption {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  detailedName: string;
  type: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type,
  error,
  helperText,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { airports, isLoading, setSearchTerm } = useAirportSearch('', 300);

  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, newInputValue: string) => {
      setInputValue(newInputValue);
      setSearchTerm(newInputValue);
    },
    [setSearchTerm]
  );

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: AirportOption | null) => {
      if (newValue) {
        onChange(toAirport(newValue));
      } else {
        onChange(null);
      }
    },
    [onChange]
  );

  const getOptionLabel = (option: AirportOption | Airport): string => {
    if ('detailedName' in option) {
      return `${option.cityName} (${option.iataCode})`;
    }
    return `${option.cityName} (${option.iataCode})`;
  };

  const isOptionEqualToValue = (
    option: AirportOption,
    val: AirportOption | Airport
  ): boolean => {
    return option.iataCode === val.iataCode;
  };

  const Icon = type === 'origin' ? FlightTakeoff : FlightLand;

  return (
    <Autocomplete<AirportOption, false, false, false>
      fullWidth
      disabled={disabled}
      options={airports}
      value={value as AirportOption | null}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // Disable built-in filtering, use API results
      loading={isLoading}
      noOptionsText={
        inputValue.length < 2
          ? 'Type to search airports...'
          : 'No airports found'
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Icon color={error ? 'error' : 'action'} fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option, state) => {
        const { key, ...otherProps } = props;
        // Use iataCode + type + index for unique key to handle duplicates from API
        const uniqueKey = `${option.iataCode}-${option.type}-${state.index}`;
        return (
          <Box
            component="li"
            key={uniqueKey}
            {...otherProps}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              py: 1.5,
            }}
          >
            <LocationOn
              sx={{
                color: 'text.secondary',
                fontSize: 20,
                mt: 0.25,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.cityName}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {option.iataCode}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {option.name} · {option.countryCode}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default AirportAutocomplete;
