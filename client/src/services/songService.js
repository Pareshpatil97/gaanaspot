import api from './api';

export const songService = {
  getSongs: async (filters = {}) => {
    const { data } = await api.get('/songs', { params: filters });
    return data;
  },
  searchSongs: async (query) => {
    // Mocking response if backend missing
    try {
      const { data } = await api.get('/songs/search', { params: { q: query } });
      return data;
    } catch (e) {
      console.warn("Search failed, returning mock data", e);
      return [{_id: '1', title: 'Tum Hi Ho', movie: 'Aashiqui 2', singer: 'Arijit Singh', year: 2013}];
    }
  },
  getSong: async (id) => {
    const { data } = await api.get(`/songs/${id}`);
    return data;
  }
};
