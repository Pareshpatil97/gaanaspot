import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import { ERAS, DIFFICULTIES } from '../utils/constants';

const PracticeModePage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  
  const {
    game, currentRound, currentAttempt, score, isComplete, roundResults, roundFinished,
    allowedDuration, startNewGame, handleGuess, handleSkip, nextRound
  } = useGame();

  const handleStart = async (era = selectedEra, diff = selectedDifficulty) => {
    const options = {};
    if (era !== 'all') {
      if (era === 'classic') options.decade = '1970s';
      else options.decade = era;
    }
    if (diff) options.difficulty = diff;

    await startNewGame('practice', options);
    setIsPlaying(true);
  };

  useEffect(() => {
    // Start practice mode immediately on mount for quick play!
    handleStart('all', 1);
  }, []);

  useEffect(() => {
    if (isComplete && game) {
      navigate(`/results/${game._id}`, { state: { game, score, roundResults } });
    }
  }, [isComplete, game, navigate, score, roundResults]);

  const handleEraChange = (newEra) => {
    setSelectedEra(newEra);
    handleStart(newEra, selectedDifficulty);
  };

  const handleDiffChange = (newDiff) => {
    setSelectedDifficulty(newDiff);
    handleStart(selectedEra, newDiff);
  };

  const isLastRound = currentRound === (game?.rounds?.length || 5) - 1;

  if (isPlaying && game) {
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
            onSelectEra={handleEraChange}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={handleDiffChange}
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
  }

  return null;
};

export default PracticeModePage;
