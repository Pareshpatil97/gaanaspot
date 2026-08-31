const Challenge = require('../models/Challenge');
const Song = require('../models/Song');

class ChallengeService {
  async createChallenge(userId) {
    const songs = await Song.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 5 } }
    ]);

    if (songs.length < 5) throw new Error('Not enough songs');

    let code;
    let isUnique = false;
    while (!isUnique) {
      code = this.generateCode();
      const existing = await Challenge.findOne({ code });
      if (!existing) isUnique = true;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const challenge = new Challenge({
      code,
      creatorId: userId,
      songIds: songs.map(s => s._id),
      expiresAt
    });

    await challenge.save();
    return code;
  }

  async getChallenge(code) {
    const challenge = await Challenge.findOne({ code }).populate('creatorId', 'username avatar').lean();
    if (!challenge) throw new Error('Challenge not found');
    
    // Hide song IDs for non-participants if needed, but keeping simple for now
    return challenge;
  }

  async completeChallenge(code, userId, score, rounds, username) {
    const challenge = await Challenge.findOne({ code });
    if (!challenge) throw new Error('Challenge not found');

    if (userId) {
      const existingResult = challenge.results.find(r => r.userId && r.userId.toString() === userId.toString());
      if (existingResult) {
        return challenge; // Already completed
      }
    }

    challenge.results.push({
      userId,
      username,
      score,
      completedAt: new Date(),
      rounds: rounds.map(r => ({
        songId: r.songId,
        score: r.score,
        attempts: r.attempts
      }))
    });

    await challenge.save();
    return challenge;
  }

  generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

module.exports = new ChallengeService();
