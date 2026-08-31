import api from './api';

export const gameService = {
  startGame: async (mode, options = {}) => {
    // MOCK FOR NOW to allow UI testing
    return {
      _id: `game_${Date.now()}`,
      mode,
      rounds: [
        { song: { _id: 's1', title: 'Tum Hi Ho', movie: 'Aashiqui 2', audioUrl: 'https://example.com/audio1.mp3', artist: 'Arijit Singh' }, status: 'pending' },
        { song: { _id: 's2', title: 'Chaiyya Chaiyya', movie: 'Dil Se', audioUrl: 'https://example.com/audio2.mp3', artist: 'Sukhwinder Singh' }, status: 'pending' },
        { song: { _id: 's3', title: 'Kabira', movie: 'Yeh Jawaani Hai Deewani', audioUrl: 'https://example.com/audio3.mp3', artist: 'Tochi Raina, Rekha Bhardwaj' }, status: 'pending' },
        { song: { _id: 's4', title: 'Kal Ho Naa Ho', movie: 'Kal Ho Naa Ho', audioUrl: 'https://example.com/audio4.mp3', artist: 'Sonu Nigam' }, status: 'pending' },
        { song: { _id: 's5', title: 'Agar Tum Saath Ho', movie: 'Tamasha', audioUrl: 'https://example.com/audio5.mp3', artist: 'Alka Yagnik, Arijit Singh' }, status: 'pending' },
      ],
      currentRound: 0,
      totalScore: 0,
      isComplete: false
    };
    /*
    const { data } = await api.post('/games', { mode, ...options });
    return data;
    */
  },
  submitGuess: async (gameId, roundIndex, answerId) => {
    // const { data } = await api.post(`/games/${gameId}/guess`, { roundIndex, answerId });
    // return data;
    return { correct: Math.random() > 0.5 };
  },
  skipRound: async (gameId, roundIndex) => {
    // const { data } = await api.post(`/games/${gameId}/skip`, { roundIndex });
    // return data;
    return { success: true };
  },
  completeGame: async (gameId) => {
    // const { data } = await api.post(`/games/${gameId}/complete`);
    // return data;
    return { success: true };
  },
  getDaily: async () => {
    // const { data } = await api.get('/games/daily');
    // return data;
    return { played: false };
  },
  getGameState: async (gameId) => {
    const { data } = await api.get(`/games/${gameId}`);
    return data;
  }
};
