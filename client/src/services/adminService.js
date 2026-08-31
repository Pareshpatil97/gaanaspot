import api from './api';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  getAllSongs: async (page = 1, search = '') => {
    const { data } = await api.get('/admin/songs', { params: { page, search } });
    return data;
  },

  createSong: async (songData) => {
    const { data } = await api.post('/admin/songs', songData);
    return data;
  },

  updateSong: async (id, songData) => {
    const { data } = await api.put(`/admin/songs/${id}`, songData);
    return data;
  },

  deleteSong: async (id) => {
    const { data } = await api.delete(`/admin/songs/${id}`);
    return data;
  },

  getUsers: async (page = 1, search = '') => {
    const { data } = await api.get('/admin/users', { params: { page, search } });
    return data;
  },
};
