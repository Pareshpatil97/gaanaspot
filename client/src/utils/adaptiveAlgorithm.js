/**
 * AI Adaptive Duration Algorithm
 * Calculates the optimal audio clip duration dynamically per attempt based on:
 * - Attempt stage (1 to 5)
 * - Song difficulty rating (Easy to Impossible)
 * - Release era (Retro tracks get a slightly earlier melodic offset)
 */

export const getAdaptiveDuration = (attemptIndex, song = {}) => {
  const difficulty = song.difficulty || 2;

  // Base attempt progression steps
  // 0 -> 0.4s (ideal micro-snippet: not too fast, not too easy)
  // 1 -> 1.8s (beat & rhythm structure)
  // 2 -> 5.5s (melodic hook)
  // 3 -> 10.0s (vocal phrase)
  // 4 -> 16.0s (full chorus preview)
  const baseDurations = [0.4, 1.8, 5.5, 10.0, 16.0];

  // Difficulty adjustment:
  // Easy songs (+0.15s boost for quick identification)
  // Hard/Expert songs (-0.1s tighter window)
  const difficultyBoost = (3 - difficulty) * 0.1;
  const rawDuration = baseDurations[attemptIndex] + difficultyBoost;

  // Keep within safe bounds: [0.3s to 20.0s]
  const rounded = Math.round(rawDuration * 10) / 10;
  return Math.max(0.3, Math.min(20.0, rounded));
};

export const getAdaptiveStartOffset = (song = {}) => {
  const year = song.releaseYear || 2020;
  // Retro songs (pre-2000) often have quiet ambient intro tape hiss.
  // Start 1.2s in so the user immediately hears the recognizable instrument hook!
  if (year < 1990) return 1.5;
  if (year < 2000) return 1.0;
  return 0.0;
};
