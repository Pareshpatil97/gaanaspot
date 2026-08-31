import React from 'react';
import AudioPlayer from './AudioPlayer';
import AnswerInput from './AnswerInput';
import { ATTEMPT_DURATIONS, MAX_ATTEMPTS } from '../../utils/constants';

const GameBoard = ({ game, currentRound, currentAttempt, allowedDuration, onGuess, onSkip, roundFinished }) => {
  if (!game || !game.rounds[currentRound]) return null;
  const currentSong = game.rounds[currentRound].song;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto glass-card p-6 sm:p-10 border-t border-white/10">
      
      {/* Attempt Indicator */}
      <div className="flex gap-1.5 w-full mb-10">
        {ATTEMPT_DURATIONS.map((dur, i) => (
          <div key={i} className="flex-1 relative">
            <div 
              className={`h-1.5 w-full rounded-full transition-colors ${
                i < currentAttempt 
                  ? 'bg-error/50' // Used/failed attempt
                  : i === currentAttempt 
                    ? 'bg-primary' // Current
                    : 'bg-surface' // Future
              }`}
            />
            {i === currentAttempt && (
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap">
                {dur}s
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Round {currentRound + 1}</h2>
        <p className="text-text-secondary">Listen to the clip and guess the song</p>
      </div>

      <AudioPlayer 
        audioUrl={currentSong?.audioPreviewUrl || currentSong?.audioUrl || ''} 
        maxDuration={allowedDuration}
      />

      <div className="w-full mt-12 mb-4">
        <AnswerInput 
          onSubmit={onGuess} 
          onSkip={onSkip} 
          disabled={roundFinished}
        />
      </div>

    </div>
  );
};

export default GameBoard;
