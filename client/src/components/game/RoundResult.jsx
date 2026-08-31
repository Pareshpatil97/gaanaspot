import React, { useEffect, useState } from 'react';
import { Check, X, ArrowRight, Disc3, Music2, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge';

const RoundResult = ({ result, song, onNext, isLastRound = false }) => {
  const [show, setShow] = useState(false);
  const isCorrect = result?.status === 'correct';
  
  const currentSong = song || result?.song || {};
  const songTitle = currentSong.title || 'Bollywood Track';
  const movieName = currentSong.movie || 'Bollywood';
  const releaseYear = currentSong.releaseYear || currentSong.year || 'Hit';
  const singersList = Array.isArray(currentSong.singers) 
    ? currentSong.singers.join(', ') 
    : (currentSong.singer || currentSong.artists?.[0] || 'Popular Artist');
  const artworkUrl = currentSong.artworkUrl || '';

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto px-4 animate-scaleIn">
      <div 
        className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#101412]/95 backdrop-blur-2xl border-2 shadow-2xl transition-all duration-300 ${
          isCorrect 
            ? 'border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.3)]' 
            : 'border-rose-500/60 shadow-[0_0_40px_rgba(244,63,94,0.3)]'
        }`}
      >
        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg ${
              isCorrect ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
            }`}
          >
            {isCorrect ? <Check className="w-7 h-7 stroke-[3]" /> : <X className="w-7 h-7 stroke-[3]" />}
          </div>

          <div className="text-left">
            <h2 className={`text-2xl font-black tracking-tight ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? 'Spot On! 🎉' : 'Wrong Answer! ❌'}
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              {isCorrect ? `Guessed in ${result?.attempt || 1} of 3 chances` : 'Used all 3 chances'}
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="mb-6">
          <span 
            className={`px-4 py-1.5 rounded-full text-base font-extrabold tracking-wide ${
              isCorrect 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {isCorrect ? `+${result?.score || 1000} Points` : '+0 Points'}
          </span>
        </div>

        {/* Correct Song Card Banner */}
        <div className="w-full bg-[#161c18] rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center gap-4 mb-6 shadow-inner">
          
          {/* Artwork Image or Disc */}
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1f2621] shrink-0 border border-white/10 flex items-center justify-center shadow-md">
            {artworkUrl ? (
              <img 
                src={artworkUrl} 
                alt={songTitle} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <Disc3 className="w-10 h-10 text-emerald-400 animate-spin-slow" />
            )}
          </div>

          {/* Song Metadata */}
          <div className="text-left flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
              {isCorrect ? 'Correct Answer:' : 'The Correct Song was:'}
            </p>
            <h3 className="font-extrabold text-xl text-white truncate drop-shadow">
              {songTitle}
            </h3>
            <p className="text-sm font-semibold text-emerald-400 truncate mt-0.5">
              {movieName}
            </p>
            <p className="text-xs text-gray-300 truncate mt-0.5">
              🎤 {singersList}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">
                📅 {releaseYear}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Bollywood
              </span>
            </div>
          </div>
        </div>

        {/* Next Song Action Button */}
        <button 
          onClick={onNext}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg flex justify-center items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform active:scale-98 group"
        >
          <span>{isLastRound ? 'See Final Score 🏆' : 'Next Song'}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};

export default RoundResult;
