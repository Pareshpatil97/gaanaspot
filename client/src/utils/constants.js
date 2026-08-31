export const ATTEMPT_DURATIONS = [0.1, 0.5, 2, 8, 15];
export const ATTEMPT_SCORES = [1200, 975, 750, 525, 300];
export const MAX_ATTEMPTS = 5;
export const MAX_SCORE = 6000;

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

export const DIFFICULTIES = [
  { value: 1, label: 'Easy' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hard' }
];

export const ACHIEVEMENTS = {
  FIRST_BLOOD: { emoji: '🩸', title: 'First Blood', description: 'Play your first game' },
  PERFECT_SCORE: { emoji: '👑', title: 'Perfect Pitch', description: 'Get a perfect score (6000) in a game' },
  STREAK_7: { emoji: '🔥', title: 'On Fire', description: 'Maintain a 7-day streak' },
  ONE_SECOND_WONDER: { emoji: '⚡', title: 'Lightning Fast', description: 'Guess correctly on the 0.1s attempt' },
  MUSIC_NERD: { emoji: '🤓', title: 'Music Nerd', description: 'Play 100 games' },
};
