import { useState, useRef, useEffect } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadAudio = (url) => {
    if (!audioRef.current) return;
    setIsLoading(true);
    audioRef.current.src = url;
    audioRef.current.load();
    audioRef.current.oncanplaythrough = () => setIsLoading(false);
  };

  const playClip = async (maxDuration) => {
    if (!audioRef.current) return;
    try {
      stop();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(true);
      await audioRef.current.play();

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        if (elapsed >= maxDuration) {
          stop();
        }
      }, 16); // ~60fps update for smooth progress bar
    } catch (err) {
      console.error('Audio playback failed:', err);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return { loadAudio, playClip, stop, isPlaying, currentTime, isLoading };
};
