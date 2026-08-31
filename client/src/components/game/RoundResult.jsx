import React, { useEffect, useState } from 'react';
import { Share2, ArrowRight, Disc3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoundResult = ({ result, song, onNext, isLastRound = false }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const isCorrect = result?.status === 'correct';
  
  const currentSong = song || result?.song || {};
  const songTitle = currentSong.title || 'Bollywood Track';
  const movieName = currentSong.movie || 'Bollywood';
  const singersList = Array.isArray(currentSong.singers) 
    ? currentSong.singers.join(', ') 
    : (currentSong.singer || currentSong.artists?.[0] || 'Bollywood Artist');

  useEffect(() => {
    setShow(true);
  }, []);

  const handleChallengeClick = () => {
    navigate('/challenge/create');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 select-none animate-scaleIn">
      <div className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-[#0f1411]/95 backdrop-blur-2xl border border-white/10 shadow-2xl text-center">
        
        {/* IT WAS _ header */}
        <p className={`text-xs sm:text-sm font-black tracking-[0.3em] uppercase mb-3 ${
          isCorrect ? 'text-emerald-400' : 'text-rose-500'
        }`}>
          {isCorrect ? 'YOU GUESSED IT _' : 'I T   W A S _'}
        </p>

        {/* Large Song Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 leading-tight drop-shadow-md">
          {songTitle}
        </h2>

        {/* Artist / Movie Subtitle */}
        <p className="text-sm sm:text-base font-semibold text-gray-400 mb-8 max-w-md truncate">
          {singersList} • {movieName}
        </p>

        {/* Stamped Badge: LOST! or SPOT ON! (Exact Songspot Style) */}
        <div className="mb-10">
          <div 
            className={`inline-block px-8 py-2.5 rounded-full border-2 font-black text-xl sm:text-2xl uppercase tracking-wider transform -rotate-3 transition-transform shadow-lg ${
              isCorrect 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'border-rose-500 text-rose-500 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            {isCorrect ? 'SPOT ON!' : 'LOST!'}
          </div>
        </div>

        {/* Side-by-Side Action Buttons: [ Challenge your friend ] [ Next ] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* Challenge Button */}
          <button 
            onClick={handleChallengeClick}
            className="w-full py-4 px-5 rounded-2xl bg-[#1a211d] hover:bg-[#242e28] text-rose-400 hover:text-rose-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-95 shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Challenge your friend</span>
          </button>

          {/* Next Button */}
          <button 
            onClick={onNext}
            className="w-full py-4 px-5 rounded-2xl bg-[#1c2420] hover:bg-[#28342e] text-rose-400 hover:text-rose-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-95 shadow-md group"
          >
            <span>{isLastRound ? 'See Results' : 'Next'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoundResult;
