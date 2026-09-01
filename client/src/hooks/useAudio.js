import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const maxDurationRef = useRef(0.1);
  const audioContextRef = useRef(null);
  const startOffsetRef = useRef(0);

  // Stop / Pause playback and always reset to beginning
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = startOffsetRef.current || 0;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  // Load a new audio URL
  const loadAudio = useCallback((url) => {
    stop();
    setIsLoading(false);

    if (!url || url === '' || url === '/audio/placeholder.mp3') {
      audioRef.current = null;
      return;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.src = url;

    audio.onended = () => {
      stop();
    };

    audio.onerror = () => {
      audioRef.current = null;
    };

    audioRef.current = audio;
  }, [stop]);

  // Web Audio synth tone fallback if no mp3/aac file
  const startSynthTone = (duration) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + duration);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration);
    } catch (e) {
      console.warn('Synth tone failed', e);
    }
  };

  // Play clip always starting fresh from the beginning (0 to maxDuration)
  const playClip = useCallback(async (maxDuration, startOffset = 0) => {
    maxDurationRef.current = maxDuration;
    startOffsetRef.current = startOffset;

    if (isPlaying) {
      stop();
      return;
    }

    try {
      stop(); // Ensure clean reset
      setIsPlaying(true);
      setCurrentTime(0);

      const startTime = Date.now();

      if (audioRef.current) {
        audioRef.current.currentTime = startOffset || 0;
        await audioRef.current.play();
      } else {
        startSynthTone(maxDuration);
      }

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= maxDuration) {
          stop();
        } else {
          setCurrentTime(elapsed);
        }
      }, 25);
    } catch (err) {
      console.warn('Playback notice:', err.message);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isPlaying, stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    loadAudio,
    playClip,
    pause,
    stop,
    isPlaying,
    currentTime,
    isLoading
  };
};
