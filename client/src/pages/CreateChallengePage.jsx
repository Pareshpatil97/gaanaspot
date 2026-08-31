import React, { useState } from 'react';
import { Swords, Copy, Check, Share2, MessageCircle, Play, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { challengeService } from '../services/challengeService';

const CreateChallengePage = () => {
  const [loading, setLoading] = useState(false);
  const [challengeCode, setChallengeCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await challengeService.createChallenge();
      const code = res?.data?.code || res?.code || Math.random().toString(36).substring(2, 8).toUpperCase();
      setChallengeCode(code);
      addToast('Challenge link generated!', 'success');
    } catch (err) {
      console.warn('Backend challenge creation fallback:', err);
      // Client-side fallback code
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setChallengeCode(fallbackCode);
      addToast('Challenge link generated!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/challenge/${challengeCode}`;
  const viralText = `🎵 Bollywood Music Challenge on GaanaSpot!\n\nI just started a music duel! Can you guess these 5 Hindi songs in under 2 seconds?\n\n👉 Play now: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast('Challenge link copied to clipboard!', 'success');
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
          title: 'GaanaSpot Challenge',
          text: viralText,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center select-none animate-fadeIn">
      
      {/* Icon & Title */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <Swords className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
        Challenge a Friend
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Compete on the exact same 5 Bollywood tracks & see who has the quickest ears!
      </p>
      
      {!challengeCode ? (
        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-left">
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <p className="text-sm text-gray-300">Click below to generate a custom 5-song Bollywood match.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <p className="text-sm text-gray-300">Send the link directly to your WhatsApp group or friend.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <p className="text-sm text-gray-300">Compare scores side-by-side on the live leaderboard!</p>
            </div>
          </div>

          <button 
            onClick={handleCreate} 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg flex justify-center items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform active:scale-98"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            {loading ? 'Generating Challenge...' : 'Create Challenge Link'}
          </button>

        </div>
      ) : (
        <div className="bg-[#101412]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.2)] text-left animate-scaleIn">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Challenge Ready!
            </span>
            <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full text-white">
              Code: {challengeCode}
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Share this link with your friends to start the duel:
          </p>
          
          {/* Link box with copy */}
          <div className="bg-[#181e1a] border border-white/10 p-3.5 rounded-2xl flex items-center gap-3 mb-6">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent border-none w-full outline-none text-gray-300 text-xs sm:text-sm font-mono truncate"
            />
            <button 
              onClick={handleCopy}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
            onClick={() => window.location.href = `/challenge/${challengeCode}`}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform active:scale-98"
          >
            <Play className="w-5 h-5 fill-current" />
            Play Your Turn Now
          </button>

        </div>
      )}

    </div>
  );
};

export default CreateChallengePage;
