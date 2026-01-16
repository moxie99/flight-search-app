// ============================================================================
// Stops Filter Component
// Filter flights by number of stops
// ============================================================================

import React from 'react';
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
// Stop Options
// -----------------------------------------------------------------------------

const STOP_OPTIONS: { value: StopFilter; label: string; description: string }[] = [
  { value: 'non-stop', label: 'Non-stop', description: 'Direct flights only' },
  { value: '1-stop', label: '1 Stop', description: 'One connection' },
  { value: '2+-stops', label: '2+ Stops', description: 'Multiple connections' },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const StopsFilter: React.FC<StopsFilterProps> = ({
  selectedStops,
  onChange,
  disabled = false,
}) => {
  const handleChange = (stopValue: StopFilter) => {
    if (selectedStops.includes(stopValue)) {
      onChange(selectedStops.filter((s) => s !== stopValue));
    } else {
      onChange([...selectedStops, stopValue]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        Stops
      </Typography>
      <FormGroup>
        {STOP_OPTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            disabled={disabled}
            control={
              <Checkbox
                checked={selectedStops.includes(option.value)}
                onChange={() => handleChange(option.value)}
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
        ))}
      </FormGroup>
    </Box>
  );
};

export default StopsFilter;
