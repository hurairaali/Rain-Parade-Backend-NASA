import { useState } from 'react';
import Header from './components/Layout/Header';
import Hero from './components/Layout/Hero';
import Footer from './components/Layout/Footer';

function App() {
  const [step, setStep] = useState<number>(0);

  const handleReset = () => {
    setStep(0);
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
          <Hero onGetStarted={() => setStep(1)} />
          
          {step === 1 && (
            <div className="glass-card p-8 mt-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Coming Soon!
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Location selection and weather analysis features are being loaded...
              </p>
              <button 
                onClick={() => setStep(0)}
                className="btn-primary"
              >
                Back to Home
              </button>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;



