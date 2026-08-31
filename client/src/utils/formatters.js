export const formatScore = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDuration = (seconds) => {
  return `${seconds}s`;
};

export const generateShareText = (game) => {
  const scoreEmojis = game.rounds.map(r => {
    if (r.score === 1200) return '🟩';
    if (r.score === 975) return '🟩';
    if (r.score === 750) return '🟨';
    if (r.score === 525) return '🟧';
    if (r.score === 300) return '🟥';
    return '⬛';
  }).join('');
  
  return `GaanaSpot\nScore: ${formatScore(game.totalScore)}\n${scoreEmojis}\nhttps://gaanaspot.com`;
};
