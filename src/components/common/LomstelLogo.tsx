import React from 'react';

interface LomstelLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
}

export const LomstelLogo: React.FC<LomstelLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showTagline = false
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', title: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', title: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', title: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B3D2E]';
  const subtextColor = variant === 'light' ? 'text-[#D4A72C]' : 'text-[#536259]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Geometric Hexagon Emblem as in Brand Identity */}
      <div className={`relative ${currentSize.icon} shrink-0 drop-shadow-sm`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Hexagon Outer Badge in Lime Green */}
          <path 
            d="M50 4 L88 26 L88 74 L50 96 L12 74 L12 26 Z" 
            fill="#9EE114" 
            stroke="#87C40E" 
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner Sprout / Mushroom Cap Curving Blades */}
          <path 
            d="M50 20 C54 28 66 34 76 46 C66 48 56 46 50 36 C44 46 34 48 24 46 C34 34 46 28 50 20 Z" 
            fill="#124332" 
          />
          {/* Left Wing Curve */}
          <path 
            d="M24 46 C32 50 38 60 38 72 C32 68 26 58 24 46 Z" 
            fill="#146B4A" 
          />
          {/* Right Wing Curve */}
          <path 
            d="M76 46 C68 50 62 60 62 72 C68 68 74 58 76 46 Z" 
            fill="#146B4A" 
          />
          {/* Central Stem Leaf */}
          <path 
            d="M50 38 C54 44 56 50 50 60 C44 50 46 44 50 38 Z" 
            fill="#9EE114" 
          />
          {/* Chalice / Diamond Base Center */}
          <path 
            d="M50 62 L58 74 L50 84 L42 74 Z" 
            fill="#124332" 
            stroke="#FFFFFF" 
            strokeWidth="1.5"
          />
          <path 
            d="M50 46 L55 54 L50 62 L45 54 Z" 
            fill="#124332" 
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold tracking-tight uppercase ${textColor} ${currentSize.title} font-display`}>
          LOMSTEL <span className="font-light tracking-normal opacity-90">AGRO</span>
        </span>
        {showTagline && (
          <span className={`font-medium tracking-wide ${subtextColor} ${currentSize.sub}`}>
            Growing for a Better Tomorrow
          </span>
        )}
      </div>
    </div>
  );
};
