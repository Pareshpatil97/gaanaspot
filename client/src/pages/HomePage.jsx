import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Trophy, Flame, Play, Target, Users } from 'lucide-react';
import { profileService } from '../services/profileService';

const HomePage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Try to fetch stats — will silently fail if not logged in
    profileService.getStats()
      .then(res => setStats(res?.data || res))
      .catch(() => {}); // Not logged in, no stats — that's fine
  }, []);

  return (
    <div className="flex flex-col items-center pb-20">
      
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center mt-12 mb-20 animate-fadeIn">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
            <div className="bg-gradient-to-br from-surface to-surface-hover p-4 rounded-2xl border border-white/10 relative shadow-2xl animate-bounce-gentle">
              <Music2 className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer" style={{ backgroundSize: '200% auto' }}>GaanaSpot</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-text-secondary mb-2 font-medium">How quickly can you recognize the song?</p>
        <p className="text-text-muted mb-10">Listen. Guess. Score.</p>

        {/* Timeline Visual */}
        <div className="flex justify-center items-center gap-2 md:gap-4 mb-12 text-sm font-bold text-text-muted">
          <span className="text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">0.1s</span>
          <span className="w-4 md:w-8 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">0.5s</span>
          <span className="w-4 md:w-8 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">2.0s</span>
          <span className="w-4 md:w-8 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">8.0s</span>
          <span className="w-4 md:w-8 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">15s</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/play" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 animate-pulse-slow">
            <Play className="w-5 h-5 fill-current" /> Play Daily 5
          </Link>
          <Link to="/practice" className="btn-outline w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 bg-surface">
            <Target className="w-5 h-5" /> Practice Mode
          </Link>
          <Link to="/challenge/create" className="btn-outline w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 border-secondary/30 text-secondary hover:bg-secondary/10">
            <Users className="w-5 h-5" /> Challenge
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="w-full max-w-4xl mx-auto mb-20 animate-slideUp">
          <h3 className="text-lg font-bold text-text-muted uppercase tracking-wider mb-4 text-center">Your Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <Flame className="w-8 h-8 text-warning mb-2" />
              <div className="text-3xl font-black text-white">{stats.currentStreak}</div>
              <div className="text-text-secondary text-sm">Day Streak</div>
            </div>
            <div className="glass-card p-6 flex flex-col items-center text-center border-primary/30">
              <Trophy className="w-8 h-8 text-primary mb-2" />
              <div className="text-3xl font-black text-white">{stats.highScore.toLocaleString()}</div>
              <div className="text-text-secondary text-sm">High Score</div>
            </div>
            <div className="glass-card p-6 flex flex-col items-center text-center">
              <Music2 className="w-8 h-8 text-secondary mb-2" />
              <div className="text-3xl font-black text-white">{stats.correctAnswers}</div>
              <div className="text-text-secondary text-sm">Songs Guessed</div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="w-full max-w-5xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-10">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-black text-primary">1</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Listen</h4>
            <p className="text-text-secondary">Hear a tiny fraction of a Bollywood hit. Starting with just 0.1 seconds!</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl text-center">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-black text-secondary">2</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Guess</h4>
            <p className="text-text-secondary">Type the song name. Wrong guess or skip? You get a longer clip to listen to.</p>
          </div>
          <div className="glass-panel p-8 rounded-2xl text-center">
            <div className="bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-black text-success">3</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Score</h4>
            <p className="text-text-secondary">Guess early for maximum points. Build your streak and climb the leaderboard!</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
