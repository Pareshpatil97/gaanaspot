export const ATTEMPT_DURATIONS = [0.5, 2.0, 8.0];
export const ATTEMPT_SCORES = [1000, 600, 300];
export const MAX_ATTEMPTS = 3;
export const MAX_SCORE = 5000;

export const ERAS = [
  { id: 'all', label: 'Any era' },
  { id: '2020s', label: '2020s (Latest)' },
  { id: '2010s', label: '2010s' },
  { id: '2000s', label: '2000s' },
  { id: '1990s', label: '90s' },
  { id: 'classic', label: 'Classic / Retro' }
];

export const DIFFICULTIES = [
  { id: 1, label: 'Easy', color: 'emerald', bg: 'bg-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 2, label: 'Medium', color: 'amber', bg: 'bg-amber-500/20', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]', text: 'text-amber-400', border: 'border-amber-500/40' },
  { id: 3, label: 'Hard', color: 'orange', bg: 'bg-orange-500/20', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]', text: 'text-orange-400', border: 'border-orange-500/40' },
  { id: 4, label: 'Expert', color: 'rose', bg: 'bg-rose-500/20', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]', text: 'text-rose-400', border: 'border-rose-500/40' },
  { id: 5, label: 'Impossible', color: 'purple', bg: 'bg-purple-500/20', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]', text: 'text-purple-400', border: 'border-purple-500/40' }
];

export const GENRES = [
  'Romantic', 
  'Party', 
  'Sad', 
  'Classical', 
  'Devotional', 
  'Retro', 
  'Bollywood', 
  'Indie Hindi'
];

export const DECADES = [
  '1970s', 
  '1980s', 
  '1990s', 
  '2000s', 
  '2010s', 
  '2020s'
];

export const ACHIEVEMENTS = {
  FIRST_BLOOD: { emoji: '🩸', title: 'First Blood', description: 'Play your first game' },
  PERFECT_SCORE: { emoji: '👑', title: 'Perfect Pitch', description: 'Get a perfect score in a game' },
  STREAK_7: { emoji: '🔥', title: 'On Fire', description: 'Maintain a 7-day streak' },
  QUICK_EAR: { emoji: '⚡', title: 'Super Ear', description: 'Guess correctly on the 0.5s attempt' },
  MUSIC_NERD: { emoji: '🤓', title: 'Music Nerd', description: 'Play 50 games' },
};
