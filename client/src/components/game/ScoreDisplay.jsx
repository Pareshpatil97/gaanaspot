import React, { useEffect, useState } from 'react';

const ScoreDisplay = ({ score, maxScore }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = displayScore;
    const end = score;
    if (start === end) return;
    
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setDisplayScore(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">Total Score</p>
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-text-secondary drop-shadow-lg">
        {displayScore.toLocaleString()}
      </div>
      {maxScore && (
        <p className="text-text-muted text-sm mt-1">/ {maxScore.toLocaleString()}</p>
      )}
    </div>
  );
};

export default ScoreDisplay;
