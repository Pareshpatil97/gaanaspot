import api from './api';

// Fallback song list for instantaneous search or offline/cold-start state
const FALLBACK_SONGS = [
  { _id: '1', title: 'Kesariya', movie: 'Brahmāstra', singers: ['Arijit Singh'], releaseYear: 2022 },
  { _id: '2', title: 'Tum Hi Ho', movie: 'Aashiqui 2', singers: ['Arijit Singh'], releaseYear: 2013 },
  { _id: '3', title: 'Apna Bana Le', movie: 'Bhediya', singers: ['Arijit Singh', 'Sachin-Jigar'], releaseYear: 2022 },
  { _id: '4', title: 'Chaleya', movie: 'Jawan', singers: ['Arijit Singh', 'Shilpa Rao'], releaseYear: 2023 },
  { _id: '5', title: 'Agar Tum Saath Ho', movie: 'Tamasha', singers: ['Alka Yagnik', 'Arijit Singh'], releaseYear: 2015 },
  { _id: '6', title: 'Channa Mereya', movie: 'Ae Dil Hai Mushkil', singers: ['Arijit Singh'], releaseYear: 2016 },
  { _id: '7', title: 'Kal Ho Naa Ho', movie: 'Kal Ho Naa Ho', singers: ['Sonu Nigam'], releaseYear: 2003 },
  { _id: '8', title: 'Chaiyya Chaiyya', movie: 'Dil Se..', singers: ['Sukhwinder Singh', 'Sapna Awasthi'], releaseYear: 1998 },
  { _id: '9', title: 'Tujhe Dekha Toh', movie: 'Dilwale Dulhania Le Jayenge', singers: ['Kumar Sanu', 'Lata Mangeshkar'], releaseYear: 1995 },
  { _id: '10', title: 'Kabira', movie: 'Yeh Jawaani Hai Deewani', singers: ['Tochi Raina', 'Rekha Bhardwaj'], releaseYear: 2013 },
  { _id: '11', title: 'Badtameez Dil', movie: 'Yeh Jawaani Hai Deewani', singers: ['Benny Dayal', 'Shefali Alvares'], releaseYear: 2013 },
  { _id: '12', title: 'Pasoori', movie: 'Coke Studio', singers: ['Ali Sethi', 'Shae Gill'], releaseYear: 2022 },
  { _id: '13', title: 'Naatu Naatu', movie: 'RRR', singers: ['Rahul Sipligunj', 'Kaala Bhairava'], releaseYear: 2022 },
  { _id: '14', title: 'Tere Vaaste', movie: 'Zara Hatke Zara Bachke', singers: ['Varun Jain', 'Sachin-Jigar'], releaseYear: 2023 },
  { _id: '15', title: 'Satranga', movie: 'Animal', singers: ['Arijit Singh'], releaseYear: 2023 },
  { _id: '16', title: 'Maan Meri Jaan', movie: 'Champagne Talk', singers: ['King'], releaseYear: 2022 },
  { _id: '17', title: 'Raataan Lambiyan', movie: 'Shershaah', singers: ['Jubin Nautiyal', 'Asees Kaur'], releaseYear: 2021 },
  { _id: '18', title: 'Dum Maro Dum', movie: 'Hare Rama Hare Krishna', singers: ['Asha Bhosle'], releaseYear: 1971 },
  { _id: '19', title: 'Mehbooba Mehbooba', movie: 'Sholay', singers: ['R.D. Burman'], releaseYear: 1975 },
  { _id: '20', title: 'Yeh Dosti', movie: 'Sholay', singers: ['Kishore Kumar', 'Manna Dey'], releaseYear: 1975 }
];

export const songService = {
  getSongs: async (filters = {}) => {
    try {
      const response = await api.get('/songs', { params: filters });
      return response.data?.data || response.data || [];
    } catch (e) {
      console.warn("Failed to fetch songs list:", e);
      return [];
    }
  },
  searchSongs: async (query) => {
    if (!query || query.trim().length === 0) return [];
    try {
      const response = await api.get('/songs/search', { params: { q: query } });
      const items = response.data?.data || response.data;
      if (Array.isArray(items) && items.length > 0) {
        return items.map(s => ({
          ...s,
          singer: Array.isArray(s.singers) ? s.singers.join(', ') : (s.singer || '')
        }));
      }
    } catch (e) {
      console.warn("Search API failed, searching fallback songs:", e.message);
    }

    // Client-side fallback matching
    const qLower = query.toLowerCase().trim();
    return FALLBACK_SONGS.filter(s => 
      s.title.toLowerCase().includes(qLower) || 
      (s.movie && s.movie.toLowerCase().includes(qLower)) ||
      (s.singers && s.singers.some(singer => singer.toLowerCase().includes(qLower)))
    ).map(s => ({
      ...s,
      singer: Array.isArray(s.singers) ? s.singers.join(', ') : (s.singer || '')
    }));
  },
  getSong: async (id) => {
    try {
      const response = await api.get(`/songs/${id}`);
      return response.data?.data || response.data;
    } catch (e) {
      return null;
    }
  }
};
