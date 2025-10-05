import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import type { Location } from '../../types';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: Location) => void;
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, onSelect }) => {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Call backend geocoding API (OpenStreetMap Nominatim)
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${apiBaseUrl}/api/location/search?q=${encodeURIComponent(value)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        
        const results: SearchResult[] = await response.json();
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const handleSelect = (result: SearchResult) => {
    onSelect({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      address: result.address
    });
    onChange(result.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for a location..."
          className="input-field w-full pl-12 pr-12"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card divide-y divide-white/10 max-h-64 overflow-y-auto z-10">
          {suggestions.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-start space-x-3"
            >
              <MapPin className="w-5 h-5 text-nasa-blue flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-medium">{result.name}</p>
                <p className="text-sm text-gray-400">{result.address}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
