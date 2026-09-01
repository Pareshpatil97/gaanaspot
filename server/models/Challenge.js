const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, maxlength: 6, minlength: 6 },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  creatorName: { type: String, default: 'Host' },
  songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true }],
  results: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    username: { type: String, default: 'Player' },
    avatar: { type: String, default: '🎵' },
    score: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    rounds: [{
      songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
      score: { type: Number, default: 0 },
      attempts: { type: Number, default: 1 }
    }]
  }],
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

ChallengeSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Challenge', ChallengeSchema);
