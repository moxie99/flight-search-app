# ✈️ SkySearch - Flight Search Engine

A modern, responsive flight search engine built with React, TypeScript, Material UI, and TanStack React Query. This application demonstrates enterprise-grade architecture and best practices for building scalable React applications.

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

### Technical Highlights
- **Enterprise Architecture**: Clean, scalable folder structure with separation of concerns
- **TanStack React Query**: Robust data fetching with caching, retries, and stale-while-revalidate
- **Material UI**: Custom theme with polished, professional design
- **TypeScript**: Full type safety throughout the application
- **Reusable Components**: Modular, well-documented component library

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
│   │   ├── FlightList.tsx
│   │   ├── FlightCard.tsx
│   │   └── PriceGraph.tsx
│   ├── filters/            # Filter components
│   │   ├── FilterPanel.tsx
│   │   ├── StopsFilter.tsx
│   │   ├── PriceRangeFilter.tsx
│   │   └── AirlineFilter.tsx
│   └── layout/             # Layout components
│       ├── Header.tsx
│       └── HeroSection.tsx
│
├── hooks/                  # Custom React hooks
│   ├── useFlightSearch.ts  # Flight search with React Query
│   ├── useAirportSearch.ts # Airport autocomplete with debouncing
│   └── useFlightFilters.ts # Filter state management
│
├── types/                  # TypeScript type definitions
│   └── flight.types.ts     # All flight-related types
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

### State Management
- **React Query**: Server state management with optimistic updates
- **Local State**: React hooks for UI state (filters, pagination)
- **Memoization**: Optimized re-renders with useMemo and useCallback

### Filtering System
- **Real-time Updates**: Filters instantly update both list and graph
- **Multiple Filters**: Stops + Price + Airline work simultaneously
- **URL-safe**: Filter state can be serialized for sharing

### Responsive Design
- **Mobile-first**: Components adapt to screen size
- **Drawer Filters**: Mobile-friendly filter panel
- **Touch-friendly**: Proper touch targets and gestures

## 📊 Key Features Demonstrated

1. **React Proficiency**
   - Functional components with hooks
   - Custom hooks for reusable logic
   - Proper state management patterns

2. **Material UI Mastery**
   - Custom theme configuration
   - Component customization
   - Responsive breakpoints

3. **Data Table Features**
   - Pagination
   - Sorting
   - Dynamic filtering

4. **Modern JavaScript (ES6+)**
   - Destructuring and spread operators
   - Async/await patterns
   - Module imports/exports

5. **API Integration**
   - RESTful API consumption
   - Error handling
   - Loading states

6. **Clean Code Practices**
   - Type safety with TypeScript
   - Single responsibility principle
   - DRY (Don't Repeat Yourself)

7. **UX Attention to Detail**
   - Smooth animations
   - Loading skeletons
   - Error feedback
   - Consistent spacing

## 🎨 Design Decisions

- **Color Palette**: Deep blue primary (#1a365d) for trust, coral secondary (#e85d4c) for CTAs
- **Typography**: DM Sans for modern, clean readability
- **Spacing**: 8px grid system for consistent alignment
- **Animations**: Subtle transitions for polish without distraction

## 📝 License

This project is created for assessment purposes.

---

Built with ❤️ using React, TypeScript, and Material UI
