import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Target, Users, Sparkles, Music2, Headphones, Trophy, Flame } from 'lucide-react';
import Logo from '../components/ui/Logo';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center pb-20 select-none">
      
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto text-center mt-12 mb-16 animate-fadeIn">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <p className="text-xl md:text-2xl text-text-secondary mb-2 font-medium">How quickly can you recognize the song?</p>
        <p className="text-text-muted mb-8">Listen. Guess. Score.</p>

        {/* Timeline Visual (0.1s -> 0.5s -> 2s -> 8s -> 15s) */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-12 text-sm font-bold text-text-muted flex-wrap">
          <span className="text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 rounded-full">0.1s</span>
          <span className="w-3 md:w-6 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">0.5s</span>
          <span className="w-3 md:w-6 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">2.0s</span>
          <span className="w-3 md:w-6 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">8.0s</span>
          <span className="w-3 md:w-6 h-[1px] bg-border"></span>
          <span className="border border-white/10 bg-surface px-3 py-1 rounded-full">15s</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/play" className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <Play className="w-5 h-5 fill-current" /> Play Daily 5
          </Link>
          <Link to="/practice" className="btn-outline w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 bg-surface">
            <Target className="w-5 h-5" /> Practice Mode
          </Link>
          <Link to="/challenge/create" className="btn-outline w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
            <Users className="w-5 h-5" /> Challenge
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-5xl mx-auto px-4 mt-8">
        <h3 className="text-2xl font-bold text-center mb-10 text-white">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl text-center border border-white/5 bg-[#121614]/80">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Headphones className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">1. Listen</h4>
            <p className="text-text-secondary text-sm">Hear a tiny micro-snippet of a Bollywood hit. Starts from just 0.1 seconds!</p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl text-center border border-white/5 bg-[#121614]/80">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">2. Guess</h4>
            <p className="text-text-secondary text-sm">Type the song or movie name. Wrong guess or skip? You unlock a longer audio clip.</p>
          </div>
          
          <div className="glass-panel p-8 rounded-3xl text-center border border-white/5 bg-[#121614]/80">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">3. Score & Challenge</h4>
            <p className="text-text-secondary text-sm">Identify early for max points (up to 1,200 pts). Challenge your friends on WhatsApp!</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
