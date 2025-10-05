import axios from 'axios';
import type { Location } from '../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_API_BASE = 'https://api.mapbox.com';

export interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
  context?: Array<{ id: string; text: string }>;
}

/**
 * Search for locations using Mapbox Geocoding API
 */
export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.YOUR_MAPBOX_TOKEN_HERE') {
    console.warn('Mapbox token not configured');
    return [];
  }

  try {
    const response = await axios.get(
      `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          limit: 5,
          types: 'place,locality,neighborhood,address'
        }
      }
    );

    return response.data.features.map((feature: MapboxFeature) => ({
      latitude: feature.center[1],
      longitude: feature.center[0],
      name: feature.place_name.split(',')[0],
      address: feature.place_name,
      bounds: feature.bbox ? {
        north: feature.bbox[3],
        south: feature.bbox[1],
        east: feature.bbox[2],
        west: feature.bbox[0]
      } : undefined
    }));
  } catch (error) {
    console.error('Mapbox geocoding error:', error);
    return [];
  }
};

/**
 * Reverse geocode coordinates to get location information
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<Location | null> => {
  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.YOUR_MAPBOX_TOKEN_HERE') {
    console.warn('Mapbox token not configured');
    return null;
  }

  try {
    const response = await axios.get(
      `${MAPBOX_API_BASE}/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
      {
        params: {
          access_token: MAPBOX_TOKEN,
          limit: 1
        }
      }
    );

    if (response.data.features.length === 0) {
      return null;
    }

    const feature = response.data.features[0];
    return {
      latitude,
      longitude,
      name: feature.place_name.split(',')[0],
      address: feature.place_name
    };
  } catch (error) {
    console.error('Mapbox reverse geocoding error:', error);
    return null;
  }
};
