import api from './api';

export const challengeService = {
  createChallenge: async (creatorName = 'Challenger') => {
    const { data } = await api.post('/challenge', { creatorName });
    return data;
  },

  getChallenge: async (code) => {
    const { data } = await api.get(`/challenge/${code}`);
    return data;
  },

  joinChallenge: async (code) => {
    const { data } = await api.post(`/challenge/${code}/join`);
    return data;
  },

  completeChallenge: async (code, resultData) => {
    const { data } = await api.post(`/challenge/${code}/complete`, resultData);
    return data;
  },
};
