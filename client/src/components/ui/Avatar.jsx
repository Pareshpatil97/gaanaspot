import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-surface-hover flex items-center justify-center border border-border/50 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <User className={`text-text-muted ${size === 'xl' ? 'w-12 h-12' : size === 'lg' ? 'w-8 h-8' : 'w-1/2 h-1/2'}`} />
      )}
    </div>
  );
};

export default Avatar;
