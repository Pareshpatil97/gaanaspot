import { useState, useCallback } from 'react';
import { gameService } from '../services/gameService';
import { MAX_ATTEMPTS, ATTEMPT_DURATIONS, ATTEMPT_SCORES } from '../utils/constants';

export const useGame = () => {
  const [game, setGame] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [roundResults, setRoundResults] = useState([]);
  
  const [roundFinished, setRoundFinished] = useState(false);

  const startNewGame = useCallback(async (mode, options = {}) => {
    try {
      const newGame = await gameService.startGame(mode, options);
      setGame(newGame);
      setCurrentRound(0);
      setCurrentAttempt(0);
      setScore(0);
      setIsComplete(false);
      setRoundResults([]);
      setRoundFinished(false);
      return newGame;
    } catch (e) {
      console.error('Failed to start game', e);
      throw e;
    }
  }, []);

  const handleGuess = async (answer) => {
    if (!game) return;
    
    // Evaluate (Mock logic)
    const currentSong = game.rounds[currentRound].song;
    const isCorrect = currentSong.title.toLowerCase() === answer.title.toLowerCase();

    if (isCorrect) {
      const pointsEarned = ATTEMPT_SCORES[currentAttempt];
      setScore(s => s + pointsEarned);
      setRoundResults(prev => {
        const newResults = [...prev];
        newResults[currentRound] = { status: 'correct', score: pointsEarned, attempt: currentAttempt };
        return newResults;
      });
      setRoundFinished(true);
    } else {
      if (currentAttempt < MAX_ATTEMPTS - 1) {
        setCurrentAttempt(c => c + 1);
      } else {
        setRoundResults(prev => {
          const newResults = [...prev];
          newResults[currentRound] = { status: 'missed', score: 0, attempt: currentAttempt };
          return newResults;
        });
        setRoundFinished(true);
      }
    }
  };

  const handleSkip = () => {
    if (currentAttempt < MAX_ATTEMPTS - 1) {
      setCurrentAttempt(c => c + 1);
    } else {
      setRoundResults(prev => {
        const newResults = [...prev];
        newResults[currentRound] = { status: 'missed', score: 0, attempt: currentAttempt };
        return newResults;
      });
      setRoundFinished(true);
    }
  };

  const nextRound = () => {
    if (currentRound < game.rounds.length - 1) {
      setCurrentRound(r => r + 1);
      setCurrentAttempt(0);
      setRoundFinished(false);
    } else {
      setIsComplete(true);
    }
  };

  return {
    game,
    currentRound,
    currentAttempt,
    score,
    isComplete,
    roundResults,
    roundFinished,
    allowedDuration: ATTEMPT_DURATIONS[currentAttempt],
    startNewGame,
    handleGuess,
    handleSkip,
    nextRound
  };
};
