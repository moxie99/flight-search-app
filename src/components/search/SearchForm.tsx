// ============================================================================
// Flight Search Form Component
// Complete search form with all inputs and validation
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Popover,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse,
  MenuItem,
} from '@mui/material';
import {
  SwapHoriz,
  Search,
  Person,
  Add,
  Remove,
  ExpandMore,
  ExpandLess,
  CalendarMonth,
} from '@mui/icons-material';
import { format, addDays } from 'date-fns';
import { AirportAutocomplete } from './AirportAutocomplete';
import { CABIN_CLASS_OPTIONS } from '../../config/constants';
import type { Airport, TripType, CabinClass, TravelerCount, FlightSearchParams } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  isLoading?: boolean;
}

interface FormState {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  tripType: TripType;
  travelers: TravelerCount;
  cabinClass: CabinClass;
}

// -----------------------------------------------------------------------------
// Traveler Selector Component
// -----------------------------------------------------------------------------

interface TravelerSelectorProps {
  travelers: TravelerCount;
  onChange: (travelers: TravelerCount) => void;
}

const TravelerSelector: React.FC<TravelerSelectorProps> = ({
  travelers,
  onChange,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateCount = (
    type: keyof TravelerCount,
    delta: number
  ) => {
    const newValue = travelers[type] + delta;
    const min = type === 'adults' ? 1 : 0;
    const max = 9;

    if (newValue >= min && newValue <= max) {
      onChange({ ...travelers, [type]: newValue });
    }
  };

  const totalTravelers =
    travelers.adults + travelers.children + travelers.infants;

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        fullWidth
        label="Travelers"
        value={`${totalTravelers} Traveler${totalTravelers !== 1 ? 's' : ''}`}
        onClick={handleClick}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <Person sx={{ color: 'action.active', mr: 1 }} fontSize="small" />
          ),
          endAdornment: open ? <ExpandLess /> : <ExpandMore />,
          sx: { cursor: 'pointer' },
        }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: { p: 2.5, minWidth: 280, mt: 1 },
          },
        }}
      >
        {[
          { key: 'adults' as const, label: 'Adults', subtitle: 'Age 12+' },
          { key: 'children' as const, label: 'Children', subtitle: 'Age 2-11' },
          { key: 'infants' as const, label: 'Infants', subtitle: 'Under 2' },
        ].map((item, index) => (
          <Box key={item.key}>
            {index > 0 && <Divider sx={{ my: 2 }} />}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography fontWeight={500}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.subtitle}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => updateCount(item.key, -1)}
                  disabled={
                    item.key === 'adults'
                      ? travelers[item.key] <= 1
                      : travelers[item.key] <= 0
                  }
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:disabled': { opacity: 0.3 },
                  }}
                >
                  <Remove fontSize="small" />
                </IconButton>
                <Typography
                  sx={{
                    minWidth: 32,
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  {travelers[item.key]}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updateCount(item.key, 1)}
                  disabled={travelers[item.key] >= 9}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:disabled': { opacity: 0.3 },
                  }}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </Popover>
    </>
  );
};

