# ✈️ SpotterSearch - Flight Search Engine

A modern, responsive flight search engine built with React, TypeScript, Material UI, and TanStack React Query. This application demonstrates enterprise-grade architecture and best practices for building scalable, high-performance React applications.

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![MUI](https://img.shields.io/badge/MUI-6.x-blue)
![React Query](https://img.shields.io/badge/React%20Query-5.x-red)

## 🌟 Features

### Core Functionality
- **Flight Search**: Search flights by origin, destination, dates, passengers, and cabin class
- **Real-time Price Graph**: Interactive price distribution chart using Recharts
- **Complex Filtering**: Simultaneous filters for stops, price range, and airlines
- **Responsive Design**: Fully functional on mobile and desktop devices
- **Seat Map Display**: Interactive aircraft seat selection using Amadeus Seatmap API

### Rich Data Table Features
- **Multiple View Modes**: Card view, Table view, and Compact view
- **Dynamic Columns**: Show/hide columns, column configuration menu
- **Table-Level Filtering**: Search, max price, stops, and airline filters
- **Advanced Pagination**: Page size selector (5/10/15/25/50), page navigation, results info
- **Sorting**: Multiple sort options with visual indicators
- **Responsive**: Adapts to mobile with optimized views

### Landing Page Sections
- **Trust Stats**: Animated statistics with intersection observer
- **Popular Destinations**: Featured destination cards with hover effects
- **Why Choose Us**: Feature highlights with icons
- **Testimonials**: Customer reviews with ratings
- **Newsletter Signup**: Email subscription with validation
- **Footer**: Comprehensive navigation and social links

### Technical Highlights
- **Enterprise Architecture**: Clean, scalable folder structure with separation of concerns
- **TanStack React Query**: Robust data fetching with caching, retries, and stale-while-revalidate
- **Material UI**: Custom theme with polished, professional design
- **TypeScript**: Full type safety throughout the application
- **Reusable Components**: Modular, well-documented component library
- **Performance Optimized**: Virtualization, memoization, debouncing, and context splitting

## ⚡ Performance Optimizations

### Virtualization
- **react-window v2**: Flight list uses virtualized rendering for large datasets
- **Automatic switching**: Falls back to regular rendering for small lists (<15 items)
- **Dynamic container sizing**: Adapts to viewport height

### Memoization
- **React.memo**: Components wrapped with custom comparison functions
- **useMemo**: Derived state calculations are memoized
- **useCallback**: Event handlers maintain stable references
- **Custom comparison**: Deep comparison where needed, shallow where possible

### Debounce & Throttle
- **Search inputs**: 300ms debounce on airport autocomplete
- **Price filter**: 300ms debounce on input field changes
- **Airline search**: 200ms debounce on filter search term

### Context Optimizations
- **Split contexts**: Separate state and actions contexts to minimize re-renders
- **Specialized hooks**: `useFlightState`, `useFlightActions`, `useFlightSelector`
- **Stable references**: Actions don't cause consumer re-renders

### Component Splitting
- **Lazy sections**: Landing page sections extracted for independent rendering
- **Memoized sub-components**: Filter checkboxes, flight cards, etc.
- **Derived state patterns**: Computed values instead of redundant state

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Amadeus API credentials (free test account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flight-search-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_AMADEUS_CLIENT_ID=your_client_id_here
   VITE_AMADEUS_CLIENT_SECRET=your_client_secret_here
   ```
   
   Get your free API keys at: https://developers.amadeus.com/

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── amadeus.client.ts   # Amadeus API client with auth
│   └── queryClient.ts      # React Query configuration
│
├── components/             # React components
│   ├── search/             # Search form components
│   │   ├── SearchForm.tsx
│   │   └── AirportAutocomplete.tsx
│   ├── results/            # Results display components
│   │   ├── FlightList.tsx      # Virtualized flight list
│   │   ├── FlightCard.tsx      # Memoized flight card
│   │   ├── FlightDetailsModal.tsx
│   │   └── PriceGraph.tsx
│   ├── filters/            # Filter components (all memoized)
│   │   ├── FilterPanel.tsx
│   │   ├── StopsFilter.tsx
│   │   ├── PriceRangeFilter.tsx  # With debounced inputs
│   │   └── AirlineFilter.tsx     # With debounced search
│   ├── seatmap/            # Seat selection components
│   │   ├── SeatmapView.tsx
│   │   ├── CabinLayout.tsx
│   │   ├── SeatGrid.tsx
│   │   ├── Seat.tsx
│   │   ├── SeatLegend.tsx
│   │   └── SeatDetailsPanel.tsx
│   ├── common/             # Shared components
│   │   ├── QuickFilters.tsx
│   │   ├── SearchSummary.tsx
│   │   └── LoadingOverlay.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       ├── HeroSection.tsx
│       ├── Footer.tsx
│       ├── TrustStats.tsx
│       ├── PopularDestinations.tsx
│       ├── WhyChooseUs.tsx
│       ├── Testimonials.tsx
│       └── NewsletterSignup.tsx
│
├── contexts/               # React contexts
│   └── FlightContext.tsx   # Split context for state management
│
├── hooks/                  # Custom React hooks
│   ├── useFlightSearch.ts  # Flight search with React Query
│   ├── useAirportSearch.ts # Airport autocomplete with debouncing
│   ├── useFlightFilters.ts # Filter state management
│   ├── useSeatmap.ts       # Seatmap data fetching
│   └── useOptimizations.ts # Performance utility hooks
│
├── types/                  # TypeScript type definitions
│   ├── flight.types.ts     # Flight-related types
│   └── seatmap.types.ts    # Seatmap-related types
│
├── config/                 # Configuration
│   └── constants.ts        # App constants and config
│
├── theme/                  # MUI theme
│   └── theme.ts            # Custom Material UI theme
│
├── utils/                  # Utility functions
│   └── formatters.ts       # Date, price, duration formatters
│
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Technical Implementation

### API Layer
- **Token Management**: Automatic token refresh with caching
- **Error Handling**: Comprehensive error transformation
- **Interceptors**: Request/response interceptors for auth and error handling
- **Seatmap API**: POST request with flight-offers for seat availability

### State Management
- **React Query**: Server state management with optimistic updates
- **Split Context**: Separate state and actions contexts
- **Local State**: React hooks for UI state (filters, pagination)
- **Derived State**: Computed values using useMemo

### Performance Hooks

```typescript
// Available optimization hooks
import {
  useDebounce,           // Debounce values
  useDebouncedCallback,  // Debounce callbacks
  useThrottle,           // Throttle values
  useThrottledCallback,  // Throttle callbacks
  useStableCallback,     // Stable callback references
  usePrevious,           // Track previous values
  useDeepMemo,           // Deep comparison memoization
  useIntersectionObserver, // Lazy loading
  useVirtualizedList,    // Virtualization calculations
} from './hooks';
```

### Filtering System
- **Real-time Updates**: Filters instantly update both list and graph
- **Debounced Inputs**: Price and airline search inputs are debounced
- **Multiple Filters**: Stops + Price + Airline work simultaneously
- **Memoized Components**: Each filter component is independently memoized

### Responsive Design
- **Mobile-first**: Components adapt to screen size
- **Drawer Filters**: Mobile-friendly filter panel
- **Touch-friendly**: Proper touch targets and gestures
- **Accordion Footer**: Collapsible sections on mobile

## 📊 Key Features Demonstrated

1. **React Proficiency**
   - Functional components with hooks
   - Custom hooks for reusable logic
   - Proper state management patterns
   - React.memo with custom comparison

2. **Performance Optimization**
   - Virtualized lists with react-window
   - Memoization strategies
   - Debounce/throttle patterns
   - Context splitting

3. **Material UI Mastery**
   - Custom theme configuration
   - Component customization
   - Responsive breakpoints
   - Animation transitions

4. **Rich Data Table Features**
   - Multiple view modes (Card, Table, Compact)
   - Dynamic column configuration
   - Advanced pagination with page size options
   - Table-level filtering (search, price, stops, airlines)
   - Sorting with visual indicators
   - Results count and range display
   - Responsive design with mobile optimization

5. **Modern JavaScript (ES6+)**
   - Destructuring and spread operators
   - Async/await patterns
   - Module imports/exports

6. **API Integration**
   - RESTful API consumption
   - Error handling
   - Loading states
   - Seatmap integration

7. **Clean Code Practices**
   - Type safety with TypeScript
   - Single responsibility principle
   - DRY (Don't Repeat Yourself)
   - Separation of concerns

8. **UX Attention to Detail**
   - Smooth animations
   - Loading skeletons
   - Error feedback
   - Consistent spacing
   - Graceful undefined handling

## 🎨 Design Decisions

- **Color Palette**: Deep blue primary (#1a365d) for trust, coral secondary (#e85d4c) for CTAs
- **Typography**: DM Sans for modern, clean readability
- **Spacing**: 8px grid system for consistent alignment
- **Animations**: Subtle transitions for polish without distraction
- **Code Splitting**: Vendor chunks for optimal caching (MUI, Recharts, React Query)

## 📦 Bundle Optimization

The build is optimized with manual chunk splitting:

```
dist/
├── vendor-react.js      # React core
├── vendor-mui.js        # Material UI components
├── vendor-recharts.js   # Recharts library
├── vendor-query.js      # React Query
├── vendor-utils.js      # date-fns, axios
└── index.js             # Application code
```

## 📝 License

This project is created for assessment purposes.

---

Built with ❤️ using React, TypeScript, and Material UI
