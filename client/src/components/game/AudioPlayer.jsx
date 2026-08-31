import React, { useEffect } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';

const AudioPlayer = ({ audioUrl, maxDuration, onPlayComplete, currentAttempt = 0, totalAttempts = 5 }) => {
  const { loadAudio, playClip, pause, stop, isPlaying, currentTime, isLoading } = useAudio();

  useEffect(() => {
    loadAudio(audioUrl);
  }, [audioUrl, loadAudio]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      playClip(maxDuration);
    }
  };

  // 5 Progression steps: 0.1s, 0.5s, 2.0s, 8.0s, 15.0s
  const trackMax = 15.0;
  const currentLimitPercent = Math.min((maxDuration / trackMax) * 100, 100);
  const activePlayPercent = Math.min((currentTime / trackMax) * 100, currentLimitPercent);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto select-none my-2">
      
      {/* Songspot-style segmented timeline bar (0.1s, 0.5s, 2s, 8s, 15s) */}
      <div className="w-full relative px-2">
        {/* Background track */}
        <div className="h-5 w-full bg-[#1e2320] rounded-full overflow-hidden relative border border-white/5 flex items-center">
          
          {/* Unlocked / Allowed region (Emerald green highlighted) */}
          <div 
            className="h-full bg-[#34d399]/40 rounded-l-full relative transition-all duration-300"
            style={{ width: `${currentLimitPercent}%` }}
          >
            {/* Active Playback fill */}
            <div 
              className="h-full bg-[#10b981] rounded-l-full shadow-[0_0_12px_rgba(16,185,129,0.8)] transition-all duration-75 ease-linear"
              style={{ width: isPlaying || currentTime > 0 ? `${(activePlayPercent / currentLimitPercent) * 100}%` : '100%' }}
            />
          </div>

          {/* Segment Notches for 0.1s, 0.5s, 2s, 8s */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-black/70"
            style={{ left: `${(0.1 / trackMax) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-black/70"
            style={{ left: `${(0.5 / trackMax) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-black/70"
            style={{ left: `${(2.0 / trackMax) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-black/70"
            style={{ left: `${(8.0 / trackMax) * 100}%` }}
          />
        </div>

        {/* Marker indicator triangle pointing up at current cutoff */}
        <div 
          className="absolute -bottom-6 flex flex-col items-center -translate-x-1/2 transition-all duration-300 pointer-events-none"
          style={{ left: `${currentLimitPercent}%` }}
        >
          <span className="text-[#10b981] text-xs font-bold leading-none">▲</span>
          <span className="text-[#10b981] text-xs font-extrabold tracking-tight mt-0.5">{maxDuration}s</span>
        </div>
      </div>

      {/* Large Glowing Songspot Circular Play/Pause Button with Active Duration Indicator Badge */}
      <div className="flex items-center justify-center gap-5 mt-6 mb-2">
        <button
          onClick={handlePlayToggle}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={`w-28 h-28 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${
            isLoading 
              ? 'bg-[#181d19] cursor-not-allowed text-gray-500' 
              : isPlaying
                ? 'bg-[#10b981] shadow-[0_0_40px_rgba(16,185,129,0.7)] scale-105 text-black'
                : 'bg-[#10b981] hover:bg-[#059669] hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] text-black'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-11 h-11 text-black animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-11 h-11 fill-current" />
          ) : (
            <Play className="w-11 h-11 fill-current ml-2" />
          )}
        </button>

        {/* 15s / 8s / 2s / 0.5s / 0.1s indicator right next to button */}
        <div className="text-left">
          <span className="text-3xl font-black text-[#10b981] tracking-tight">
            {maxDuration}s
          </span>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {isPlaying ? 'Playing...' : 'Clip length'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default AudioPlayer;
