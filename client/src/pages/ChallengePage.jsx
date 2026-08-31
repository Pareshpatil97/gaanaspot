import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const ChallengePage = () => {
  const { code } = useParams();
  const [started, setStarted] = useState(false);

  // Mock challenge data
  const challenge = {
    creator: { username: 'Rahul_M', score: 4500, avatar: '' },
    isComplete: false
  };

  if (!started) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <h1 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">You've been challenged!</h1>
        
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Swords className="w-32 h-32" />
          </div>

          <Avatar src={challenge.creator.avatar} size="lg" className="mx-auto mb-4 border-2 border-secondary" />
          <h2 className="text-2xl font-bold text-white mb-2">{challenge.creator.username}</h2>
          <p className="text-text-secondary mb-8">has invited you to a music guessing duel.</p>

          <div className="bg-surface/50 rounded-xl p-4 mb-8 border border-white/5">
            <p className="text-text-muted text-sm uppercase font-bold mb-1">Target Score</p>
            <p className="text-4xl font-black text-white">{challenge.creator.score.toLocaleString()}</p>
          </div>

          <button 
            onClick={() => setStarted(true)}
            className="btn-primary w-full py-4 text-xl font-black bg-gradient-to-r from-secondary to-primary hover:scale-105 transition-transform"
          >
            Accept Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-4">Game Board Starts Here</h2>
      <p className="text-text-secondary mb-8">The actual GameBoard component would mount here, similar to Practice Mode.</p>
      <Link to="/" className="btn-outline">Cancel</Link>
    </div>
  );
};

export default ChallengePage;
