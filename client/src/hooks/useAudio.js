import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadAudio = useCallback((url) => {
    // Reset state
    setIsLoading(true);
    setHasAudio(false);
    setCurrentTime(0);
    setIsPlaying(false);

    // If no URL or placeholder, use Web Audio API to generate a tone
    if (!url || url === '' || url === '/audio/placeholder.mp3') {
      setIsLoading(false);
      setHasAudio(true); // We'll generate audio on the fly
      return;
    }

    // Try loading real audio
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = url;

    audio.oncanplaythrough = () => {
      audioRef.current = audio;
      setIsLoading(false);
      setHasAudio(true);
    };

    audio.onerror = () => {
      // Failed to load — fall back to generated tone
      setIsLoading(false);
      setHasAudio(true);
      audioRef.current = null;
    };

    // Timeout — if audio doesn't load in 3 seconds, use generated tone
    setTimeout(() => {
      setIsLoading(false);
      setHasAudio(true);
    }, 3000);

    audio.load();
  }, []);

  // Generate a mystery tone using Web Audio API
  const playGeneratedTone = (duration) => {
    return new Promise((resolve) => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      // Create a mysterious/suspenseful sound
      const now = ctx.currentTime;

      // Layer 1: Low hum
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(165, now + duration);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc1.connect(gain1).connect(ctx.destination);

      // Layer 2: High shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(523, now + duration * 0.3);
      osc2.frequency.setValueAtTime(392, now + duration * 0.6);
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc2.connect(gain2).connect(ctx.destination);

      // Layer 3: Ticking rhythm
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'square';
      osc3.frequency.setValueAtTime(880, now);
      gain3.gain.setValueAtTime(0, now);
      // Create ticking effect
      for (let t = 0; t < duration; t += 0.3) {
        gain3.gain.setValueAtTime(0.03, now + t);
        gain3.gain.setValueAtTime(0, now + t + 0.05);
      }
      osc3.connect(gain3).connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
      osc3.stop(now + duration);

      setTimeout(() => {
        ctx.close();
        resolve();
      }, duration * 1000);
    });
  };

  const playClip = async (maxDuration) => {
    try {
      stop();
      setCurrentTime(0);
      setIsPlaying(true);

      const startTime = Date.now();

      if (audioRef.current && audioRef.current.src) {
        // Play real audio
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } else {
        // Play generated tone
        playGeneratedTone(maxDuration);
      }

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setCurrentTime(elapsed);
        if (elapsed >= maxDuration) {
          stop();
        }
      }, 16);

      // Auto-stop after maxDuration
      setTimeout(() => stop(), maxDuration * 1000 + 50);
    } catch (err) {
      console.error('Audio playback failed:', err);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch (e) {}
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return { loadAudio, playClip, stop, isPlaying, currentTime, isLoading, hasAudio };
};
