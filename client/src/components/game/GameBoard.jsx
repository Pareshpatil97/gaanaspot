import React from 'react';
import AudioPlayer from './AudioPlayer';
import AnswerInput from './AnswerInput';
import { ATTEMPT_DURATIONS, MAX_ATTEMPTS, ERAS, DIFFICULTIES } from '../../utils/constants';

const GameBoard = ({ 
  game, 
  currentRound, 
  currentAttempt, 
  allowedDuration, 
  onGuess, 
  onSkip, 
  roundFinished,
  selectedEra = 'all',
  onSelectEra,
  selectedDifficulty = 1,
  onSelectDifficulty
}) => {
  if (!game || !game.rounds || !game.rounds[currentRound]) return null;
  const roundData = game.rounds[currentRound];
  const currentSong = roundData.song || {};

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 select-none animate-fadeIn">
      
      {/* Top Header Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-white/90 tracking-tight text-center mb-6 drop-shadow-md">
        gaanaspot
      </h1>

      {/* Eras Selector Row (e.g. 2020s, 2010s, Any era, Classic, 90s) */}
      <div className="flex items-center justify-center gap-3 md:gap-5 overflow-x-auto w-full max-w-full pb-2 mb-4 scrollbar-none text-xs sm:text-sm font-semibold text-gray-400">
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => onSelectEra && onSelectEra(era.id)}
            className={`whitespace-nowrap transition-colors py-1 px-2.5 rounded-full ${
              selectedEra === era.id 
                ? 'text-white font-bold bg-white/10' 
                : 'hover:text-gray-200'
            }`}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* Difficulty Pills with Custom Glowing Styles (Songspot style) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
        {DIFFICULTIES.map((diff) => {
          const isSelected = selectedDifficulty === diff.id;
          return (
            <button
              key={diff.id}
              onClick={() => onSelectDifficulty && onSelectDifficulty(diff.id)}
              className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all transform active:scale-95 border ${
                isSelected 
                  ? `${diff.bg} ${diff.glow} ${diff.text} ${diff.border} scale-105`
                  : 'bg-[#181d19] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
              }`}
            >
              {diff.label}
            </button>
          );
        })}
      </div>

      {/* Main Glass Card container */}
      <div className="w-full bg-[#101412]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col items-center">
        
        {/* Round Progress Bar Pills (1 to 5) */}
        <div className="flex items-center justify-between w-full max-w-md mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Song {currentRound + 1} of {game.rounds.length}
          </span>
          <div className="flex gap-1.5">
            {game.rounds.map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-1.5 rounded-full transition-all ${
                  i < currentRound 
                    ? 'bg-emerald-500' 
                    : i === currentRound 
                      ? 'bg-emerald-400 w-6 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                      : 'bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Audio Player with segmented timeline & glowing play/pause */}
        <AudioPlayer 
          audioUrl={currentSong.audioPreviewUrl || currentSong.audioUrl || ''} 
          maxDuration={allowedDuration}
          currentAttempt={currentAttempt}
          totalAttempts={MAX_ATTEMPTS}
        />

        {/* Bottom Search & Skip Row */}
        <div className="w-full mt-10">
          <AnswerInput 
            onSubmit={onGuess} 
            onSkip={onSkip} 
            disabled={roundFinished}
            currentAttempt={currentAttempt}
            maxAttempts={MAX_ATTEMPTS}
          />
        </div>

      </div>

    </div>
  );
};

export default GameBoard;
