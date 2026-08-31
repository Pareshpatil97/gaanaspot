const Song = require('../models/Song');
const Game = require('../models/Game');

class DailyService {
  getTodayDateStr() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async getDailySongs() {
    const activeSongs = await Song.find({ isActive: true }).exec();

    if (activeSongs.length < 5) {
      return activeSongs;
    }

    // Pure Fisher-Yates shuffle with Math.random() for fresh new songs every game session
    const shuffled = [...activeSongs];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 5);
  }

  async hasPlayedToday(userId) {
    if (!userId) return false;
    const dateStr = this.getTodayDateStr();
    const game = await Game.findOne({ userId, mode: 'daily', date: dateStr }).exec();
    return !!game;
  }
}

module.exports = new DailyService();
