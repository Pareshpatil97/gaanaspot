import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, Copy, Check, Share2, MessageCircle, Play, Sparkles, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { challengeService } from '../services/challengeService';

const AVATARS = ['🎵', '⚡', '👑', '🔥', '🚀', '🎧', '🎸', '🌟'];

const CreateChallengePage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('gaanaspot_player_name') || '');
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('gaanaspot_player_avatar') || '🎵');
  const [loading, setLoading] = useState(false);
  const [challengeCode, setChallengeCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCreate = async () => {
    const name = playerName.trim() || 'Challenger';
    localStorage.setItem('gaanaspot_player_name', name);
    localStorage.setItem('gaanaspot_player_avatar', selectedAvatar);

    setLoading(true);
    try {
      const res = await challengeService.createChallenge(name);
      const code = res?.data?.code || res?.code || Math.random().toString(36).substring(2, 8).toUpperCase();
      setChallengeCode(code);
      addToast('Bollywood Challenge generated!', 'success');
    } catch (err) {
      console.warn('Backend challenge creation fallback:', err);
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setChallengeCode(fallbackCode);
      addToast('Challenge link generated!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/challenge/${challengeCode}`;
  const viralText = `🎵 *Bollywood Music Duel on GaanaSpot!* ⚔️\n\n${selectedAvatar} *${playerName.trim() || 'Your Friend'}* has challenged you to a Hindi music duel!\n\nCan you guess these 5 Bollywood songs faster than me?\n\n👉 *Accept Challenge & Play Now:* ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast('Challenge link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(viralText)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GaanaSpot Bollywood Duel',
          text: viralText,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      handleCopy();
    }
  };

  const handlePlayNow = () => {
    navigate(`/challenge/${challengeCode}`);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-center select-none animate-fadeIn">
      
      {/* Icon & Title */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <Swords className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
        Challenge a Friend ⚔️
      </h1>
      <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">
        Compete on the exact same 5 Bollywood songs & see who gets the highest score!
      </p>
      
      {!challengeCode ? (
        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-left">
          
          {/* Player Name Input */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Your Name / Nickname
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input 
                type="text"
                maxLength={20}
                placeholder="Enter your name (e.g. Rahul, Priya)..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-[#181e1a] border border-white/15 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder-gray-500 outline-none text-base font-semibold"
              />
            </div>
          </div>

          {/* Avatar Choice */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Pick Your Avatar
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all shrink-0 ${
                    selectedAvatar === av 
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                      : 'bg-[#181e1a] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Match rules checklist */}
          <div className="space-y-3 mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Both players get the exact same 5 Bollywood tracks
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Faster guesses in early seconds earn up to 1,200 pts each
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> Live scoreboard reveals the winner in real time
            </div>
          </div>

          {/* Generate button */}
          <button 
            onClick={handleCreate} 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform active:scale-98"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            {loading ? 'Creating Duel Room...' : 'Generate Challenge Link'}
          </button>

        </div>
      ) : (
        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)] text-left animate-scaleIn">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedAvatar}</span>
              <span className="text-sm font-black text-white">{playerName || 'Challenger'}</span>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
              Code: {challengeCode}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5">
            Share this link with your friends on WhatsApp to challenge them:
          </p>
          
          {/* Link box with copy */}
          <div className="bg-[#181e1a] border border-white/10 p-3 rounded-2xl flex items-center gap-2 mb-5">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent border-none w-full outline-none text-gray-300 text-xs font-mono truncate px-2"
            />
            <button 
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button 
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Share on WhatsApp
            </button>

            <button 
              onClick={handleNativeShare}
              className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm flex items-center justify-center gap-2 border border-white/10 transition-transform active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Share Link
            </button>
          </div>

          {/* Play turn button */}
          <button 
            onClick={handlePlayNow}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform active:scale-98"
          >
            <Play className="w-5 h-5 fill-current" />
            Play Your Turn Now 🎮
          </button>

        </div>
      )}

    </div>
  );
};

export default CreateChallengePage;
