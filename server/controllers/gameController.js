const gameService = require('../services/gameService');
const dailyService = require('../services/dailyService');
const statsService = require('../services/statsService');
const leaderboardService = require('../services/leaderboardService');

const startGame = async (req, res, next) => {
  try {
    const { mode, options } = req.body;
    const userId = req.user ? req.user._id : null;
    const game = await gameService.startGame(userId, mode, options);
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const submitGuess = async (req, res, next) => {
  try {
    const { gameId, roundIndex, answer } = req.body;
    const result = await gameService.submitGuess(gameId, roundIndex, answer);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const skipRound = async (req, res, next) => {
  try {
    const { gameId, roundIndex } = req.body;
    let result;
    for (let i = 0; i < 5; i++) {
      try {
        result = await gameService.submitGuess(gameId, roundIndex, '');
        if (result.attempts >= 5 || result.correct) break;
      } catch (err) {
        break;
      }
    }
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const completeGame = async (req, res, next) => {
  try {
    const { gameId } = req.body;
    const game = await gameService.completeGame(gameId);

    // Only update stats/leaderboard if user is logged in
    if (req.user) {
      try {
        await statsService.updateStats(req.user._id, game);
        if (game.mode === 'daily') {
          await leaderboardService.updateLeaderboard(req.user._id, game.totalScore, game.date);
        } else {
          await leaderboardService.updateLeaderboard(req.user._id, game.totalScore);
        }
      } catch (statsErr) {
        console.error('Stats update error (non-fatal):', statsErr.message);
      }
    }

    res.json({ success: true, data: game });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getDaily = async (req, res, next) => {
  try {
    const date = dailyService.getTodayDateStr();
    const userId = req.user ? req.user._id : null;

    if (userId) {
      const hasPlayed = await dailyService.hasPlayedToday(userId);
      if (hasPlayed) {
        const Game = require('../models/Game');
        const game = await Game.findOne({ userId, mode: 'daily', date });
        return res.json({ success: true, data: { played: true, game: await gameService.getGameState(game) } });
      }
    }

    // Not logged in or hasn't played yet
    res.json({ success: true, data: { played: false, date } });
  } catch (error) {
    next(error);
  }
};

const getGameState = async (req, res, next) => {
  try {
    const Game = require('../models/Game');
    const query = { _id: req.params.id };
    // If logged in, verify ownership; if anonymous, just find by ID
    if (req.user) {
      query.userId = req.user._id;
    }
    const game = await Game.findOne(query);
    if (!game) return res.status(404).json({ success: false, message: 'Game not found' });

    const state = await gameService.getGameState(game);
    res.json({ success: true, data: state });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startGame,
  submitGuess,
  skipRound,
  completeGame,
  getDaily,
  getGameState
};
