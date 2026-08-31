const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  avatar: { type: String },
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'alltime'], required: true },
  periodKey: { type: String, required: true },
  score: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

LeaderboardSchema.index({ period: 1, periodKey: 1, score: -1 });
LeaderboardSchema.index({ userId: 1, period: 1, periodKey: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);
