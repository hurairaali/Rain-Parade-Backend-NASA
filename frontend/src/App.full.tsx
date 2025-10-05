import { useState } from 'react';
import Header from './components/Layout/Header';
import Hero from './components/Layout/Hero';
import LocationSelection from './components/LocationSelection/LocationSelection';
import QueryInput from './components/QueryInput/QueryInput';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Layout/Footer';
import { Location, QueryParams, WeatherResults } from './types';

function App() {
  const [step, setStep] = useState<number>(0); // 0: Hero, 1: Query, 2: Results
  const [location, setLocation] = useState<Location | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams | null>(null);
  const [results, setResults] = useState<WeatherResults | null>(null);

  const handleLocationSelect = (locationData: Location) => {
    setLocation(locationData);
  };

  const handleQuerySubmit = async (params: QueryParams) => {
    setQueryParams(params);
    // TODO: Call API to get results
    // For now, move to results step
    setStep(2);
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
              
              {location && (
                <QueryInput 
                  location={location}
                  onSubmit={handleQuerySubmit}
                />
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