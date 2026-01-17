// ============================================================================
// Stops Filter Component
// Filter flights by number of stops (optimized with memoization)
// ============================================================================

import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import type { StopFilter } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface StopsFilterProps {
  selectedStops: StopFilter[];
  onChange: (stops: StopFilter[]) => void;
  disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STOP_OPTIONS: { value: StopFilter; label: string; description: string }[] = [
  { value: 'non-stop', label: 'Non-stop', description: 'Direct flights only' },
  { value: '1-stop', label: '1 Stop', description: 'One connection' },
  { value: '2+-stops', label: '2+ Stops', description: 'Multiple connections' },
];

// -----------------------------------------------------------------------------
// Stop Checkbox Item (Memoized)
// -----------------------------------------------------------------------------

interface StopCheckboxProps {
  option: typeof STOP_OPTIONS[0];
  isSelected: boolean;
  disabled: boolean;
  onChange: (value: StopFilter) => void;
}

const StopCheckbox: React.FC<StopCheckboxProps> = React.memo(
  ({ option, isSelected, disabled, onChange }) => {
    const handleChange = useCallback(() => {
      onChange(option.value);
    }, [option.value, onChange]);

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
          <Box>
            <Typography variant="body2">{option.label}</Typography>
          </Box>
        }
        sx={{
          ml: 0,
          mb: 0.5,
          '& .MuiFormControlLabel-label': {
            flex: 1,
          },
        }}
      />
    );
  }
);

StopCheckbox.displayName = 'StopCheckbox';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const StopsFilterComponent: React.FC<StopsFilterProps> = ({
  selectedStops,
  onChange,
  disabled = false,
}) => {
  // Selected stops set for O(1) lookup
  const selectedSet = useMemo(
    () => new Set(selectedStops),
    [selectedStops]
  );

  // Memoized handler
  const handleToggle = useCallback(
    (stopValue: StopFilter) => {
      if (selectedStops.includes(stopValue)) {
        onChange(selectedStops.filter((s) => s !== stopValue));
      } else {
        onChange([...selectedStops, stopValue]);
      }
    },
    [selectedStops, onChange]
  );

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Stops
      </Typography>
      <FormGroup>
        {STOP_OPTIONS.map((option) => (
          <StopCheckbox
            key={option.value}
            option={option}
            isSelected={selectedSet.has(option.value)}
            disabled={disabled}
            onChange={handleToggle}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

// Custom comparison for memoization
const arePropsEqual = (
  prevProps: StopsFilterProps,
  nextProps: StopsFilterProps
): boolean => {
  // Compare selected stops array
  if (prevProps.selectedStops.length !== nextProps.selectedStops.length) return false;
  if (prevProps.selectedStops.some((stop, i) => stop !== nextProps.selectedStops[i])) {
    return false;
  }
  
  // Compare disabled
  return prevProps.disabled === nextProps.disabled;
};

export const StopsFilter = React.memo(StopsFilterComponent, arePropsEqual);

export default StopsFilter;
