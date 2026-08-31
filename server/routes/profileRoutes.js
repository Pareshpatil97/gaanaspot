const express = require('express');
const router = express.Router();
const { getProfile, getStats, getRecentGames, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProfile);
router.get('/stats', protect, getStats);
router.get('/recent', protect, getRecentGames);
router.put('/', protect, updateProfile);

module.exports = router;
