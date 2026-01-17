// ============================================================================
// Price Range Filter Component
// Dual-handle slider with debounced input (optimized for performance)
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  InputAdornment,
} from '@mui/material';
import type { PriceRange } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { useDebouncedCallback } from '../../hooks';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface PriceRangeFilterProps {
  value: PriceRange;
  onChange: (range: PriceRange) => void;
  min: number;
  max: number;
  currency?: string;
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEBOUNCE_DELAY = 300; // ms

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const PriceRangeFilterComponent: React.FC<PriceRangeFilterProps> = ({
  value,
  onChange,
  min,
  max,
  currency = 'USD',
  disabled = false,
}) => {
  // Local state for smooth slider movement
  const [localValue, setLocalValue] = useState<[number, number]>([
    value.min || min,
    value.max === Infinity ? max : value.max,
  ]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue([
      value.min || min,
      value.max === Infinity ? max : value.max,
    ]);
  }, [value, min, max]);

  // Debounced onChange for input fields to prevent excessive updates
  const debouncedOnChange = useDebouncedCallback(
    (newRange: PriceRange) => {
      onChange(newRange);
    },
    DEBOUNCE_DELAY
  );

  // Memoize step calculation
  const step = useMemo(() => Math.max(1, Math.round((max - min) / 100)), [max, min]);

  // Memoize slider value label formatter
  const valueLabelFormat = useCallback(
    (val: number) => formatPrice(val, currency),
    [currency]
  );

  // Handle slider change (local only, no external update yet)
  const handleSliderChange = useCallback(
    (_event: Event, newValue: number | number[]) => {
      const [newMin, newMax] = newValue as [number, number];
      setLocalValue([newMin, newMax]);
    },
    []
  );

  // Handle slider commit (update external state)
  const handleSliderCommit = useCallback(
    (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
      const [newMin, newMax] = newValue as [number, number];
      onChange({ min: newMin, max: newMax });
    },
    [onChange]
  );

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (type: 'min' | 'max', inputValue: string) => {
      const numValue = parseInt(inputValue, 10) || 0;
      
      if (type === 'min') {
        const newMin = Math.max(min, Math.min(numValue, localValue[1]));
        setLocalValue([newMin, localValue[1]]);
        debouncedOnChange({ min: newMin, max: localValue[1] });
      } else {
        const newMax = Math.min(max, Math.max(numValue, localValue[0]));
        setLocalValue([localValue[0], newMax]);
        debouncedOnChange({ min: localValue[0], max: newMax });
      }
    },
    [min, max, localValue, debouncedOnChange]
  );

  // Memoize input handlers
  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange('min', e.target.value);
    },
    [handleInputChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange('max', e.target.value);
    },
    [handleInputChange]
  );

  // Memoize display text
  const rangeDisplayText = useMemo(
    () => `${formatPrice(localValue[0], currency)} - ${formatPrice(localValue[1], currency)}`,
    [localValue, currency]
  );

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Price Range
      </Typography>

      {/* Slider */}
      <Box sx={{ px: 1 }}>
        <Slider
          value={localValue}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommit}
          valueLabelDisplay="auto"
          valueLabelFormat={valueLabelFormat}
          min={min}
          max={max}
          step={step}
          disabled={disabled || min === max}
          sx={{
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'primary.main',
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Input Fields */}
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          size="small"
          label="Min"
          type="number"
          value={localValue[0]}
          onChange={handleMinChange}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
          inputProps={{
            min: min,
            max: localValue[1],
            step: step,
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          size="small"
          label="Max"
          type="number"
          value={localValue[1]}
          onChange={handleMaxChange}
          disabled={disabled}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
          inputProps={{
            min: localValue[0],
            max: max,
            step: step,
          }}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Range Display */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 1, textAlign: 'center' }}
      >
        {rangeDisplayText}
      </Typography>
    </Box>
  );
};

// Custom comparison for memoization
const arePropsEqual = (
  prevProps: PriceRangeFilterProps,
  nextProps: PriceRangeFilterProps
): boolean => {
  return (
    prevProps.value.min === nextProps.value.min &&
    prevProps.value.max === nextProps.value.max &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.currency === nextProps.currency
  );
};

export const PriceRangeFilter = React.memo(PriceRangeFilterComponent, arePropsEqual);

export default PriceRangeFilter;
