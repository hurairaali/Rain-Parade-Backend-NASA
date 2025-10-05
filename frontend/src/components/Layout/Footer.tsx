import { Heart, Github, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 backdrop-blur-md bg-white/5 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for NASA Space Apps Challenge 2025</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
            
            <a 
              href="https://www.spaceappschallenge.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm">Space Apps</span>
            </a>
          </div>
        </div>
        
        <div className="text-center mt-6 pt-6 border-t border-white/5">
          <p className="text-gray-500 text-xs">
            Data provided by NASA Earth Science Division | 
            <a href="https://www.nasa.gov" className="hover:text-nasa-blue transition-colors ml-1">NASA.gov</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

