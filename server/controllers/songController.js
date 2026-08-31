const Song = require('../models/Song');

const getSongs = async (req, res, next) => {
  try {
    const { genre, decade, difficulty, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (genre) query.genre = genre;
    if (decade) query.decade = decade;
    if (difficulty) query.difficulty = difficulty;
    
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const songs = await Song.find(query)
      .select('-audioPreviewUrl') // hide audio URL in list
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Song.countDocuments(query);

    res.json({
      success: true,
      data: songs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song || !song.isActive) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    res.json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
};

const searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const songs = await Song.find({
      isActive: true,
      title: { $regex: new RegExp(q, 'i') }
    }).select('title movie singers artists releaseYear difficulty _id').limit(10);

    res.json({ success: true, data: songs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSongs,
  getSong,
  searchSongs
};
