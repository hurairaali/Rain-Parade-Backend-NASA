import { useState } from 'react';
import Header from './components/Layout/Header';
import Hero from './components/Layout/Hero';
import LocationSelection from './components/LocationSelection/LocationSelection';
import QueryInput from './components/QueryInput/QueryInput';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Layout/Footer';
import type { Location, QueryParams, WeatherResults } from './types';
import { apiService } from './services/api';

function App() {
  const [step, setStep] = useState<number>(0); // 0: Hero, 1: Query, 2: Results
  const [location, setLocation] = useState<Location | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const [results, setResults] = useState<WeatherResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = (locationData: Location) => {
    setLocation(locationData);
  };

  const handleQuerySubmit = async (params: QueryParams) => {
    setQueryParams(params);
    setLoading(true);
    setError(null);
    
    try {
      // Call backend API to get weather analysis
      const response = await apiService.getWeatherAnalysis(params);
      
      if (response.success && response.data) {
        setResults(response.data as WeatherResults);
        setStep(2); // Move to results view
      } else {
        setError(response.error || 'Failed to fetch weather data');
        console.error('API Error:', response.error);
      }
    } catch (err) {
      setError('Network error: Unable to connect to server');
      console.error('Network Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLocation(null);
    setQueryParams(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-slate-900 to-space-purple relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-nasa-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header onReset={handleReset} showReset={step > 0} />
        
        <main className="container mx-auto px-4 py-8">
          {step === 0 && (
            <Hero onGetStarted={() => setStep(1)} />
          )}
          
          {step === 1 && (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 text-gradient">
                  Plan Your Perfect Day
                </h2>
                <p className="text-gray-300 text-lg">
                  Select your location and specify weather conditions to check
                </p>
              </div>
              
              <LocationSelection 
                onLocationSelect={handleLocationSelect}
                selectedLocation={location}
              />
              
              {location && !loading && (
                <QueryInput 
                  location={location}
                  onSubmit={handleQuerySubmit}
                />
              )}
              
              {loading && (
                <div className="glass-card p-12 text-center relative overflow-hidden">
                  {/* NASA-style animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-nasa-blue/5 via-transparent to-purple-600/5 animate-pulse"></div>
                  
                  <div className="relative z-10">
                    {/* Orbital spinner - NASA style */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      {/* Outer orbit */}
                      <div className="absolute inset-0 border-4 border-nasa-blue/30 rounded-full animate-spin-slow"></div>
                      {/* Middle orbit */}
                      <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full animate-spin-reverse"></div>
                      {/* Inner orbit */}
                      <div className="absolute inset-4 border-4 border-blue-400/30 rounded-full animate-spin-slow"></div>
                      {/* Center globe */}
                      <div className="absolute inset-8 bg-gradient-to-br from-nasa-blue to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-nasa-blue/50">
                        <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {/* Orbiting dots */}
                      <div className="absolute top-0 left-1/2 w-3 h-3 bg-nasa-blue rounded-full animate-orbit"></div>
                      <div className="absolute bottom-0 right-1/2 w-3 h-3 bg-purple-500 rounded-full animate-orbit-reverse"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 animate-pulse">
                      Analyzing Weather Data
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Fetching historical data from NASA POWER API
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <div className="w-2 h-2 bg-nasa-blue rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-nasa-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-nasa-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Processing 43 years of satellite observations
                    </p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="glass-card p-8 border-l-4 border-red-500">
                  <h3 className="text-xl font-semibold text-red-400 mb-2">
                    ⚠️ Error
                  </h3>
                  <p className="text-gray-300">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="btn-secondary mt-4"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
          
          {step === 2 && queryParams && (
            <Dashboard 
              location={location!}
              queryParams={queryParams}
              results={results}
              onNewQuery={handleReset}
            />
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;