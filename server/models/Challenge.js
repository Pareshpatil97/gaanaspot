const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, maxlength: 6, minlength: 6 },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true }],
  results: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    score: { type: Number },
    completedAt: { type: Date },
    rounds: [{
      songId: { type: mongoose.Schema.Types.ObjectId },
      score: { type: Number },
      attempts: { type: Number }
    }]
  }],
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

ChallengeSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Challenge', ChallengeSchema);
