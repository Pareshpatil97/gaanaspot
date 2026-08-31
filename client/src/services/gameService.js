import api from './api';

const FALLBACK_SONG_POOL = [
  { _id: 's1', title: 'Kesariya', movie: 'Brahmāstra', singers: ['Arijit Singh'], releaseYear: 2022, audioUrl: '' },
  { _id: 's2', title: 'Tum Hi Ho', movie: 'Aashiqui 2', singers: ['Arijit Singh'], releaseYear: 2013, audioUrl: '' },
  { _id: 's3', title: 'Channa Mereya', movie: 'Ae Dil Hai Mushkil', singers: ['Arijit Singh'], releaseYear: 2016, audioUrl: '' },
  { _id: 's4', title: 'Kal Ho Naa Ho', movie: 'Kal Ho Naa Ho', singers: ['Sonu Nigam'], releaseYear: 2003, audioUrl: '' },
  { _id: 's5', title: 'Chaiyya Chaiyya', movie: 'Dil Se..', singers: ['Sukhwinder Singh'], releaseYear: 1998, audioUrl: '' },
  { _id: 's6', title: 'Apna Bana Le', movie: 'Bhediya', singers: ['Arijit Singh'], releaseYear: 2022, audioUrl: '' },
  { _id: 's7', title: 'Chaleya', movie: 'Jawan', singers: ['Arijit Singh'], releaseYear: 2023, audioUrl: '' },
  { _id: 's8', title: 'Satranga', movie: 'Animal', singers: ['Arijit Singh'], releaseYear: 2023, audioUrl: '' },
  { _id: 's9', title: 'Tere Vaaste', movie: 'Zara Hatke Zara Bachke', singers: ['Varun Jain'], releaseYear: 2023, audioUrl: '' },
  { _id: 's10', title: 'Kabira', movie: 'Yeh Jawaani Hai Deewani', singers: ['Tochi Raina'], releaseYear: 2013, audioUrl: '' },
  { _id: 's11', title: 'Tujhe Dekha Toh', movie: 'DDLJ', singers: ['Kumar Sanu'], releaseYear: 1995, audioUrl: '' },
  { _id: 's12', title: 'Yeh Dosti', movie: 'Sholay', singers: ['Kishore Kumar'], releaseYear: 1975, audioUrl: '' }
];

const getRandomRounds = () => {
  const shuffled = [...FALLBACK_SONG_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 5).map(song => ({ song, status: 'pending' }));
};

export const gameService = {
  startGame: async (mode = 'daily', options = {}) => {
    try {
      const response = await api.post('/game/start', { mode, options });
      const gameData = response.data?.data || response.data;
      if (gameData && gameData.rounds) {
        return gameData;
      }
    } catch (e) {
      console.warn('Game start API failed or cold starting, using randomized fallback:', e.message);
    }

    return {
      _id: `game_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      mode,
      rounds: getRandomRounds(),
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
