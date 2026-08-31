import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreDisplay from '../components/game/ScoreDisplay';
import ShareResult from '../components/game/ShareResult';
import { Share2, RefreshCw, Target, Swords, Check, X } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { MAX_SCORE } from '../utils/constants';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  
  const { game, score, roundResults } = location.state || {};

  if (!game) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No Game Found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const accuracy = Math.round((roundResults.filter(r => r.status === 'correct').length / game.rounds.length) * 100) || 0;

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-20 px-4 animate-fadeIn">
      
      <div className="text-center mb-10">
        <div className="inline-block px-4 py-1 bg-surface-hover rounded-full text-text-secondary text-sm font-bold uppercase tracking-widest mb-6">
          Game Complete
        </div>
        <ScoreDisplay score={score} maxScore={MAX_SCORE} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-text-muted text-sm font-bold uppercase mb-1">Accuracy</div>
          <div className="text-2xl font-black text-white">{accuracy}%</div>
        </div>
        <div className="glass-panel p-4 text-center rounded-xl">
          <div className="text-text-muted text-sm font-bold uppercase mb-1">Mode</div>
          <div className="text-2xl font-black text-white capitalize">{game.mode}</div>
        </div>
      </div>

      <div className="space-y-3 mb-10">
        <h3 className="text-lg font-bold mb-4">Song Breakdown</h3>
        {game.rounds.map((round, i) => {
          const res = roundResults[i];
          const isCorrect = res?.status === 'correct';
          
          return (
            <div key={i} className={`glass-card p-4 flex items-center justify-between border-l-4 ${isCorrect ? 'border-l-success' : 'border-l-error'}`}>
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                  {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{round.song.title}</p>
                  <p className="text-text-muted text-xs truncate">{round.song.movie}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <div className={`font-bold ${isCorrect ? 'text-success' : 'text-text-muted'}`}>
                  {res ? `+${res.score}` : '0'}
                </div>
                {isCorrect && (
                  <Badge variant="outline" className="text-[10px] mt-1">Try {res.attempt + 1}</Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => setShareOpen(true)} className="btn-primary py-4 flex items-center justify-center gap-2 text-lg">
          <Share2 className="w-5 h-5" /> Share Result
        </button>
        {game.mode === 'daily' ? (
          <Link to="/practice" className="btn-outline py-4 flex items-center justify-center gap-2 text-lg bg-surface">
            <Target className="w-5 h-5" /> Practice Mode
          </Link>
        ) : (
          <button onClick={() => navigate('/practice')} className="btn-outline py-4 flex items-center justify-center gap-2 text-lg bg-surface">
            <RefreshCw className="w-5 h-5" /> Play Again
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <Link to="/challenge/create" className="btn-outline w-full py-4 flex items-center justify-center gap-2 text-lg border-secondary/30 text-secondary hover:bg-secondary/10">
          <Swords className="w-5 h-5" /> Challenge Friends
        </Link>
      </div>

      <ShareResult isOpen={shareOpen} onClose={() => setShareOpen(false)} game={{ totalScore: score, rounds: roundResults }} />

    </div>
  );
};

export default ResultPage;
