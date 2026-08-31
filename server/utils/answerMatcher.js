const normalizeAnswer = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s*\(.*?\)/g, '') // remove parenthetical notes like (From Brahmastra)
    .replace(/[^\w\s-]/g, '') // remove punctuation except hyphens
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
};

const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const matchAnswer = (userAnswer, correctTitle, aliases = [], songId = null) => {
  if (!userAnswer || !correctTitle) return false;

  // If user passed song object or ID match directly
  const userString = typeof userAnswer === 'object' ? (userAnswer.title || userAnswer.name || '') : String(userAnswer);
  if (userAnswer._id && songId && String(userAnswer._id) === String(songId)) return true;
  if (userAnswer.id && songId && String(userAnswer.id) === String(songId)) return true;

  const normUser = normalizeAnswer(userString);
  const normCorrect = normalizeAnswer(correctTitle);

  if (!normUser || !normCorrect) return false;

  // 1. Exact normalized match
  if (normUser === normCorrect) return true;

  // 2. Substring containment match (minimum 4 characters for exact substring inclusion)
  if (normUser.length >= 4 && (normCorrect.includes(normUser) || normUser.includes(normCorrect))) {
    return true;
  }

  // 3. Aliases check
  for (let alias of aliases || []) {
    const normAlias = normalizeAnswer(alias);
    if (!normAlias) continue;
    if (normUser === normAlias) return true;
    if (normUser.length >= 4 && (normAlias.includes(normUser) || normUser.includes(normAlias))) return true;
    if (levenshtein(normUser, normAlias) <= 2) return true;
  }

  // 4. Levenshtein fuzzy match <= 2 for slight typos
  if (levenshtein(normUser, normCorrect) <= 2) return true;

  return false;
};

module.exports = {
  normalizeAnswer,
  levenshtein,
  matchAnswer
};
