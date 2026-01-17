// ============================================================================
// SeatGrid Component
// CSS Grid-based layout for rendering aircraft seat rows
// ============================================================================

import React, { useMemo } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { Seat } from './Seat';
import type { ProcessedSeat, CabinSection } from '../../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SeatGridProps {
  cabinSection: CabinSection;
  selectedSeatNumber?: string;
  onSeatSelect?: (seat: ProcessedSeat) => void;
  seatSize?: 'small' | 'medium' | 'large';
  showPrices?: boolean;
}

interface SeatRowProps {
  rowNumber: number;
  seats: ProcessedSeat[];
  columns: string[];
  aislePositions: Set<string>;
  selectedSeatNumber?: string;
  onSeatSelect?: (seat: ProcessedSeat) => void;
  seatSize?: 'small' | 'medium' | 'large';
  showPrices?: boolean;
  isExitRow?: boolean;
}

// -----------------------------------------------------------------------------
// Aisle Position Detection
// -----------------------------------------------------------------------------

const detectAislePositions = (columns: string[]): Set<string> => {
  // Common aircraft configurations
  // 3-3 (A B C | D E F)
  // 2-2 (A B | C D)
  // 2-3-2 (A B | C D E | F G)
  // 3-3-3 (A B C | D E F | G H J)
  
  const aisles = new Set<string>();
  
  if (columns.length === 6) {
    // 3-3 configuration: aisle after C
    aisles.add('C');
  } else if (columns.length === 4) {
    // 2-2 configuration: aisle after B
    aisles.add('B');
  } else if (columns.length === 7) {
    // 2-3-2 configuration: aisle after B and E
    aisles.add('B');
    aisles.add('E');
  } else if (columns.length === 9) {
    // 3-3-3 configuration: aisle after C and F
    aisles.add('C');
    aisles.add('F');
  } else if (columns.length === 8) {
    // 2-4-2 configuration: aisle after B and F
    aisles.add('B');
    aisles.add('F');
  }
  
  return aisles;
};

// -----------------------------------------------------------------------------
// Seat Row Component
// -----------------------------------------------------------------------------

const SeatRow: React.FC<SeatRowProps> = ({
  rowNumber,
  seats,
  columns,
  aislePositions,
  selectedSeatNumber,
  onSeatSelect,
  seatSize = 'medium',
  showPrices = false,
  isExitRow = false,
}) => {
  // Create a map of column to seat for quick lookup
  const seatMap = useMemo(() => {
    const map = new Map<string, ProcessedSeat>();
    seats.forEach(seat => {
      map.set(seat.column, seat);
    });
    return map;
  }, [seats]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        py: 0.5,
        px: 1,
        position: 'relative',
        // Exit row indicator
        ...(isExitRow && {
          '&::before': {
            content: '"EXIT"',
            position: 'absolute',
            left: -45,
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            fontSize: '0.55rem',
            fontWeight: 700,
            color: 'warning.main',
            letterSpacing: '0.1em',
          },
        }),
      }}
    >
      {/* Row number label */}
      <Typography
        variant="caption"
        sx={{
          minWidth: 24,
          textAlign: 'center',
          fontWeight: 600,
          color: isExitRow ? 'warning.main' : 'text.secondary',
          fontSize: '0.7rem',
        }}
      >
        {rowNumber}
      </Typography>

      {/* Seats with aisles */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {columns.map((column, index) => {
          const seat = seatMap.get(column);
          const showAisle = aislePositions.has(column);

          return (
            <React.Fragment key={column}>
              {/* Seat or empty space */}
              {seat ? (
                <Seat
                  seat={{
                    ...seat,
                    isSelected: seat.number === selectedSeatNumber,
                  }}
                  onSelect={onSeatSelect}
                  size={seatSize}
                  showPrice={showPrices}
                />
              ) : (
                <Box
                  sx={{
                    width: seatSize === 'small' ? 28 : seatSize === 'medium' ? 36 : 44,
                    height: seatSize === 'small' ? 32 : seatSize === 'medium' ? 40 : 48,
                  }}
                />
              )}
              
              {/* Aisle indicator */}
              {showAisle && index < columns.length - 1 && (
                <Box
                  sx={{
                    width: seatSize === 'small' ? 16 : seatSize === 'medium' ? 24 : 32,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 2,
                      height: 20,
                      backgroundColor: alpha('#718096', 0.3),
                      borderRadius: 1,
                    }}
                  />
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Right row number (mirror) */}
      <Typography
        variant="caption"
        sx={{
          minWidth: 24,
          textAlign: 'center',
          fontWeight: 600,
          color: isExitRow ? 'warning.main' : 'text.secondary',
          fontSize: '0.7rem',
        }}
      >
        {rowNumber}
      </Typography>
    </Box>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const SeatGrid: React.FC<SeatGridProps> = ({
  cabinSection,
  selectedSeatNumber,
  onSeatSelect,
  seatSize = 'medium',
  showPrices = false,
}) => {
  const { seats, rows, columns } = cabinSection;
  
  // Detect aisle positions based on column configuration
  const aislePositions = useMemo(() => detectAislePositions(columns), [columns]);
  
  // Group seats by row
  const seatsByRow = useMemo(() => {
    const map = new Map<number, ProcessedSeat[]>();
    seats.forEach(seat => {
      const rowSeats = map.get(seat.row) || [];
      rowSeats.push(seat);
      map.set(seat.row, rowSeats);
    });
    return map;
  }, [seats]);
  
  // Detect exit rows
  const exitRows = useMemo(() => {
    const exitRowNumbers = new Set<number>();
    seats.forEach(seat => {
      if (seat.isExitRow) {
        exitRowNumbers.add(seat.row);
      }
    });
    return exitRowNumbers;
  }, [seats]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
      }}
    >
      {/* Column headers */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 1,
          px: 1,
        }}
      >
        {/* Spacer for row number */}
        <Box sx={{ width: 24 }} />
        
        {columns.map((column, index) => {
          const showAisle = aislePositions.has(column);
          return (
            <React.Fragment key={column}>
              <Box
                sx={{
                  width: seatSize === 'small' ? 28 : seatSize === 'medium' ? 36 : 44,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  {column}
                </Typography>
              </Box>
              
              {showAisle && index < columns.length - 1 && (
                <Box
                  sx={{
                    width: seatSize === 'small' ? 16 : seatSize === 'medium' ? 24 : 32,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Spacer for row number */}
        <Box sx={{ width: 24 }} />
      </Box>

      {/* Seat rows */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
        }}
      >
        {rows.map(rowNumber => {
          const rowSeats = seatsByRow.get(rowNumber) || [];
          const isExitRow = exitRows.has(rowNumber);
          
          return (
            <SeatRow
              key={rowNumber}
              rowNumber={rowNumber}
              seats={rowSeats}
              columns={columns}
              aislePositions={aislePositions}
              selectedSeatNumber={selectedSeatNumber}
              onSeatSelect={onSeatSelect}
              seatSize={seatSize}
              showPrices={showPrices}
              isExitRow={isExitRow}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SeatGrid;
