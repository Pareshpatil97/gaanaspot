const express = require('express');
const router = express.Router();
const { getSongs, getSong, searchSongs } = require('../controllers/songController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getSongs);
router.get('/search', searchSongs);
router.get('/:id', getSong);

module.exports = router;
