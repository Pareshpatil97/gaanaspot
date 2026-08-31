const express = require('express');
const router = express.Router();
const { createChallenge, getChallenge, joinChallenge, completeChallenge } = require('../controllers/challengeController');
const { optionalAuth } = require('../middleware/auth');

// Challenge routes — no login required
router.post('/', optionalAuth, createChallenge);
router.get('/:code', getChallenge);
router.post('/:code/join', optionalAuth, joinChallenge);
router.post('/:code/complete', optionalAuth, completeChallenge);

module.exports = router;
