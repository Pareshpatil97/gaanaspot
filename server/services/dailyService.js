const Song = require('../models/Song');
const Game = require('../models/Game');

class DailyService {
  getTodayDateStr() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  async getDailySongs() {
    const diffs = [1, 2, 3, 4, 5];
    const songs = [];

    for (const diff of diffs) {
      let pick = await Song.aggregate([
        { $match: { isActive: true, difficulty: diff } },
        { $sample: { size: 1 } }
      ]);

      if (!pick || pick.length === 0) {
        pick = await Song.aggregate([
          { $match: { isActive: true } },
          { $sample: { size: 1 } }
        ]);
      }

      if (pick && pick.length > 0) {
        songs.push(pick[0]);
      }
    }

    if (songs.length < 5) {
      return await Song.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 5 } }
      ]);
    }

    return songs;
  }

  async hasPlayedToday(userId) {
    if (!userId) return false;
    const dateStr = this.getTodayDateStr();
    const game = await Game.findOne({ userId, mode: 'daily', date: dateStr }).exec();
    return !!game;
  }
}

module.exports = new DailyService();
