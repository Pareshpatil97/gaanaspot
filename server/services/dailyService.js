const Song = require('../models/Song');
const Game = require('../models/Game');

class DailyService {
  getTodayDateStr() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  _hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  _seededRandom(seed) {
    // Mulberry32 PRNG - much better distribution than sin-based
    let t = seed + 0x6D2B79F5;
    return () => {
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  async getDailySongs(dateStr) {
    const seed = this._hashCode(dateStr || this.getTodayDateStr());
    const random = this._seededRandom(seed);

    const activeSongs = await Song.find({ isActive: true }).exec();

    if (activeSongs.length < 5) {
      return activeSongs;
    }

    // Fisher-Yates shuffle using seeded PRNG
    const shuffled = [...activeSongs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 5);
  }

  async hasPlayedToday(userId) {
    const dateStr = this.getTodayDateStr();
    const game = await Game.findOne({ userId, mode: 'daily', date: dateStr }).exec();
    return !!game;
  }
}

module.exports = new DailyService();
