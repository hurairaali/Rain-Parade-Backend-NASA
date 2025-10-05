import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { QueryParams, WeatherResults, Location, APIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class APIService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any auth tokens or additional headers here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      // Server responded with error status
      return `Server Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.request) {
      // Request made but no response
      return 'Network Error: No response from server';
    } else {
      // Error in request configuration
      return `Request Error: ${error.message}`;
    }
  }

  /**
   * Fetch weather analysis for a location and query parameters
   */
  async getWeatherAnalysis(params: QueryParams): Promise<APIResponse<WeatherResults>> {
    try {
      // Backend returns WeatherResults directly, not wrapped in APIResponse
      const response = await this.client.post<WeatherResults>('/api/weather/analyze', params);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error as string,
        message: 'Failed to fetch weather analysis'
      };
    }
  }

  /**
   * Search for locations using geocoding
   */
  async searchLocations(query: string): Promise<APIResponse<Location[]>> {
    try {
      const response = await this.client.get<APIResponse<Location[]>>(`/api/location/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error as string,
        message: 'Failed to search locations'
      };
    }
  }

  /**
   * Reverse geocode coordinates to get location information
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<APIResponse<Location>> {
    try {
      const response = await this.client.get<APIResponse<Location>>(`/api/location/reverse`, {
        params: { lat: latitude, lon: longitude }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error as string,
        message: 'Failed to reverse geocode location'
      };
    }
  }

  /**
   * Get available weather data variables
   */
  async getAvailableVariables(): Promise<APIResponse<string[]>> {
    try {
      const response = await this.client.get<APIResponse<string[]>>('/api/weather/variables');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error as string,
        message: 'Failed to fetch available variables'
      };
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<APIResponse<{ status: string }>> {
    try {
      const response = await this.client.get<APIResponse<{ status: string }>>('/api/health');
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error as string,
        message: 'Backend service unavailable'
      };
    }
  }
}

// Export singleton instance
export const apiService = new APIService();
export default apiService;
