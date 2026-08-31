import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Vinyl Disc / Soundwave Musical Logo Mark */}
      <div className="relative group shrink-0">
        {/* Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Vinyl Disc Icon */}
        <div className={`${isLarge ? 'w-14 h-14' : isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-[#121614] border-2 border-emerald-400/80 flex items-center justify-center relative shadow-xl`}>
          {/* Inner Grooves */}
          <div className="w-3/4 h-3/4 rounded-full border border-white/10 flex items-center justify-center">
            {/* Center Core */}
            <div className="w-1/2 h-1/2 rounded-full bg-emerald-500 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
            </div>
          </div>
          {/* Accent note */}
          <span className="absolute -top-1 -right-1 text-emerald-300 text-xs font-black animate-pulse">
            ♪
          </span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-black tracking-tight ${isLarge ? 'text-4xl' : isSmall ? 'text-lg' : 'text-2xl'} text-white`}>
            gaana<span className="text-emerald-400">spot</span>
          </span>
          {isLarge && (
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500/90 -mt-1">
              Hindi Song Guesser
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
