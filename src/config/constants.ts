// ============================================================================
// Application Constants
// ============================================================================

export const API_CONFIG = {
  AMADEUS_BASE_URL: import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com',
  AMADEUS_AUTH_URL: `${import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com'}/v1/security/oauth2/token`,
  AMADEUS_CLIENT_ID: import.meta.env.VITE_AMADEUS_CLIENT_ID || '',
  AMADEUS_CLIENT_SECRET: import.meta.env.VITE_AMADEUS_CLIENT_SECRET || '',
} as const;

export const QUERY_KEYS = {
  FLIGHTS: 'flights',
  FLIGHT_OFFERS: 'flight-offers',
  AIRPORTS: 'airports',
  AIRPORT_SEARCH: 'airport-search',
  PRICE_ANALYSIS: 'price-analysis',
  SEATMAP: 'seatmap',
} as const;

export const CACHE_TIME = {
  FLIGHTS: 1000 * 60 * 5, // 5 minutes
  AIRPORTS: 1000 * 60 * 30, // 30 minutes
  TOKEN: 1000 * 60 * 25, // 25 minutes (token expires in 30)
  SEATMAP: 1000 * 60 * 10, // 10 minutes
} as const;

export const DEFAULT_SEARCH_PARAMS = {
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: 'ECONOMY' as const,
  currencyCode: 'USD',
  max: 50,
} as const;

export const CABIN_CLASS_OPTIONS = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' },
] as const;

export const STOP_OPTIONS = [
  { value: 'non-stop', label: 'Non-stop', maxStops: 0 },
  { value: '1-stop', label: '1 Stop', maxStops: 1 },
  { value: '2+-stops', label: '2+ Stops', maxStops: 2 },
] as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// ============================================================================
// Landing Page Content
// ============================================================================

export const TRUST_STATS = [
  {
    id: 'airlines',
    value: 500,
    suffix: '+',
    label: 'Airlines',
    description: 'Partner airlines worldwide',
  },
  {
    id: 'travelers',
    value: 2,
    suffix: 'M+',
    label: 'Happy Travelers',
    description: 'Satisfied customers',
  },
  {
    id: 'destinations',
    value: 1000,
    suffix: '+',
    label: 'Destinations',
    description: 'Cities to explore',
  },
  {
    id: 'support',
    value: 24,
    suffix: '/7',
    label: 'Support',
    description: 'Always here to help',
  },
] as const;

export const POPULAR_DESTINATIONS = [
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    iataCode: 'CDG',
    price: 299,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    description: 'City of Light',
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    iataCode: 'NRT',
    price: 599,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    description: 'Where tradition meets future',
  },
  {
    id: 'new-york',
    city: 'New York',
    country: 'USA',
    iataCode: 'JFK',
    price: 199,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    description: 'The city that never sleeps',
  },
  {
    id: 'bali',
    city: 'Bali',
    country: 'Indonesia',
    iataCode: 'DPS',
    price: 449,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    description: 'Island of the Gods',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'UAE',
    iataCode: 'DXB',
    price: 399,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
    description: 'City of superlatives',
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    iataCode: 'LHR',
    price: 349,
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    description: 'Historic royal capital',
  },
] as const;

export const WHY_CHOOSE_US_FEATURES = [
  {
    id: 'best-price',
    icon: 'LocalOffer',
    title: 'Best Price Guarantee',
    description: 'Find a lower price? We\'ll match it and give you 10% off your next booking.',
  },
  {
    id: 'no-hidden-fees',
    icon: 'Visibility',
    title: 'No Hidden Fees',
    description: 'The price you see is the price you pay. Complete transparency, always.',
  },
  {
    id: 'real-time',
    icon: 'Speed',
    title: 'Real-Time Updates',
    description: 'Live price tracking and instant notifications when fares drop.',
  },
  {
    id: 'secure',
    icon: 'Security',
    title: 'Secure Booking',
    description: 'Your data is protected with bank-level encryption and security.',
  },
] as const;

export const TESTIMONIALS = [
  {
    id: 'testimonial-1',
    name: 'Sarah Mitchell',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    text: 'SpotterSearch saved me over $400 on my flight to Tokyo! The price comparison feature is incredible, and the interface is so easy to use.',
    date: '2025-12-15',
  },
  {
    id: 'testimonial-2',
    name: 'James Rodriguez',
    location: 'Miami, FL',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    text: 'I love how the filters update the price graph in real-time. It helped me find the perfect balance between price and convenience.',
    date: '2025-11-28',
  },
  {
    id: 'testimonial-3',
    name: 'Emily Chen',
    location: 'Seattle, WA',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 5,
    text: 'The best flight search engine I\'ve ever used. Clean design, fast results, and amazing customer support when I needed to change my booking.',
    date: '2025-12-02',
  },
] as const;

export const FOOTER_LINKS = {
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Blog', href: '#blog' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'FAQs', href: '#faq' },
      { label: 'Accessibility', href: '#accessibility' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Sitemap', href: '#sitemap' },
    ],
  },
  social: {
    title: 'Connect',
    links: [
      { label: 'Twitter', href: 'https://twitter.com', icon: 'Twitter' },
      { label: 'Facebook', href: 'https://facebook.com', icon: 'Facebook' },
      { label: 'Instagram', href: 'https://instagram.com', icon: 'Instagram' },
      { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'LinkedIn' },
    ],
  },
} as const;
