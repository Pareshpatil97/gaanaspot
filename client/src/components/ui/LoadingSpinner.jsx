import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      {text && <p className="text-text-secondary font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
