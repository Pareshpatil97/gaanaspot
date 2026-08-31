import React, { useEffect, useState } from 'react';
import { Play, Pause, Loader2, RotateCcw } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

const AudioPlayer = ({ audioUrl, maxDuration, onPlayComplete }) => {
  const { loadAudio, playClip, pause, stop, isPlaying, currentTime, isLoading } = useAudio();
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    loadAudio(audioUrl);
    setHasPlayed(false);
  }, [audioUrl, loadAudio]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      setHasPlayed(true);
      playClip(maxDuration);
    }
  };

  const handleRestart = () => {
    stop();
    setTimeout(() => {
      playClip(maxDuration);
    }, 50);
  };

  const progress = Math.min((currentTime / maxDuration) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-6 w-full select-none">
      <div className="relative flex items-center justify-center">
        {/* Restart button if already played partially */}
        {currentTime > 0 && !isPlaying && (
          <button
            onClick={handleRestart}
            title="Replay from start"
            className="absolute -left-14 p-3 rounded-full bg-surface border border-white/10 text-text-secondary hover:text-white hover:bg-surface-hover transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}

        {/* Main Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${
            isLoading 
              ? 'bg-surface-hover cursor-not-allowed' 
              : isPlaying
                ? 'bg-gradient-to-r from-primary to-secondary shadow-2xl shadow-primary/40 scale-105'
                : 'bg-primary hover:bg-primary-hover hover:scale-105 shadow-xl shadow-primary/20'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-9 h-9 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-9 h-9 text-white fill-white" />
          ) : (
            <Play className="w-9 h-9 text-white fill-white ml-1.5" />
          )}
        </button>
        
        {/* Animated outer glowing ring when playing */}
        {isPlaying && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/80 animate-ping opacity-60 pointer-events-none"></div>
            <div className="absolute -inset-3 rounded-full border border-secondary/40 animate-pulse pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Dynamic Instruction / Status Text */}
      <div className="text-center">
        {isPlaying ? (
          <p className="text-primary font-semibold text-sm animate-pulse">
            🎵 Listening... ({currentTime.toFixed(1)}s / {maxDuration}s)
          </p>
        ) : hasPlayed ? (
          <p className="text-text-muted text-sm">
            Tap button to resume or replay clip
          </p>
        ) : (
          <p className="text-text-muted text-sm">
            ▶ Tap to listen to the {maxDuration}s clip
          </p>
        )}
      </div>

      {/* Progress Bar & Timers */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-xs font-semibold text-text-secondary">
          <span className={isPlaying ? 'text-primary font-bold' : ''}>{currentTime.toFixed(1)}s</span>
          <span className="text-text-muted">{maxDuration}s limit</span>
        </div>
        
        <div className="h-3 w-full bg-surface-hover/80 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
