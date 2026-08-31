import api from './api';

export const profileService = {
  getProfile: async () => {
    // const { data } = await api.get('/profile');
    // return data;
    return { username: 'Player1', email: 'test@test.com', memberSince: new Date() };
  },
  getStats: async () => {
    return {
      totalGames: 42,
      correctAnswers: 128,
      avgScore: 3200,
      highScore: 5400,
      currentStreak: 4,
      bestStreak: 12
    };
  },
  getRecentGames: async () => {
    return [
      { _id: 'g1', date: new Date(), score: 4500, mode: 'daily' },
      { _id: 'g2', date: new Date(Date.now() - 86400000), score: 3200, mode: 'daily' },
    ];
  },
  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    return res.data;
  }
};
