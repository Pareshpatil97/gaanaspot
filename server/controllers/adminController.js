const Song = require('../models/Song');
const User = require('../models/User');
const Game = require('../models/Game');

const createSong = async (req, res, next) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
};

const updateSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ success: false, message: 'Song not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGames = await Game.countDocuments();
    const totalSongs = await Song.countDocuments();
    
    const todayStr = new Date().toISOString().split('T')[0];
    const gamesToday = await Game.countDocuments({ date: todayStr });
    
    const games = await Game.find({ completed: true }).select('totalScore');
    const avgScore = games.length ? games.reduce((acc, g) => acc + g.totalScore, 0) / games.length : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalGames,
        totalSongs,
        gamesToday,
        avgScore: Math.round(avgScore)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find().select('-password').skip(skip).limit(limit).lean();
    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

const getAllSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const songs = await Song.find().skip(skip).limit(limit).lean();
    const total = await Song.countDocuments();

    res.json({
      success: true,
      data: songs,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSong,
  updateSong,
  deleteSong,
  getStats,
  getUsers,
  getAllSongs
};
