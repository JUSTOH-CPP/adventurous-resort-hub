
import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative w-14 h-14 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-yellow-700 group-hover:from-green-500 group-hover:to-yellow-600 transition-colors duration-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Stylized savanna and acacia tree logo */}
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg">
            {/* Sun */}
            <circle cx="17" cy="7" r="2" fill="#ffeb3b" stroke="currentColor" strokeWidth="0.5"/>
            
            {/* Savanna */}
            <path d="M2 20L22 20L12 15L2 20Z" fill="#f9a825" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Acacia Tree */}
            <path d="M12 19V14" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 14C10 10 8 13 12 8C16 13 14 10 12 14Z" fill="#2e7d32" stroke="#2e7d32" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9C10 5 8 8 12 3C16 8 14 5 12 9Z" fill="#2e7d32" stroke="#2e7d32" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
            
            {/* Wildlife silhouette */}
            <path d="M6 19C6 17 5 18 4 17C3 16 3.5 15 4 14C4.5 13 5 14 6 14C7 14 7.5 15 7 16C6.5 17 6 17 6 19Z" fill="#6d4c41" stroke="#6d4c41" strokeWidth="0.5"/>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-display font-bold text-green-700 leading-tight group-hover:text-green-600 transition-colors duration-300">
          Maasai
        </span>
        <span className="text-xs font-medium text-yellow-600 -mt-1 group-hover:text-yellow-500 transition-colors duration-300">
          Adventures
        </span>
      </div>
    </Link>
  );
};

// Add this to maintain backward compatibility
export default Logo;
