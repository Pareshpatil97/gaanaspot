const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const { getWeekKey, getMonthKey, formatDate } = require('../utils/helpers');

class LeaderboardService {
  async updateLeaderboard(userId, score, date) {
    const user = await User.findById(userId);
    if (!user) return;

    const d = new Date(date || Date.now());
    
    const periods = [
      { type: 'daily', key: formatDate(d) },
      { type: 'weekly', key: getWeekKey(d) },
      { type: 'monthly', key: getMonthKey(d) },
      { type: 'alltime', key: 'alltime' }
    ];

    for (let p of periods) {
      await Leaderboard.findOneAndUpdate(
        { userId, period: p.type, periodKey: p.key },
        { 
          $set: { username: user.username, avatar: user.avatar },
          $inc: { score: score, gamesPlayed: 1 },
          $max: { streak: user.stats.currentStreak },
          $currentDate: { updatedAt: true }
        },
        { upsert: true, new: true }
      );
    }
  }

  async getLeaderboard(period, periodKey, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    
    const entries = await Leaderboard.find({ period, periodKey })
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return entries.map((e, index) => ({
      ...e,
      rank: skip + index + 1
    }));
  }

  async getUserRank(userId, period, periodKey) {
    const entry = await Leaderboard.findOne({ userId, period, periodKey });
    if (!entry) return null;

    const higherCount = await Leaderboard.countDocuments({
      period,
      periodKey,
      score: { $gt: entry.score }
    });

    return {
      rank: higherCount + 1,
      score: entry.score,
      gamesPlayed: entry.gamesPlayed
    };
  }
}

module.exports = new LeaderboardService();
