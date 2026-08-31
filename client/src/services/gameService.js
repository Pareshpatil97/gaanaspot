import api from './api';

const DEFAULT_ROUNDS = [
  { song: { _id: 's1', title: 'Kesariya', movie: 'Brahmāstra', artist: 'Arijit Singh', audioUrl: '' }, status: 'pending' },
  { song: { _id: 's2', title: 'Tum Hi Ho', movie: 'Aashiqui 2', artist: 'Arijit Singh', audioUrl: '' }, status: 'pending' },
  { song: { _id: 's3', title: 'Channa Mereya', movie: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', audioUrl: '' }, status: 'pending' },
  { song: { _id: 's4', title: 'Kal Ho Naa Ho', movie: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', audioUrl: '' }, status: 'pending' },
  { song: { _id: 's5', title: 'Chaiyya Chaiyya', movie: 'Dil Se..', artist: 'Sukhwinder Singh', audioUrl: '' }, status: 'pending' }
];

export const gameService = {
  startGame: async (mode = 'daily', options = {}) => {
    try {
      const response = await api.post('/game/start', { mode, options });
      const gameData = response.data?.data || response.data;
      if (gameData && gameData.rounds) {
        return gameData;
      }
    } catch (e) {
      console.warn('Game start API failed or cold starting, using fallback game structure:', e.message);
    }

    return {
      _id: `game_${Date.now()}`,
      mode,
      rounds: DEFAULT_ROUNDS,
      currentRound: 0,
      totalScore: 0,
      isComplete: false
    };
  },

  submitGuess: async (gameId, roundIndex, answer) => {
    try {
      const queryAnswer = typeof answer === 'string' ? answer : (answer?.title || '');
      const response = await api.post('/game/guess', { gameId, roundIndex, answer: queryAnswer });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('Submit guess API failed:', e.message);
      return null;
    }
  },

  skipRound: async (gameId, roundIndex) => {
    try {
      const response = await api.post('/game/skip', { gameId, roundIndex });
      return response.data?.data || response.data;
    } catch (e) {
      return { success: true };
    }
  },

  completeGame: async (gameId) => {
    try {
      const response = await api.post('/game/complete', { gameId });
      return response.data?.data || response.data;
    } catch (e) {
      return { success: true };
    }
  },

  getDaily: async () => {
    try {
      const response = await api.get('/daily');
      return response.data?.data || response.data;
    } catch (e) {
      return { played: false };
    }
  },

  getGameState: async (gameId) => {
    try {
      const response = await api.get(`/game/state/${gameId}`);
      return response.data?.data || response.data;
    } catch (e) {
      return null;
    }
  }
};
