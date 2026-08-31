const express = require('express');
const router = express.Router();
const { createSong, updateSong, deleteSong, getStats, getUsers, getAllSongs } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const { handleValidation, songValidation } = require('../middleware/validate');

router.post('/songs', protect, adminOnly, songValidation, handleValidation, createSong);
router.put('/songs/:id', protect, adminOnly, updateSong);
router.delete('/songs/:id', protect, adminOnly, deleteSong);
router.get('/stats', protect, adminOnly, getStats);
router.get('/users', protect, adminOnly, getUsers);
router.get('/songs', protect, adminOnly, getAllSongs);

module.exports = router;
