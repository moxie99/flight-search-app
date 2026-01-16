// ============================================================================
// Amadeus API Client
// Enterprise-grade HTTP client with token management and error handling
// ============================================================================

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/constants';
import type {
  AmadeusTokenResponse,
  AmadeusFlightSearchResponse,
  AmadeusAirportSearchResponse,
  FlightSearchParams,
} from '../types';

// -----------------------------------------------------------------------------
// Token Management
// -----------------------------------------------------------------------------

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

const isTokenValid = (): boolean => {
  if (!tokenCache) return false;
  // Add 60 second buffer before expiry
  return Date.now() < tokenCache.expiresAt - 60000;
};

const getAccessToken = async (): Promise<string> => {
  if (isTokenValid() && tokenCache) {
    return tokenCache.accessToken;
  }

  const { AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, AMADEUS_AUTH_URL } = API_CONFIG;

  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
    throw new Error(
      'Amadeus API credentials not configured. Please set VITE_AMADEUS_CLIENT_ID and VITE_AMADEUS_CLIENT_SECRET environment variables.'
    );
  }

  try {
    const response = await axios.post<AmadeusTokenResponse>(
      AMADEUS_AUTH_URL,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    tokenCache = {
      accessToken: response.data.access_token,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };

    return tokenCache.accessToken;
  } catch (error) {
    console.error('Failed to obtain Amadeus access token:', error);
    throw new Error('Authentication failed. Please check your API credentials.');
  }
};

// -----------------------------------------------------------------------------
// Axios Instance with Interceptors
// -----------------------------------------------------------------------------

const createAmadeusClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.AMADEUS_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle token expiration - retry once with fresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        tokenCache = null; // Clear cached token
        const token = await getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      }

      // Transform error for better error messages
      const errorMessage = extractErrorMessage(error);
      return Promise.reject(new Error(errorMessage));
    }
  );

  return client;
};

const extractErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as { errors?: Array<{ detail?: string; title?: string }> };
    if (data.errors?.[0]) {
      return data.errors[0].detail || data.errors[0].title || 'An API error occurred';
    }
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// -----------------------------------------------------------------------------
// API Client Instance
// -----------------------------------------------------------------------------

export const amadeusClient = createAmadeusClient();

// -----------------------------------------------------------------------------
// API Methods
// -----------------------------------------------------------------------------

export const amadeusApi = {
  /**
   * Search for flight offers
   */
  searchFlights: async (params: FlightSearchParams): Promise<AmadeusFlightSearchResponse> => {
    const response = await amadeusClient.get<AmadeusFlightSearchResponse>(
      '/v2/shopping/flight-offers',
      {
        params: {
          originLocationCode: params.originLocationCode,
          destinationLocationCode: params.destinationLocationCode,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          travelClass: params.travelClass,
          nonStop: params.nonStop,
          currencyCode: params.currencyCode || 'USD',
          max: params.max || 50,
        },
      }
    );
    return response.data;
  },

  /**
   * Search for airports/cities by keyword
   */
  searchAirports: async (keyword: string): Promise<AmadeusAirportSearchResponse> => {
    if (!keyword || keyword.length < 2) {
      return { meta: { count: 0, links: { self: '' } }, data: [] };
    }

    const response = await amadeusClient.get<AmadeusAirportSearchResponse>(
      '/v1/reference-data/locations',
      {
        params: {
          subType: 'AIRPORT,CITY',
          keyword: keyword.toUpperCase(),
          'page[limit]': 10,
          sort: 'analytics.travelers.score',
          view: 'LIGHT',
        },
      }
    );
    return response.data;
  },

  /**
   * Get airport details by IATA code
   */
  getAirportByCode: async (iataCode: string): Promise<AmadeusAirportSearchResponse> => {
    const response = await amadeusClient.get<AmadeusAirportSearchResponse>(
      `/v1/reference-data/locations/${iataCode}`,
      {
        params: {
          subType: 'AIRPORT',
        },
      }
    );
    return response.data;
  },
};

export default amadeusApi;
