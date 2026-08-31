import React from 'react';

const ProgressBar = ({ total, current, results }) => {
  return (
    <div className="flex gap-2 w-full max-w-lg mx-auto mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const result = results[i];
        let bgColor = 'bg-surface border-border';
        let isCurrent = i === current;

        if (result) {
          if (result.status === 'correct') bgColor = 'bg-success border-success shadow-[0_0_10px_rgba(16,185,129,0.5)]';
          else if (result.status === 'missed') bgColor = 'bg-error border-error shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        } else if (isCurrent) {
          bgColor = 'bg-surface border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]';
        }

        return (
          <div key={i} className="flex-1 flex flex-col gap-1 items-center">
            <div className={`h-2 w-full rounded-full border transition-all duration-300 ${bgColor} ${isCurrent ? 'animate-pulse' : ''}`} />
            {result && result.score > 0 && (
              <span className="text-[10px] font-bold text-success">+{result.score}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
