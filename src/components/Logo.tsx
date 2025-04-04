
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: number;
  white?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 40, white = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`font-display font-bold text-2xl ${white ? 'text-white' : 'text-foreground'}`}
      >
        Kenyan Safari
      </div>
    </div>
  );
};

export default Logo;
