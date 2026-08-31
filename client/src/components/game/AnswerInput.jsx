import React, { useState, useEffect, useRef } from 'react';
import { Search, SkipForward } from 'lucide-react';
import { songService } from '../../services/songService';

const AnswerInput = ({ onSubmit, onSkip, disabled, currentAttempt = 0, maxAttempts = 5 }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isShaking, setIsShaking] = useState(false);
  const wrapperRef = useRef(null);
  const prevAttemptRef = useRef(currentAttempt);

  // Trigger shake & vibration when attempt increments (wrong guess or skip)
  useEffect(() => {
    if (currentAttempt > prevAttemptRef.current) {
      setIsShaking(true);
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([100, 50, 100]); } catch (e) {}
      }
      const timer = setTimeout(() => setIsShaking(false), 550);
      prevAttemptRef.current = currentAttempt;
      return () => clearTimeout(timer);
    }
    prevAttemptRef.current = currentAttempt;
  }, [currentAttempt]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        const results = await songService.searchSongs(query);
        setSuggestions(Array.isArray(results) ? results.slice(0, 8) : []);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 180);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (song) => {
    onSubmit(song);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative select-none" ref={wrapperRef}>
      
      {/* Side-by-Side Search Input & Skip Button (With Wrong-Guess Shake Animation) */}
      <div className={`flex items-center gap-3 w-full transition-transform ${isShaking ? 'animate-shake' : ''}`}>
        
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Search className="h-5 w-5" />
          </div>
          
          <input
            type="text"
            className={`w-full rounded-2xl bg-[#141815] border pl-12 pr-4 py-4 text-base md:text-lg text-white placeholder-gray-500 transition-all outline-none ${
              isShaking 
                ? 'border-rose-500 ring-2 ring-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
                : 'border-white/10 hover:border-white/20 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20'
            }`}
            placeholder="Name that track..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
            disabled={disabled}
          />

          {/* Autocomplete Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <ul className="absolute z-30 w-full mt-2 bg-[#141815] border border-white/15 rounded-2xl shadow-2xl max-h-72 overflow-y-auto divide-y divide-white/5 animate-scaleIn backdrop-blur-xl">
              {suggestions.map((song, idx) => (
                <li
                  key={song._id || idx}
                  className={`px-5 py-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                    activeIndex === idx ? 'bg-[#10b981]/20 text-[#10b981]' : 'hover:bg-white/5 text-gray-200'
                  }`}
                  onClick={() => handleSelect(song)}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-white text-base truncate">{song.title}</span>
                    <span className="text-xs text-gray-400 truncate">
                      {song.movie || 'Bollywood'} {song.singer ? `• ${song.singer}` : ''} {song.releaseYear ? `(${song.releaseYear})` : ''}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-gray-400 shrink-0">
                    Select ⏎
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          disabled={disabled}
          className="rounded-2xl bg-[#1a201c] hover:bg-[#232b26] border border-white/10 hover:border-white/20 text-gray-200 hover:text-white px-6 py-4 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40 shrink-0 shadow-lg"
        >
          <SkipForward className="w-4 h-4 fill-current" />
          <span>Skip</span>
        </button>

      </div>

      {/* Attempts remaining indicator */}
      <div className="flex justify-between items-center px-3 mt-3 text-xs font-medium text-gray-400">
        <span className={isShaking ? 'text-rose-400 font-bold' : ''}>
          {isShaking ? '❌ Wrong guess! Try next snippet' : `Chance ${currentAttempt + 1} of ${maxAttempts}`}
        </span>
        <span>{maxAttempts - currentAttempt - 1} skips left</span>
      </div>

    </div>
  );
};

export default AnswerInput;
