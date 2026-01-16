// ============================================================================
// Airline Filter Component
// Multi-select airline filter with flight counts
// ============================================================================

import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  InputAdornment,
  Collapse,
  Button,
} from '@mui/material';
import { Search, ExpandMore, ExpandLess } from '@mui/icons-material';

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
// Component
// -----------------------------------------------------------------------------

export const AirlineFilter: React.FC<AirlineFilterProps> = ({
  airlines,
  selectedAirlines,
  onChange,
  disabled = false,
  maxVisible = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter airlines by search term
  const filteredAirlines = airlines.filter(
    (airline) =>
      airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airline.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show limited or all airlines
  const visibleAirlines = showAll
    ? filteredAirlines
    : filteredAirlines.slice(0, maxVisible);
  const hasMore = filteredAirlines.length > maxVisible;

  const handleChange = (airlineCode: string) => {
    if (selectedAirlines.includes(airlineCode)) {
      onChange(selectedAirlines.filter((code) => code !== airlineCode));
    } else {
      onChange([...selectedAirlines, airlineCode]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAirlines.length === filteredAirlines.length) {
      onChange([]);
    } else {
      onChange(filteredAirlines.map((a) => a.code));
    }
  };

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
          onChange={(e) => setSearchTerm(e.target.value)}
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
            {selectedAirlines.length === filteredAirlines.length
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </Box>
      )}

      {/* Airline Checkboxes */}
      <FormGroup>
        {visibleAirlines.map((airline) => (
          <FormControlLabel
            key={airline.code}
            disabled={disabled}
            control={
              <Checkbox
                checked={selectedAirlines.includes(airline.code)}
                onChange={() => handleChange(airline.code)}
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
        ))}
      </FormGroup>

      {/* Show More/Less */}
      {hasMore && !searchTerm && (
        <Button
          size="small"
          onClick={() => setShowAll(!showAll)}
          endIcon={showAll ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {showAll
            ? 'Show less'
            : `Show ${filteredAirlines.length - maxVisible} more`}
        </Button>
      )}

      {/* No Results */}
      {filteredAirlines.length === 0 && searchTerm && (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          No airlines match "{searchTerm}"
        </Typography>
      )}
    </Box>
  );
};

export default AirlineFilter;
