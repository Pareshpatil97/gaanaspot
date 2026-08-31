const Game = require('../models/Game');
const Song = require('../models/Song');
const Challenge = require('../models/Challenge');
const dailyService = require('./dailyService');
const { matchAnswer } = require('../utils/answerMatcher');
const audioProvider = require('./audioProvider');

const SCORING_TABLE = [1200, 975, 750, 525, 300];
const DURATION_TABLE = [0.1, 0.5, 2, 8, 15];

class GameService {
  async startGame(userId, mode, options = {}) {
    let songs = [];
    let date = null;
    let challengeCode = null;

    if (mode === 'daily') {
      date = dailyService.getTodayDateStr();
      const hasPlayed = await dailyService.hasPlayedToday(userId);
      if (hasPlayed) {
        throw new Error('Already played daily game today');
      }
      songs = await dailyService.getDailySongs(date);
    } else if (mode === 'challenge') {
      const challenge = await Challenge.findOne({ code: options.challengeCode }).populate('songIds');
      if (!challenge) throw new Error('Challenge not found');
      if (challenge.expiresAt < new Date()) throw new Error('Challenge expired');
      songs = challenge.songIds;
      challengeCode = challenge.code;
    } else {
      // practice mode
      const query = { isActive: true };
      if (options.genre) query.genre = options.genre;
      if (options.decade) query.decade = options.decade;
      if (options.difficulty) query.difficulty = options.difficulty;

      const count = await Song.countDocuments(query);
      if (count < 5) {
        songs = await Song.aggregate([{ $match: { isActive: true } }, { $sample: { size: 5 } }]);
      } else {
        songs = await Song.aggregate([{ $match: query }, { $sample: { size: 5 } }]);
      }
    }

    if (songs.length < 5) {
      throw new Error('Not enough songs available to start a game');
    }

    const rounds = songs.slice(0, 5).map(song => ({
      songId: song._id,
      attempts: 0,
      guesses: [],
      correct: false,
      score: 0
    }));

    const game = new Game({
      userId,
      mode,
      date,
      challengeCode,
      rounds
    });

    await game.save();

    // Prepare response without revealing answers
    return this.getGameState(game);
  }

  async submitGuess(gameId, roundIndex, guess) {
    const game = await Game.findById(gameId).populate('rounds.songId');
    if (!game) throw new Error('Game not found');
    if (game.completed) throw new Error('Game already completed');
    
    const round = game.rounds[roundIndex];
    if (!round) throw new Error('Round not found');
    if (round.correct || round.attempts >= 5) {
      throw new Error('Round already finished');
    }

    round.attempts += 1;
    round.guesses.push(guess);

    const song = round.songId;
    const isCorrect = matchAnswer(guess, song.title, song.aliases);

    let roundOver = false;

    if (isCorrect) {
      round.correct = true;
      round.score = SCORING_TABLE[round.attempts - 1];
      round.guessedAtDuration = DURATION_TABLE[round.attempts - 1];
      roundOver = true;
    } else if (round.attempts >= 5) {
      round.score = 0;
      roundOver = true;
    }

    game.markModified('rounds');
    await game.save();

    const response = {
      correct: isCorrect,
      score: round.score,
      attempts: round.attempts,
      guessedAtDuration: round.guessedAtDuration
    };

    if (roundOver) {
      response.song = song;
    }

    return response;
  }

  async completeGame(gameId) {
    const game = await Game.findById(gameId);
    if (!game) throw new Error('Game not found');
    if (game.completed) return game;

    let totalScore = 0;
    game.rounds.forEach(round => {
      totalScore += round.score;
    });

    game.totalScore = totalScore;
    game.completed = true;
    game.completedAt = new Date();
    await game.save();
    return game;
  }

  async getGameState(game) {
    // Either pass a game model, or id
    let g = game;
    if (typeof game === 'string' || game instanceof require('mongoose').Types.ObjectId) {
      g = await Game.findById(game).populate('rounds.songId');
    } else if (!g.populated('rounds.songId')) {
      g = await Game.findById(g._id).populate('rounds.songId');
    }

    const state = g.toObject();
    state.rounds = state.rounds.map(round => {
      const isOver = round.correct || round.attempts >= 5;
      const songData = {
        _id: round.songId._id,
        audioPreviewUrl: audioProvider.getAudioUrl(round.songId)
      };

      if (isOver) {
        return {
          ...round,
          song: {
            ...round.songId,
            artworkUrl: audioProvider.getArtworkUrl(round.songId)
          }
        };
      } else {
        return {
          ...round,
          songId: songData._id,
          song: songData
        };
      }
    });

    return state;
  }
}

module.exports = new GameService();