// -----------------------------------------------------------------------------
// Main Search Form Component
// -----------------------------------------------------------------------------

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const theme = useTheme();
  // Media query for responsive design (kept for future use)
  useMediaQuery(theme.breakpoints.down('md'));

  const [formState, setFormState] = useState<FormState>({
    origin: null,
    destination: null,
    departureDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    returnDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    tripType: 'round-trip',
    travelers: { adults: 1, children: 0, infants: 0 },
    cabinClass: 'ECONOMY',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const swapAirports = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.origin) {
      newErrors.origin = 'Please select origin';
    }
    if (!formState.destination) {
      newErrors.destination = 'Please select destination';
    }
    if (!formState.departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }
    if (
      formState.tripType === 'round-trip' &&
      !formState.returnDate
    ) {
      newErrors.returnDate = 'Please select return date';
    }
    if (
      formState.origin &&
      formState.destination &&
      formState.origin.iataCode === formState.destination.iataCode
    ) {
      newErrors.destination = 'Destination must be different from origin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const params: FlightSearchParams = {
      originLocationCode: formState.origin!.iataCode,
      destinationLocationCode: formState.destination!.iataCode,
      departureDate: formState.departureDate,
      returnDate:
        formState.tripType === 'round-trip'
          ? formState.returnDate
          : undefined,
      adults: formState.travelers.adults,
      children: formState.travelers.children || undefined,
      infants: formState.travelers.infants || undefined,
      travelClass: formState.cabinClass,
      currencyCode: 'USD',
      max: 50,
    };

    onSearch(params);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Trip Type Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={formState.tripType}
          exclusive
          onChange={(_, value) => value && updateField('tripType', value)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 3,
              py: 1,
              borderRadius: '8px !important',
              border: 'none',
              backgroundColor: 'grey.100',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="round-trip">Round Trip</ToggleButton>
          <ToggleButton value="one-way">One Way</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Search Fields */}
      <Grid container spacing={2} alignItems="flex-start">
        {/* Origin */}
        <Grid size={{ xs: 12, md: 3 }}>
          <AirportAutocomplete
            label="From"
            placeholder="City or airport"
            value={formState.origin}
            onChange={(airport) => updateField('origin', airport)}
            type="origin"
            error={!!errors.origin}
            helperText={errors.origin}
          />
        </Grid>

        {/* Swap Button */}
        <Grid
          size={{ xs: 12, md: 'auto' }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            pt: { md: 1 },
          }}
        >
          <IconButton
            onClick={swapAirports}
            disabled={!formState.origin && !formState.destination}
            sx={{
              backgroundColor: 'grey.100',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'rotate(180deg)',
              },
              '&:active': {
                transform: 'rotate(180deg) scale(0.95)',
              },
            }}
          >
            <SwapHoriz />
          </IconButton>
        </Grid>

        {/* Destination */}
        <Grid size={{ xs: 12, md: 3 }}>
          <AirportAutocomplete
            label="To"
            placeholder="City or airport"
            value={formState.destination}
            onChange={(airport) => updateField('destination', airport)}
            type="destination"
            error={!!errors.destination}
            helperText={errors.destination}
          />
        </Grid>

        {/* Departure Date */}
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Departure"
            type="date"
            value={formState.departureDate}
            onChange={(e) => updateField('departureDate', e.target.value)}
            error={!!errors.departureDate}
            helperText={errors.departureDate}
            InputProps={{
              startAdornment: (
                <CalendarMonth
                  sx={{ color: 'action.active', mr: 1 }}
                  fontSize="small"
                />
              ),
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: format(new Date(), 'yyyy-MM-dd'),
            }}
          />
        </Grid>

        {/* Return Date */}
        <Grid size={{ xs: 6, md: 2 }}>
          <TextField
            fullWidth
            label="Return"
            type="date"
            value={formState.returnDate}
            onChange={(e) => updateField('returnDate', e.target.value)}
            disabled={formState.tripType === 'one-way'}
            error={!!errors.returnDate}
            helperText={errors.returnDate}
            InputProps={{
              startAdornment: (
                <CalendarMonth
                  sx={{
                    color:
                      formState.tripType === 'one-way'
                        ? 'action.disabled'
                        : 'action.active',
                    mr: 1,
                  }}
                  fontSize="small"
                />
              ),
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: formState.departureDate,
            }}
          />
        </Grid>
      </Grid>

      {/* Advanced Options */}
      <Box sx={{ mt: 2 }}>
        <Button
          size="small"
          onClick={() => setShowAdvanced(!showAdvanced)}
          endIcon={showAdvanced ? <ExpandLess /> : <ExpandMore />}
          sx={{ color: 'text.secondary' }}
        >
          {showAdvanced ? 'Less options' : 'More options'}
        </Button>
      </Box>

      <Collapse in={showAdvanced}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TravelerSelector
              travelers={formState.travelers}
              onChange={(travelers) => updateField('travelers', travelers)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              select
              label="Cabin Class"
              value={formState.cabinClass}
              onChange={(e) =>
                updateField('cabinClass', e.target.value as CabinClass)
              }
            >
              {CABIN_CLASS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Collapse>

      {/* Search Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          startIcon={<Search />}
          sx={{
            minWidth: { xs: '100%', sm: 200 },
            py: 1.5,
            fontSize: '1rem',
          }}
        >
          {isLoading ? 'Searching...' : 'Search Flights'}
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchForm;
