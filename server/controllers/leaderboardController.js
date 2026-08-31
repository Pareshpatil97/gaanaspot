const leaderboardService = require('../services/leaderboardService');
const { getWeekKey, getMonthKey, formatDate } = require('../utils/helpers');

const getLeaderboard = async (req, res, next) => {
  try {
    const { period } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const date = new Date();
    let periodKey;
    switch(period) {
      case 'daily': periodKey = formatDate(date); break;
      case 'weekly': periodKey = getWeekKey(date); break;
      case 'monthly': periodKey = getMonthKey(date); break;
      case 'alltime': periodKey = 'alltime'; break;
      default: return res.status(400).json({ success: false, message: 'Invalid period' });
    }

    const entries = await leaderboardService.getLeaderboard(period, periodKey, parseInt(page), parseInt(limit));
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
};

const getMyRank = async (req, res, next) => {
  try {
    const { period } = req.params;
    
    const date = new Date();
    let periodKey;
    switch(period) {
      case 'daily': periodKey = formatDate(date); break;
      case 'weekly': periodKey = getWeekKey(date); break;
      case 'monthly': periodKey = getMonthKey(date); break;
      case 'alltime': periodKey = 'alltime'; break;
      default: return res.status(400).json({ success: false, message: 'Invalid period' });
    }

    const rank = await leaderboardService.getUserRank(req.user._id, period, periodKey);
    res.json({ success: true, data: rank });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
  getMyRank
};
