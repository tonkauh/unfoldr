'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Heart } from 'lucide-react';
import { Skin } from '../data/skins';
import { Card } from '../data/cards';

interface TraditionalModeProps {
  frontText: string;
  surpriseText: string;
  cards: Card[];
  skin: Skin;
  onEdit?: () => void;
}

export function TraditionalMode({ frontText, surpriseText, cards, skin, onEdit }: TraditionalModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mainPhoto = cards[0];

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E8E2D9] text-[#8A817C] rounded-lg shadow-sm z-50 font-serif italic text-sm"
        >
          ✎ Edit Card
        </button>
      )}

      <div className="relative w-full max-w-lg aspect-[1/1.4] md:aspect-[1.4/1] flex items-center justify-center perspective-[2000px]">
        {/* Shadow */}
        <div className="absolute inset-0 bg-black/5 blur-3xl transform translate-y-8 scale-90" />

        {/* The Card Container - Holds both halves */}
        <div className="relative w-[300px] h-[420px] md:w-[600px] md:h-[420px]">
          
          {/* Right Page / Interior Base (Static) */}
          <div 
            className="absolute right-0 w-full md:w-1/2 h-full rounded-r-2xl shadow-xl flex flex-col items-center justify-center p-8 md:p-12 text-center z-10"
            style={{ backgroundColor: skin.colors.paper }}
          >
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-xs space-y-6"
                >
                  <h2 
                    className="text-3xl md:text-4xl font-sans font-bold leading-tight"
                    style={{ color: skin.colors.text }}
                  >
                    {surpriseText}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Folding Page (Cover + Left Interior) */}
          <motion.div 
            className="absolute right-0 w-full md:w-1/2 h-full z-20 origin-left cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Front Cover (Visible when closed) */}
            <div 
              className="absolute inset-0 backface-hidden rounded-r-2xl md:rounded-l-none md:rounded-r-2xl shadow-2xl flex flex-col items-center justify-center p-8 text-center"
              style={{ backgroundColor: skin.colors.paper }}
            >
              <h1 
                className="text-3xl font-sans leading-relaxed"
                style={{ color: skin.colors.text }}
              >
                {frontText}
              </h1>
            </div>

            {/* Left Inside Page (Visible when open) */}
            <div 
              className="absolute inset-0 rounded-l-2xl shadow-inner flex items-center justify-center p-8 md:p-12"
              style={{ 
                backgroundColor: skin.colors.paper,
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div 
                className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: mainPhoto?.bgSolid || '#F3F4F6' }}
              >
                {mainPhoto?.imageUrl ? (
                  <img src={mainPhoto.imageUrl} alt="Memory" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={64} className="opacity-10" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.4em]"
          >
            Click to open
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
