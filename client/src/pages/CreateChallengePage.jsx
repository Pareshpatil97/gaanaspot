import React, { useState } from 'react';
import { Swords, Copy, Check, Share2 } from 'lucide-react';
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
      // const res = await challengeService.createChallenge();
      // setChallengeCode(res.code);
      setTimeout(() => {
        setChallengeCode(Math.random().toString(36).substring(2, 8).toUpperCase());
        setLoading(false);
      }, 1000);
    } catch (err) {
      addToast('Failed to create challenge', 'error');
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/challenge/${challengeCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      addToast('Link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      
      <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Swords className="w-10 h-10 text-secondary" />
      </div>
      
      <h1 className="text-3xl font-black text-white mb-4">Challenge a Friend</h1>
      
      {!challengeCode ? (
        <div className="glass-card p-8 mt-8 text-left">
          <p className="text-text-secondary mb-6 leading-relaxed">
            Create a custom match with 5 random songs. We'll generate a unique link for you to share. 
            Play the game first, then send the link to a friend to see if they can beat your score!
          </p>
          <button 
            onClick={handleCreate} 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg font-bold"
          >
            {loading ? 'Creating...' : 'Generate Challenge Link'}
          </button>
        </div>
      ) : (
        <div className="glass-card p-8 mt-8 animate-scaleIn">
          <h3 className="font-bold text-success mb-2 text-xl">Challenge Created!</h3>
          <p className="text-text-secondary mb-8">Share this link with your friend.</p>
          
          <div className="bg-surface/50 border border-white/10 p-4 rounded-xl flex items-center gap-4 mb-6">
            <input 
              type="text" 
              readOnly 
              value={shareUrl} 
              className="bg-transparent border-none w-full outline-none text-text-secondary font-mono"
            />
            <button 
              onClick={handleCopy}
              className="p-3 bg-surface-hover hover:bg-surface border border-border rounded-lg transition-colors text-white"
            >
              {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <button 
            onClick={() => window.location.href = `/challenge/${challengeCode}`}
            className="btn-outline w-full py-3"
          >
            Play Your Turn Now
          </button>
        </div>
      )}

    </div>
  );
};

export default CreateChallengePage;
