'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, Eye, Share2 } from 'lucide-react';
import { ToastType } from './Toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  onPreview: () => void;
  onToast?: (message: string, type: ToastType, duration?: number) => void;
}

export function ShareModal({ isOpen, onClose, shareUrl, onPreview, onToast }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onToast?.('✨ Link copied to clipboard!', 'success', 2000);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      onToast?.('Failed to copy link', 'error', 2000);
    }
  };

  const shareVia = async (platform: 'whatsapp' | 'email' | 'facebook') => {
    const text = 'Check out this beautiful birthday card I created!';
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Birthday Card for You!')}&body=${encodeURIComponent(text + '\n' + shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      onToast?.(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 'success', 2000);
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
            className="w-full max-w-md bg-[#FFFDFB] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D9] text-[#5D554D]"
          >
            <div className="p-4 md:p-6 border-b border-[#E8E2D9] flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-serif italic font-bold">Send it to someone!</h2>
              <button onClick={onClose} className="p-1 hover:bg-[#F7F3F0] rounded-full transition-colors">
                <X size={20} className="text-[#8A817C]" />
              </button>
            </div>

            <div className="p-4 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Your Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#FBF9F7] border border-[#E8E2D9] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-sans focus:outline-none overflow-hidden text-ellipsis whitespace-nowrap"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 md:px-4 rounded-lg md:rounded-xl transition-all flex items-center gap-1 md:gap-2 font-bold text-xs md:text-sm ${
                      copied ? 'bg-green-500 text-white' : 'bg-[#D4AF37] text-white hover:bg-[#C5A028]'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[8px] md:text-[10px] text-yellow-600/70 italic leading-tight">
                  ⚠️ Pro tip: If the link is very long (due to large photos), try using smaller images.
                </p>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2">
                <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Share Via</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => shareVia('whatsapp')}
                    className="py-3 bg-green-500 text-white rounded-lg font-bold text-xs transition-all hover:bg-green-600 active:scale-95"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareVia('email')}
                    className="py-3 bg-blue-500 text-white rounded-lg font-bold text-xs transition-all hover:bg-blue-600 active:scale-95"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => shareVia('facebook')}
                    className="py-3 bg-blue-700 text-white rounded-lg font-bold text-xs transition-all hover:bg-blue-800 active:scale-95"
                  >
                    Facebook
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={onPreview}
                  className="w-full py-3 md:py-4 bg-[#5D554D] text-[#FFFDFB] font-serif italic font-bold text-sm md:text-lg rounded-lg md:rounded-2xl shadow-lg hover:bg-[#4A443F] transition-all flex items-center justify-center gap-2 md:gap-3"
                >
                  <Eye size={18} className="md:size-[20px]" /> Preview My Card
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 md:py-4 bg-white border border-[#E8E2D9] text-[#8A817C] font-serif italic rounded-lg md:rounded-2xl hover:bg-[#F7F3F0] transition-all text-sm md:text-base"
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
