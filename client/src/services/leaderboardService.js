import api from './api';

export const leaderboardService = {
  getLeaderboard: async (period = 'daily', page = 1) => {
    const { data } = await api.get(`/leaderboard/${period}`, { params: { page } });
    return data;
  },

  getMyRank: async (period = 'daily') => {
    const { data } = await api.get(`/leaderboard/${period}/me`);
    return data;
  },
};
