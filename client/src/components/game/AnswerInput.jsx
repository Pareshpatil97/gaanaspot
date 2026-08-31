import React, { useState, useEffect, useRef } from 'react';
import { Search, SkipForward } from 'lucide-react';
import { songService } from '../../services/songService';

const AnswerInput = ({ onSubmit, onSkip, disabled }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        const results = await songService.searchSongs(query);
        setSuggestions(results.slice(0, 8));
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
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
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative flex flex-col gap-4" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          className="input-field pl-12 py-4 text-lg bg-surface/50 border-white/10 backdrop-blur-sm placeholder:text-text-muted"
          placeholder="Know the song? Type here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true) }}
          disabled={disabled}
        />
        
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-scaleIn divide-y divide-border">
            {suggestions.map((song, idx) => (
              <li
                key={song._id || idx}
                className={`px-4 py-3 cursor-pointer transition-colors flex flex-col ${activeIndex === idx ? 'bg-primary/20' : 'hover:bg-surface-hover'}`}
                onClick={() => handleSelect(song)}
              >
                <span className="font-semibold text-white">{song.title}</span>
                <span className="text-xs text-text-muted">{song.movie} • {song.singer}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-center px-2">
        <button
          onClick={onSkip}
          disabled={disabled}
          className="text-text-muted hover:text-white font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          Skip (+time) <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AnswerInput;
