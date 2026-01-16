// ============================================================================
// Price Range Filter Component
// Dual-handle slider for price filtering
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  InputAdornment,
} from '@mui/material';
import type { PriceRange } from '../../types';
import { formatPrice } from '../../utils/formatters';

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
// Component
// -----------------------------------------------------------------------------

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
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

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const [newMin, newMax] = newValue as [number, number];
    setLocalValue([newMin, newMax]);
  };

  const handleSliderCommit = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const [newMin, newMax] = newValue as [number, number];
    onChange({ min: newMin, max: newMax });
  };

  const handleInputChange = (type: 'min' | 'max', inputValue: string) => {
    const numValue = parseInt(inputValue, 10) || 0;
    if (type === 'min') {
      const newMin = Math.max(min, Math.min(numValue, localValue[1]));
      setLocalValue([newMin, localValue[1]]);
      onChange({ min: newMin, max: localValue[1] });
    } else {
      const newMax = Math.min(max, Math.max(numValue, localValue[0]));
      setLocalValue([localValue[0], newMax]);
      onChange({ min: localValue[0], max: newMax });
    }
  };

  const step = Math.max(1, Math.round((max - min) / 100));

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
          valueLabelFormat={(val) => formatPrice(val, currency)}
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
          onChange={(e) => handleInputChange('min', e.target.value)}
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
          onChange={(e) => handleInputChange('max', e.target.value)}
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
        {formatPrice(localValue[0], currency)} -{' '}
        {formatPrice(localValue[1], currency)}
      </Typography>
    </Box>
  );
};

export default PriceRangeFilter;
