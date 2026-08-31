import api from './api';

export const leaderboardService = {
  getLeaderboard: async (period = 'daily') => {
    // const { data } = await api.get('/leaderboard', { params: { period } });
    // return data;
    return [
      { _id: 'u1', username: 'Rahul_M', score: 5800, avatar: '', rank: 1, streak: 5 },
      { _id: 'u2', username: 'Neha_S', score: 5400, avatar: '', rank: 2, streak: 3 },
      { _id: 'u3', username: 'Vikram45', score: 4900, avatar: '', rank: 3, streak: 12 },
    ];
  }
};

export const adminService = {
  getStats: async () => {
    return { users: 1500, songs: 450, gamesToday: 842, avgScore: 3100 };
  }
};
