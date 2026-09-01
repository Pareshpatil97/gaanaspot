const Challenge = require('../models/Challenge');
const Song = require('../models/Song');

class ChallengeService {
  async createChallenge(userId, creatorName = 'Host') {
    // Pick 5 progressive difficulty songs for a fair, exciting match
    const diffs = [1, 2, 3, 4, 5];
    const songs = [];

    for (const diff of diffs) {
      let pick = await Song.aggregate([
        { $match: { isActive: true, difficulty: diff } },
        { $sample: { size: 1 } }
      ]);

      if (!pick || pick.length === 0) {
        pick = await Song.aggregate([
          { $match: { isActive: true } },
          { $sample: { size: 1 } }
        ]);
      }

      if (pick && pick.length > 0) {
        songs.push(pick[0]);
      }
    }

    if (songs.length < 5) {
      const fallbackSongs = await Song.aggregate([
        { $match: { isActive: true } },
        { $sample: { size: 5 } }
      ]);
      songs.push(...fallbackSongs);
    }

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
      creatorName: creatorName || 'Host',
      songIds: songs.slice(0, 5).map(s => s._id),
      expiresAt
    });

    await challenge.save();
    return code;
  }

  async getChallenge(code) {
    const challenge = await Challenge.findOne({ code })
      .populate('creatorId', 'username avatar')
      .populate('results.rounds.songId', 'title movie singers releaseYear')
      .lean();
    if (!challenge) throw new Error('Challenge not found');
    
    return challenge;
  }

  async completeChallenge(code, userId, score, rounds = [], username = 'Player', avatar = '🎵') {
    const challenge = await Challenge.findOne({ code });
    if (!challenge) throw new Error('Challenge not found');

    // Add player result
    challenge.results.push({
      userId: userId || null,
      username: username || 'Player',
      avatar: avatar || '🎵',
      score: score || 0,
      completedAt: new Date(),
      rounds: Array.isArray(rounds) ? rounds.map(r => ({
        songId: r.songId || null,
        score: r.score || 0,
        attempts: r.attempts || 1
      })) : []
    });

    await challenge.save();
    return challenge;
  }

  generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude confusing chars like 0/O, 1/I
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

module.exports = new ChallengeService();
