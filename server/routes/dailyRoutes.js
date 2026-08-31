const express = require('express');
const router = express.Router();
const { getDaily } = require('../controllers/gameController');
const { optionalAuth } = require('../middleware/auth');

// Daily route uses optionalAuth — no login required
router.get('/', optionalAuth, getDaily);

module.exports = router;
