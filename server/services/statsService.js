const User = require('../models/User');

class StatsService {
  async updateStats(userId, game) {
    const user = await User.findById(userId);
    if (!user) return;

    let correctRounds = 0;
    game.rounds.forEach(r => {
      if (r.correct) correctRounds++;
    });

    user.stats.totalGames += 1;
    user.stats.totalCorrect += correctRounds;
    user.stats.totalScore += game.totalScore;
    
    if (game.totalScore > user.stats.highScore) {
      user.stats.highScore = game.totalScore;
    }

    user.stats.averageScore = Math.round(user.stats.totalScore / user.stats.totalGames);

    await this.updateStreak(user);
    await user.save();
    await this.checkAchievements(user, game);
  }

  async updateStreak(user) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const todayDate = new Date(todayStr);

    if (user.stats.lastPlayedDate) {
      const lastStr = user.stats.lastPlayedDate.toISOString().split('T')[0];
      const lastDate = new Date(lastStr);
      
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        user.stats.currentStreak += 1;
      } else if (diffDays > 1) {
        user.stats.currentStreak = 1;
      }
    } else {
      user.stats.currentStreak = 1;
    }

    if (user.stats.currentStreak > user.stats.bestStreak) {
      user.stats.bestStreak = user.stats.currentStreak;
    }

    user.stats.lastPlayedDate = now;
  }

  async checkAchievements(user, game) {
    const newAchievements = [];
    const hasAchiev = (type) => user.achievements.some(a => a.type === type);

    if (!hasAchiev('FIRST_SONG') && user.stats.totalCorrect >= 1) {
      newAchievements.push({ type: 'FIRST_SONG' });
    }
    
    if (!hasAchiev('STREAK_7') && user.stats.currentStreak >= 7) {
      newAchievements.push({ type: 'STREAK_7' });
    }

    if (!hasAchiev('SCORE_5000') && game.totalScore >= 5000) {
      newAchievements.push({ type: 'SCORE_5000' });
    }

    if (!hasAchiev('PERFECT_ROUND') && game.totalScore === 6000) {
      newAchievements.push({ type: 'PERFECT_ROUND' });
    }

    if (!hasAchiev('SONGS_100') && user.stats.totalCorrect >= 100) {
      newAchievements.push({ type: 'SONGS_100' });
    }

    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
      await user.save();
    }
  }
}

module.exports = new StatsService();
