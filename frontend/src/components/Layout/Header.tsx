import { Cloud, CloudRain, Home } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={showReset ? onReset : undefined}
            role="button"
            tabIndex={showReset ? 0 : -1}
            aria-label="Go to home"
          >
            <div className="relative">
              <CloudRain className="w-8 h-8 text-nasa-blue group-hover:text-blue-400 transition-colors" />
              <Cloud className="w-4 h-4 text-blue-300 absolute -top-1 -right-1 animate-float" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white group-hover:text-gradient transition-all">
                Rain Parade
              </h1>
              <p className="text-xs text-gray-400">NASA Space Apps 2025</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-6">
            {showReset && (
              <button 
                onClick={onReset}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                aria-label="Return to home"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
            
            <a 
              href="https://www.spaceappschallenge.org/2025/challenges/will-it-rain-on-my-parade/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg bg-nasa-blue/20 border border-nasa-blue/50 text-blue-200 hover:bg-nasa-blue/30 transition-all"
            >
              Challenge Details
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

