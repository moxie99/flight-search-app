// ============================================================================
// Price Graph Component
// Real-time updating price distribution visualization using Recharts
// ============================================================================

import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { FlightOffer } from '../../types';
import { formatPrice } from '../../utils/formatters';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface PriceGraphProps {
  flights: FlightOffer[];
  isLoading?: boolean;
  currency?: string;
}

interface PriceDataPoint {
  range: string;
  count: number;
  minPrice: number;
  maxPrice: number;
  percentage: number;
}

// -----------------------------------------------------------------------------
// Custom Tooltip
// -----------------------------------------------------------------------------

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PriceDataPoint }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        borderRadius: 2,
        minWidth: 150,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.count} flight{data.count !== 1 ? 's' : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {data.percentage.toFixed(0)}% of results
      </Typography>
    </Paper>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const PriceGraph: React.FC<PriceGraphProps> = ({
  flights,
  isLoading = false,
  currency = 'USD',
}) => {
  const theme = useTheme();

  // Generate price distribution data
  const priceData = useMemo((): PriceDataPoint[] => {
    if (flights.length === 0) return [];

    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    // Create 8 buckets for price distribution
    const bucketCount = Math.min(8, flights.length);
    const bucketSize = range / bucketCount || 1;

    const buckets: PriceDataPoint[] = Array(bucketCount)
      .fill(null)
      .map((_, i) => {
        const bucketMin = Math.round(minPrice + i * bucketSize);
        const bucketMax = Math.round(minPrice + (i + 1) * bucketSize);
        return {
          range: formatPrice(bucketMin, currency),
          count: 0,
          minPrice: bucketMin,
          maxPrice: bucketMax,
          percentage: 0,
        };
      });

    // Count flights in each bucket
    prices.forEach((price) => {
      const bucketIndex = Math.min(
        Math.floor((price - minPrice) / bucketSize),
        bucketCount - 1
      );
      if (bucketIndex >= 0 && bucketIndex < buckets.length) {
        buckets[bucketIndex].count++;
      }
    });

    // Calculate percentages
    const total = flights.length;
    buckets.forEach((bucket) => {
      bucket.percentage = (bucket.count / total) * 100;
    });

    return buckets;
  }, [flights, currency]);

  // Price statistics
  const stats = useMemo(() => {
    if (flights.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, [flights]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Paper>
    );
  }

  if (flights.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No price data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Price Distribution
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Based on {flights.length} flight{flights.length !== 1 ? 's' : ''}
      </Typography>

      {/* Chart */}
      <Box sx={{ width: '100%', height: 200, minWidth: 0, position: 'relative' }}>
        {priceData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart
              data={priceData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.divider}
            />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: theme.palette.text.secondary,
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: theme.palette.text.secondary,
              }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: alpha(theme.palette.primary.main, 0.1) }} />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            >
              {priceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.minPrice === stats.min
                      ? theme.palette.success.main
                      : alpha(theme.palette.primary.main, 0.7 - index * 0.05)
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        )}
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Lowest
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            color="success.main"
          >
            {formatPrice(stats.min, currency)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Average
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {formatPrice(stats.avg, currency)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Highest
          </Typography>
          <Typography variant="h6" fontWeight={600} color="text.secondary">
            {formatPrice(stats.max, currency)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PriceGraph;
