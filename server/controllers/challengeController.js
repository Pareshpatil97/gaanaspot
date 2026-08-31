const challengeService = require('../services/challengeService');
const gameService = require('../services/gameService');

const createChallenge = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const code = await challengeService.createChallenge(userId);
    res.status(201).json({ success: true, data: { code, url: `/challenge/${code}` } });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const getChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeService.getChallenge(req.params.code);
    res.json({ success: true, data: challenge });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const joinChallenge = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const game = await gameService.startGame(userId, 'challenge', { challengeCode: req.params.code });
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const completeChallenge = async (req, res, next) => {
  try {
    const { score, rounds } = req.body;
    const userId = req.user ? req.user._id : null;
    const username = req.user ? req.user.username : 'Guest';
    const challenge = await challengeService.completeChallenge(req.params.code, userId, score, rounds, username);
    res.json({ success: true, data: challenge });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

module.exports = {
  createChallenge,
  getChallenge,
  joinChallenge,
  completeChallenge
};
