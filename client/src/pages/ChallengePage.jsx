import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords, Trophy, Crown, Share2, MessageCircle, Play, User, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { challengeService } from '../services/challengeService';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AVATARS = ['🎵', '⚡', '👑', '🔥', '🚀', '🎧', '🎸', '🌟'];

const ChallengePage = () => {
  const { code } = useParams();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('invite'); // 'invite' | 'playing' | 'results'
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('gaanaspot_player_name') || '');
  const [playerAvatar, setPlayerAvatar] = useState(() => localStorage.getItem('gaanaspot_player_avatar') || '⚡');
  const [isPolling, setIsPolling] = useState(false);
  const pollIntervalRef = useRef(null);

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

  const fetchChallenge = async () => {
    try {
      const res = await challengeService.getChallenge(code);
      const data = res?.data || res || { code };
      setChallengeData(data);
    } catch (err) {
      console.warn('Challenge fetch notice:', err.message);
      setChallengeData(prev => prev || { code, creatorName: 'Challenger', results: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) fetchChallenge();
  }, [code]);

  // Real-time polling when in results screen to see opponent's score live
  useEffect(() => {
    if (gameState === 'results' && code) {
      setIsPolling(true);
      pollIntervalRef.current = setInterval(fetchChallenge, 3500);
      return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      };
    }
  }, [gameState, code]);

  const handleStartChallenge = async () => {
    const finalName = playerName.trim() || 'Player';
    localStorage.setItem('gaanaspot_player_name', finalName);
    localStorage.setItem('gaanaspot_player_avatar', playerAvatar);

    setLoading(true);
    try {
      await startNewGame('challenge', { challengeCode: code });
      setGameState('playing');
    } catch (err) {
      console.warn('Fallback to practice game for challenge:', err);
      await startNewGame('practice');
      setGameState('playing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isComplete && game) {
      setGameState('results');
      if (code) {
        const finalName = playerName.trim() || localStorage.getItem('gaanaspot_player_name') || 'Player';
        const finalAvatar = playerAvatar || localStorage.getItem('gaanaspot_player_avatar') || '🎵';
        
        challengeService.completeChallenge(code, {
          score,
          username: finalName,
          avatar: finalAvatar,
          rounds: roundResults.map((r, idx) => ({
            songId: game.rounds?.[idx]?.song?._id || null,
            score: r.score,
            attempts: r.attempt
          }))
        }).then(() => fetchChallenge()).catch(() => {});
      }
    }
  }, [isComplete, game, code, score, roundResults]);

  const results = challengeData?.results || [];
  const shareUrl = window.location.href;
  const shareScoreText = `⚔️ *Bollywood Duel on GaanaSpot!*\n\n${playerAvatar} *${playerName || 'I'}* scored *${score.toLocaleString()} pts* in match #${code}!\n\nCan you beat my score? Play here:\n👉 ${shareUrl}`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareScoreText)}`, '_blank');
  };

  if (loading) return <LoadingSpinner text="Loading Bollywood Challenge..." />;

  // 1. Initial Invitation Screen
  if (gameState === 'invite') {
    const hostName = challengeData?.creatorName || challengeData?.creatorId?.username || 'Your Friend';
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center select-none animate-fadeIn">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">
          GaanaSpot Music Duel
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
          {hostName} Challenged You!
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mb-6">
          5 Bollywood Songs • Real audio snippets • Highest score wins!
        </p>

        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-6 text-left">
          
          <div className="bg-[#181e1a] rounded-2xl p-3.5 mb-5 border border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
              Duel Code
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono tracking-widest">
              {code}
            </span>
          </div>

          {/* Enter your name */}
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input 
                type="text"
                maxLength={20}
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-[#181e1a] border border-white/15 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-9 pr-3 py-3 text-white placeholder-gray-500 outline-none text-sm font-semibold"
              />
            </div>
          </div>

          {/* Pick avatar */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Pick Your Avatar
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setPlayerAvatar(av)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all shrink-0 ${
                    playerAvatar === av 
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                      : 'bg-[#181e1a] border border-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleStartChallenge}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Accept Duel & Play ⚔️
          </button>
        </div>

        <Link to="/" className="text-xs font-bold text-gray-500 hover:text-gray-300">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // 2. Active Game Playing Screen
  if (gameState === 'playing' && game) {
    const isLastRound = currentRound === (game.rounds?.length || 5) - 1;
    return (
      <div className="max-w-4xl mx-auto pt-2 pb-20 px-2 sm:px-4 min-h-[85vh] flex flex-col justify-center">
        {/* Duel Header Badge */}
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full px-4 mb-2 text-xs font-bold text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Swords className="w-3.5 h-3.5" /> Duel Room #{code}
          </span>
          <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-white font-mono">
            {playerAvatar} {playerName || 'You'}
          </span>
        </div>

        {!roundFinished ? (
          <GameBoard 
            game={game}
            currentRound={currentRound}
            currentAttempt={currentAttempt}
            allowedDuration={allowedDuration}
            onGuess={handleGuess}
            onSkip={handleSkip}
            roundFinished={roundFinished}
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

  // 3. Match Results Comparison Screen (Head-to-Head Scoreboard)
  const sortedResults = [...results].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topWinner = sortedResults[0];

  return (
    <div className="max-w-lg mx-auto py-8 px-4 text-center select-none animate-scaleIn">
      
      {/* Trophy & Winner Announcement */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
        Duel Leaderboard 🏆
      </h1>
      <p className="text-xs sm:text-sm text-gray-400 mb-6">
        Match Room #{code} • Live Head-to-Head Comparison
      </p>

      <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-emerald-500/40 shadow-2xl mb-6 text-left">
        
        {/* Your Score Banner */}
        <div className="flex items-center justify-between bg-[#181e1a] rounded-2xl p-4 mb-5 border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{playerAvatar}</span>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                {playerName || 'Your Score'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {score.toLocaleString()} <span className="text-xs text-gray-500 font-normal">pts</span>
              </span>
            </div>
          </div>
          <Crown className="w-8 h-8 text-amber-400 drop-shadow" />
        </div>

        {/* Head to Head Duel Leaderboard */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Live Duel Standings
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live syncing
            </span>
          </div>

          <div className="space-y-2">
            {sortedResults.length > 0 ? (
              sortedResults.map((player, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    idx === 0 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm w-4 text-gray-400">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : `#${idx + 1}`}
                    </span>
                    <span className="text-xl">{player.avatar || '🎵'}</span>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {player.username || 'Player'}
                        {idx === 0 && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">Leader</span>}
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(player.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-white font-mono">
                    {(player.score || 0).toLocaleString()} <span className="text-xs text-gray-500">pts</span>
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-gray-400">
                Waiting for friend to complete their turn... ⏳
              </div>
            )}
          </div>
        </div>

        {/* Share Score on WhatsApp */}
        <button 
          onClick={handleWhatsAppShare}
          className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 mb-3"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          Share Results on WhatsApp
        </button>

        {/* Create Your Own Challenge */}
        <Link 
          to="/challenge/create"
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Start a New Challenge Duel ⚔️
        </Link>

      </div>

      <Link to="/" className="text-xs font-bold text-gray-500 hover:text-gray-300">
        ← Return to Main Menu
      </Link>
    </div>
  );
};

export default ChallengePage;
