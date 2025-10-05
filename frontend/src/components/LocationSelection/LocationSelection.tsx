import { useState } from 'react';
import MapComponent from './MapComponent';
import SearchBox from './SearchBox';
import type { LocationSelectionProps, Location } from '../../types';
import { MapPin, Layers } from 'lucide-react';

const LocationSelection: React.FC<LocationSelectionProps> = ({ onLocationSelect, selectedLocation }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mode, setMode] = useState<'pin' | 'draw'>('pin');

  const handleSearch = (location: Location) => {
    onLocationSelect(location);
  };

  const handleMapClick = (location: Location) => {
    onLocationSelect(location);
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Select Location</h3>
          <p className="text-gray-400 text-sm">
            Search for a place, drop a pin, or draw a boundary on the map
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setMode('pin')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              mode === 'pin' 
                ? 'bg-nasa-blue text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Pin</span>
          </button>
          <button
            onClick={() => setMode('draw')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              mode === 'draw' 
                ? 'bg-nasa-blue text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">Draw Area</span>
          </button>
        </div>
      </div>

      <SearchBox 
        value={searchQuery}
        onChange={setSearchQuery}
        onSelect={handleSearch}
      />

      <div className="relative">
        <MapComponent 
          mode={mode}
          selectedLocation={selectedLocation}
          onLocationSelect={handleMapClick}
        />
        
        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 glass-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Selected Location</p>
                <p className="text-white font-semibold">
                  {selectedLocation.name || selectedLocation.address || 'Custom Location'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                </p>
              </div>
              <MapPin className="w-5 h-5 text-nasa-blue" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelection;
