import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Location } from '../../types';

// NOTE: Add your Mapbox token in .env file as VITE_MAPBOX_TOKEN
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.YOUR_MAPBOX_TOKEN_HERE';

interface MapComponentProps {
  mode: 'pin' | 'draw';
  selectedLocation?: Location | null;
  onLocationSelect: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ mode, selectedLocation, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once

    console.log('🗺️ Initializing Mapbox GL JS...');
    console.log('Token available:', MAPBOX_TOKEN ? 'Yes' : 'No');
    console.log('Token length:', MAPBOX_TOKEN?.length);
    
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3
      });

      map.current.on('load', () => {
        console.log('✅ Map loaded successfully');
        setMapLoaded(true);
        
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add fullscreen control
        map.current?.addControl(new mapboxgl.FullscreenControl(), 'top-right');
      });

      map.current.on('error', (e) => {
        console.error('❌ Mapbox error:', e);
      });

      // Handle map clicks
      map.current.on('click', (e) => {
        if (mode === 'pin') {
          const { lng, lat } = e.lngLat;
          onLocationSelect({
            latitude: lat,
            longitude: lng,
          });
        }
      });
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
    }

    return () => {
      // Only remove map if it exists and is loaded
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker when selected location changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedLocation) return;

    // Remove existing marker
    if (marker.current) {
      marker.current.remove();
    }

    // Add new marker
    marker.current = new mapboxgl.Marker({
      color: '#0B3D91', // NASA blue
      scale: 1.2
    })
      .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
      .addTo(map.current);

    // Fly to location
    map.current.flyTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: 10,
      duration: 2000
    });
  }, [selectedLocation, mapLoaded]);

  // Handle mode changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (mode === 'draw') {
      // TODO: Implement drawing functionality using Mapbox Draw
      map.current.getCanvas().style.cursor = 'crosshair';
    } else {
      map.current.getCanvas().style.cursor = '';
    }
  }, [mode, mapLoaded]);

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-lg overflow-hidden border border-white/20"
      />
      
      {/* Mode indicator */}
      <div className="absolute top-4 left-4 glass-card px-4 py-2">
        <p className="text-sm text-white">
          {mode === 'pin' ? 'Click anywhere to drop a pin' : 'Draw a boundary area'}
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
