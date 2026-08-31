import React, { useEffect, useState } from 'react';
import { Check, X, ArrowRight, Disc3 } from 'lucide-react';
import Badge from '../ui/Badge';

const RoundResult = ({ result, song, onNext }) => {
  const [show, setShow] = useState(false);
  const isCorrect = result.status === 'correct';

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 glass-card border-t-4 transition-all duration-500 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} ${isCorrect ? 'border-success' : 'border-error'}`}>
      
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl ${isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
        {isCorrect ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isCorrect ? 'Spot On!' : 'Missed it!'}
      </h2>
      
      {isCorrect && (
        <p className="text-success font-bold text-xl mb-6">+{result.score} pts</p>
      )}

      <div className="w-full bg-surface/50 rounded-xl p-4 flex items-center gap-4 mb-8 border border-white/5">
        <div className="w-16 h-16 bg-surface-hover rounded-lg flex items-center justify-center shrink-0">
          <Disc3 className="w-8 h-8 text-text-muted" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="font-bold text-lg text-white truncate">{song.title}</p>
          <p className="text-text-secondary text-sm truncate">{song.movie}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{song.year || 'N/A'}</Badge>
            <Badge variant="outline">{song.singer || 'Unknown'}</Badge>
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="btn-primary w-full py-4 text-lg flex justify-center items-center gap-2 group"
      >
        Next Song 
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};

export default RoundResult;
