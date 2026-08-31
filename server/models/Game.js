const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  mode: { type: String, enum: ['daily', 'practice', 'challenge'], required: true },
  date: { type: String, index: true },
  challengeCode: { type: String },
  rounds: [{
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    attempts: { type: Number, default: 0 },
    guesses: [{ type: String }],
    correct: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    guessedAtDuration: { type: Number }
  }],
  totalScore: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

GameSchema.index({ userId: 1, mode: 1, date: 1 });

module.exports = mongoose.model('Game', GameSchema);
