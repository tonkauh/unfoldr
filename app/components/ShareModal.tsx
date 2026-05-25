'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, Eye } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  onPreview: () => void;
}

export function ShareModal({ isOpen, onClose, shareUrl, onPreview }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-[#FFFDFB] rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D9] text-[#5D554D]"
          >
            <div className="p-6 border-b border-[#E8E2D9] flex items-center justify-between">
              <h2 className="text-2xl font-serif italic font-bold">Send it to someone!</h2>
              <button onClick={onClose} className="p-1 hover:bg-[#F7F3F0] rounded-full transition-colors">
                <X size={20} className="text-[#8A817C]" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Your Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#FBF9F7] border border-[#E8E2D9] rounded-xl px-4 py-3 text-sm font-sans focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 rounded-xl transition-all flex items-center gap-2 font-bold text-sm ${
                      copied ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-white hover:bg-[#C5A028]'
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[10px] text-red-500/70 italic leading-tight">
                  ⚠️ Important: If you added large high-res photos, the link might be too long for some apps (like LINE or Messenger). Try using smaller images if the link doesn't open.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={onPreview}
                  className="w-full py-4 bg-[#5D554D] text-[#FFFDFB] font-serif italic font-bold text-lg rounded-2xl shadow-lg hover:bg-[#4A443F] transition-all flex items-center justify-center gap-3"
                >
                  <Eye size={20} /> Preview My Card
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white border border-[#E8E2D9] text-[#8A817C] font-serif italic rounded-2xl hover:bg-[#F7F3F0] transition-all"
                >
                  Close & Back to Editor
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
