import React, { useEffect, useState } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

const AudioPlayer = ({ audioUrl, maxDuration, onPlayComplete }) => {
  const { loadAudio, playClip, stop, isPlaying, currentTime, isLoading } = useAudio();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl);
      setHasPlayed(false);
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      playClip(maxDuration).then(() => {
        setHasPlayed(true);
        if (onPlayComplete) onPlayComplete();
      });
    }
  };

  const progress = Math.min((currentTime / maxDuration) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative">
        <button
          onClick={handlePlayPause}
          disabled={isLoading}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isLoading 
              ? 'bg-surface-hover cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-hover hover:scale-105 shadow-xl shadow-primary/20'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          )}
        </button>
        
        {/* Animated rings when playing */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>
            <div className="absolute -inset-4 rounded-full border border-primary/50 animate-pulse"></div>
          </>
        )}
      </div>

      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs font-medium text-text-secondary">
          <span>{currentTime.toFixed(1)}s</span>
          <span className="text-primary">{maxDuration}s</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
