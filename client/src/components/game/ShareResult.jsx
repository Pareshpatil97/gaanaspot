import React from 'react';
import Modal from '../ui/Modal';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { generateShareText } from '../../utils/formatters';

const ShareResult = ({ isOpen, onClose, game }) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const shareText = generateShareText(game);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      addToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Result">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full bg-background p-6 rounded-xl font-mono text-sm leading-relaxed whitespace-pre text-center border border-border">
          {shareText}
        </div>
        
        <button 
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
            copied ? 'bg-success text-white' : 'btn-primary'
          }`}
        >
          {copied ? (
            <><Check className="w-5 h-5" /> Copied!</>
          ) : (
            <><Copy className="w-5 h-5" /> Copy Result</>
          )}
        </button>
      </div>
    </Modal>
  );
};

// Also inject missing import in ShareResult
import { useState } from 'react';
export default ShareResult;
