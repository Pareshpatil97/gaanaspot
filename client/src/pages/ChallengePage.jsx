import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swords, Trophy, Crown, Share2, MessageCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { challengeService } from '../services/challengeService';
import GameBoard from '../components/game/GameBoard';
import RoundResult from '../components/game/RoundResult';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ChallengePage = () => {
  const { code } = useParams();
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState('invite'); // 'invite' | 'playing' | 'results'
  
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

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await challengeService.getChallenge(code);
        setChallengeData(res?.data || res || { code });
      } catch (err) {
        console.warn('Challenge fetch fallback:', err);
        setChallengeData({ code });
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchChallenge();
  }, [code]);

  const handleStartChallenge = async () => {
    setLoading(true);
    try {
      await startNewGame('challenge', { challengeCode: code });
      setGameState('playing');
    } catch (err) {
      console.warn('Fallback to practice songs for challenge:', err);
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
        challengeService.completeChallenge(code, {
          score,
          rounds: roundResults.map(r => ({ score: r.score, attempts: r.attempt }))
        }).catch(() => {});
      }
    }
  }, [isComplete, game, code, score, roundResults]);

  const shareUrl = window.location.href;
  const shareScoreText = `🔥 I just scored ${score.toLocaleString()} pts in this GaanaSpot Bollywood Challenge!\n\nCan you beat my score? Play here:\n👉 ${shareUrl}`;

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareScoreText)}`, '_blank');
  };

  if (loading) return <LoadingSpinner text="Loading music challenge..." />;

  // 1. Initial Invitation Screen
  if (gameState === 'invite') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center select-none animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <Swords className="w-10 h-10 text-emerald-400" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
          Friend Challenge
        </span>

        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
          You've Been Challenged!
        </h1>
        <p className="text-sm text-gray-400 mb-8">
          5 Bollywood Songs • 3 Chances each • Highest score wins
        </p>

        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-2xl mb-6">
          <div className="bg-[#181e1a] rounded-2xl p-4 mb-6 border border-white/5">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">
              Match Code
            </span>
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-widest">
              {code}
            </span>
          </div>

          <button 
            onClick={handleStartChallenge}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform active:scale-98"
          >
            Accept Challenge ⚔️
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

  // 3. Match Results Comparison Screen
  return (
    <div className="max-w-lg mx-auto py-10 px-4 text-center select-none animate-scaleIn">
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <Trophy className="w-10 h-10 text-emerald-400" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
        Challenge Completed! 🏆
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Here is your final match score
      </p>

      <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl mb-6 text-left">
        
        {/* Your Score */}
        <div className="flex items-center justify-between bg-[#181e1a] rounded-2xl p-5 mb-6 border border-white/10">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">
              Your Score
            </span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">
              {score.toLocaleString()} <span className="text-base text-gray-400 font-normal">/ 5000</span>
            </span>
          </div>
          <Crown className="w-10 h-10 text-amber-400 drop-shadow" />
        </div>

        {/* Share Score on WhatsApp */}
        <button 
          onClick={handleWhatsAppShare}
          className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 mb-4"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          Share Score on WhatsApp
        </button>

        {/* Create Your Own Challenge */}
        <Link 
          to="/challenge/create"
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          Create Your Own Challenge ⚔️
        </Link>

      </div>

      <Link to="/" className="text-xs font-bold text-gray-500 hover:text-gray-300">
        ← Return to Main Menu
      </Link>
    </div>
  );
};

export default ChallengePage;
