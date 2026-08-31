const express = require('express');
const router = express.Router();
const { startGame, submitGuess, skipRound, completeGame, getGameState } = require('../controllers/gameController');
const { optionalAuth } = require('../middleware/auth');

// All game routes use optionalAuth — no login required
router.post('/start', optionalAuth, startGame);
router.post('/guess', optionalAuth, submitGuess);
router.post('/skip', optionalAuth, skipRound);
router.post('/complete', optionalAuth, completeGame);
router.get('/state/:id', optionalAuth, getGameState);

module.exports = router;
