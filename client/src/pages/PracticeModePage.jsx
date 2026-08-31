import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import ProgressBar from '../components/game/ProgressBar';
import { GENRES, DECADES, DIFFICULTIES } from '../utils/constants';

const PracticeModePage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [filters, setFilters] = useState({ genre: [], decade: [], difficulty: null });
  
  const {
    game, currentRound, currentAttempt, score, isComplete, roundResults, roundFinished,
    allowedDuration, startNewGame, handleGuess, handleSkip, nextRound
  } = useGame();

  const handleStart = async () => {
    await startNewGame('practice', filters);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isComplete && game) {
      navigate(`/results/${game._id}`, { state: { game, score, roundResults } });
    }
  }, [isComplete, game, navigate, score, roundResults]);

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      if (type === 'difficulty') {
        return { ...prev, difficulty: prev.difficulty === value ? null : value };
      }
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value) ? list.filter(i => i !== value) : [...list, value]
      };
    });
  };

  if (isPlaying && game) {
    return (
      <div className="max-w-4xl mx-auto pt-4 pb-20 px-4 min-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Practice Mode</h1>
            <p className="text-text-secondary text-sm">Score: {score}</p>
          </div>
          <button onClick={() => setIsPlaying(false)} className="text-sm font-bold text-text-muted hover:text-white transition-colors">
            End Practice
          </button>
        </div>

        <ProgressBar total={game.rounds.length} current={currentRound} results={roundResults} />

        <div className="flex-1 flex flex-col justify-center">
          {!roundFinished ? (
            <GameBoard 
              game={game}
              currentRound={currentRound}
              currentAttempt={currentAttempt}
              allowedDuration={allowedDuration}
              onGuess={handleGuess}
              onSkip={handleSkip}
              roundFinished={roundFinished}
            />
          ) : (
            <RoundResult result={roundResults[currentRound]} song={game.rounds[currentRound].song} onNext={nextRound} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
      <p className="text-text-secondary mb-10">Configure your practice session. Select options to filter the song pool.</p>

      <div className="space-y-8 glass-card p-6 md:p-8">
        
        <div>
          <h3 className="font-bold text-white mb-3">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => toggleFilter('difficulty', d.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filters.difficulty === d.value ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary hover:border-text-muted'}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => toggleFilter('genre', g)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filters.genre.includes(g) ? 'bg-secondary/20 text-secondary border-secondary/50' : 'bg-surface border-border text-text-secondary hover:border-text-muted'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white mb-3">Decades</h3>
          <div className="flex flex-wrap gap-2">
            {DECADES.map(d => (
              <button
                key={d}
                onClick={() => toggleFilter('decade', d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filters.decade.includes(d) ? 'bg-success/20 text-success border-success/50' : 'bg-surface border-border text-text-secondary hover:border-text-muted'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border mt-8">
          <button onClick={handleStart} className="btn-primary w-full py-4 text-lg font-bold">
            Start Practice
          </button>
        </div>

      </div>
    </div>
  );
};

export default PracticeModePage;
