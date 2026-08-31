import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DailyGamePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  
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
    startNewGame('daily').then(() => setLoading(false)).catch(() => setLoading(false));
  }, [startNewGame]);

  useEffect(() => {
    if (isComplete && game) {
      navigate(`/results/${game._id}`, { state: { game, score, roundResults } });
    }
  }, [isComplete, game, navigate, score, roundResults]);

  if (loading || !game) return <LoadingSpinner text="Loading today's Bollywood songs..." />;

  const isLastRound = currentRound === (game.rounds?.length || 5) - 1;

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-20 px-2 sm:px-4 min-h-[85vh] flex flex-col justify-center">
      
      {!roundFinished ? (
        <GameBoard 
          game={game}
          currentRound={currentRound}
          currentAttempt={currentAttempt}
          allowedDuration={allowedDuration}
          onGuess={handleGuess}
          onSkip={handleSkip}
          roundFinished={roundFinished}
          selectedEra={selectedEra}
          onSelectEra={setSelectedEra}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
        />
      ) : (
        <RoundResult 
          result={roundResults[currentRound]} 
          song={game.rounds[currentRound]?.song}
          onNext={nextRound}
          isLastRound={isLastRound}
        />
      )}

    </div>
  );
};

export default DailyGamePage;
