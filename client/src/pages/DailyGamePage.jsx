import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import ProgressBar from '../components/game/ProgressBar';
import ScoreDisplay from '../components/game/ScoreDisplay';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DailyGamePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const {
    game,
    currentRound,
    currentAttempt,
    score,
    isComplete,
    roundResults,
    roundFinished,
    allowedDuration,
    startNewGame,
    handleGuess,
    handleSkip,
    nextRound
  } = useGame();

  useEffect(() => {
    startNewGame('daily').then(() => setLoading(false));
  }, [startNewGame]);

  useEffect(() => {
    if (isComplete && game) {
      navigate(`/results/${game._id}`, { state: { game, score, roundResults } });
    }
  }, [isComplete, game, navigate, score, roundResults]);

  if (loading || !game) return <LoadingSpinner text="Loading today's songs..." />;

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-20 px-4 min-h-[80vh] flex flex-col">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Daily 5</h1>
          <p className="text-text-secondary text-sm">Guess all 5 songs correctly</p>
        </div>
        <ScoreDisplay score={score} />
      </div>

      <ProgressBar 
        total={game.rounds.length} 
        current={currentRound} 
        results={roundResults} 
      />

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
          <RoundResult 
            result={roundResults[currentRound]} 
            song={game.rounds[currentRound].song}
            onNext={nextRound}
          />
        )}
      </div>

    </div>
  );
};

export default DailyGamePage;
