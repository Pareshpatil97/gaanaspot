const User = require('../models/User');
const Game = require('../models/Game');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('stats achievements');
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const getRecentGames = async (req, res, next) => {
  try {
    const games = await Game.find({ userId: req.user._id, completed: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('rounds.songId', 'title movie artworkUrl');
    res.json({ success: true, data: games });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username taken' });
      }
      user.username = username;
    }
    
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getStats,
  getRecentGames,
  updateProfile
};
