import { useState, useCallback } from 'react';
import { gameService } from '../services/gameService';
import { MAX_ATTEMPTS, ATTEMPT_DURATIONS, ATTEMPT_SCORES } from '../utils/constants';

export const useGame = () => {
  const [game, setGame] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [score, setScore] = useState(0); // Starts strictly at 0
  const [isComplete, setIsComplete] = useState(false);
  const [roundResults, setRoundResults] = useState([]);
  const [roundFinished, setRoundFinished] = useState(false);

  const startNewGame = useCallback(async (mode = 'daily', options = {}) => {
    try {
      // Ensure clean state starting from 0 every time
      setScore(0);
      setCurrentRound(0);
      setCurrentAttempt(0);
      setIsComplete(false);
      setRoundResults([]);
      setRoundFinished(false);

      const newGame = await gameService.startGame(mode, options);
      setGame(newGame);
      return newGame;
    } catch (e) {
      console.error('Failed to start game', e);
      throw e;
    }
  }, []);

  const handleGuess = async (answer) => {
    if (!game || !game.rounds || !game.rounds[currentRound]) return;
    
    const roundData = game.rounds[currentRound];
    const currentSong = roundData.song || {};
    const songTitle = currentSong.title || '';
    const guessTitle = typeof answer === 'string' ? answer : (answer?.title || '');

    // Try backend evaluation first if game is registered in DB
    let isCorrect = false;
    let revealedSong = currentSong;

    if (game._id && !game._id.startsWith('game_')) {
      const backendResult = await gameService.submitGuess(game._id, currentRound, guessTitle);
      if (backendResult) {
        isCorrect = !!backendResult.correct;
        if (backendResult.song) {
          revealedSong = backendResult.song;
          game.rounds[currentRound].song = backendResult.song;
        }
      } else {
        isCorrect = songTitle.toLowerCase().trim() === guessTitle.toLowerCase().trim();
      }
    } else {
      isCorrect = songTitle.toLowerCase().trim() === guessTitle.toLowerCase().trim();
    }

    if (isCorrect) {
      const pointsEarned = ATTEMPT_SCORES[currentAttempt] || 200;
      setScore(s => s + pointsEarned);
      setRoundResults(prev => {
        const newResults = [...prev];
        newResults[currentRound] = { 
          status: 'correct', 
          score: pointsEarned, 
          attempt: currentAttempt + 1,
          song: revealedSong
        };
        return newResults;
      });
      setRoundFinished(true);
    } else {
      if (currentAttempt < MAX_ATTEMPTS - 1) {
        setCurrentAttempt(c => c + 1);
      } else {
        setRoundResults(prev => {
          const newResults = [...prev];
          newResults[currentRound] = { 
            status: 'missed', 
            score: 0, 
            attempt: MAX_ATTEMPTS,
            song: revealedSong
          };
          return newResults;
        });
        setRoundFinished(true);
      }
    }
  };

  const handleSkip = async () => {
    if (!game || !game.rounds || !game.rounds[currentRound]) return;
    const roundData = game.rounds[currentRound];
    let revealedSong = roundData.song || {};

    if (currentAttempt < MAX_ATTEMPTS - 1) {
      setCurrentAttempt(c => c + 1);
    } else {
      if (game._id && !game._id.startsWith('game_')) {
        const backendResult = await gameService.skipRound(game._id, currentRound);
        if (backendResult?.song) {
          revealedSong = backendResult.song;
          game.rounds[currentRound].song = backendResult.song;
        }
      }
      setRoundResults(prev => {
        const newResults = [...prev];
        newResults[currentRound] = { 
          status: 'missed', 
          score: 0, 
          attempt: MAX_ATTEMPTS,
          song: revealedSong
        };
        return newResults;
      });
      setRoundFinished(true);
    }
  };

  const nextRound = () => {
    if (!game || !game.rounds) return;
    if (currentRound < game.rounds.length - 1) {
      setCurrentRound(r => r + 1);
      setCurrentAttempt(0);
      setRoundFinished(false);
    } else {
      if (game._id && !game._id.startsWith('game_')) {
        gameService.completeGame(game._id);
      }
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
    allowedDuration: ATTEMPT_DURATIONS[currentAttempt] || 15,
    startNewGame,
    handleGuess,
    handleSkip,
    nextRound
  };
};
