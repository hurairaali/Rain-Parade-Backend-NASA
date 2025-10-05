import { CloudRain, Thermometer, Wind, Droplets, AlertTriangle, ArrowRight, Sparkles, type LucideIcon } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const features: Feature[] = [
    {
      icon: Thermometer,
      title: 'Temperature Extremes',
      description: 'Very hot or very cold conditions',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Wind,
      title: 'Wind Analysis',
      description: 'Strong wind probability',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Droplets,
      title: 'Precipitation Data',
      description: 'Rain and snow likelihood',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: AlertTriangle,
      title: 'Comfort Index',
      description: 'Uncomfortable weather alerts',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-nasa-blue/20 border border-nasa-blue/50 rounded-full mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-blue-300">Powered by NASA Earth Observation Data</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gradient">Will It Rain</span>
          <br />
          <span className="text-white">On Your Parade?</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Plan your outdoor events with confidence using historical weather data 
          from NASA's decades of Earth observation missions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button 
            onClick={onGetStarted}
            className="btn-primary flex items-center space-x-2 text-lg group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a 
            href="#features"
            className="btn-secondary flex items-center space-x-2 text-lg"
          >
            <CloudRain className="w-5 h-5" />
            <span>Learn More</span>
          </a>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
          <div className="glass-card p-4 sm:p-6 card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">40+</div>
            <div className="text-xs sm:text-sm text-gray-400">Years of Data</div>
          </div>
          <div className="glass-card p-4 sm:p-6 card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">Global</div>
            <div className="text-xs sm:text-sm text-gray-400">Coverage</div>
          </div>
          <div className="glass-card p-4 sm:p-6 card-hover">
            <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">5</div>
            <div className="text-xs sm:text-sm text-gray-400">Weather Types</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">
          What We Analyze
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card p-6 card-hover cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-white">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-nasa-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Select Location</h3>
            <p className="text-gray-400">
              Choose your destination by searching, dropping a pin, or drawing an area on the map
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Set Parameters</h3>
            <p className="text-gray-400">
              Specify your date and which weather conditions you want to analyze
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Get Insights</h3>
            <p className="text-gray-400">
              View probability charts, trends, and download detailed weather data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
