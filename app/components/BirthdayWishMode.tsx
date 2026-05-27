'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Skin } from '../data/skins';
import { Card } from '../data/cards';
import { Confetti } from './Confetti';

import { CAKE_FLAVORS, ICING_COLORS, CakeConfig } from '../data/cake';

import { CakeVisual } from './CakeVisual';

interface BirthdayWishModeProps {
  cards: Card[];
  skin: Skin;
  onEdit?: () => void;
  cakeConfig?: CakeConfig;
}

export function BirthdayWishMode({ cards, skin, onEdit, cakeConfig }: BirthdayWishModeProps) {
  const [extinguishedCount, setExtinguishedCount] = useState(0);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const config: CakeConfig = cakeConfig || {
    flavor: 'vanilla',
    icingColor: 'pink',
    topping: 'sprinkles',
    candleCount: 3
  };

  const handleExtinguish = () => {
    setExtinguishedCount(prev => {
      const next = prev + 1;
      if (next === config.candleCount) {
        setTimeout(() => setShowSlideshow(true), 1500);
      }
      return next;
    });
  };

  useEffect(() => {
    if (showSlideshow && !isFinished) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === cards.length - 1) {
            clearInterval(interval);
            setTimeout(() => setIsFinished(true), 3000);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showSlideshow, isFinished, cards.length]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E8E2D9] text-[#8A817C] rounded-lg shadow-sm z-50 font-serif italic text-sm"
        >
          ✎ Edit Card
        </button>
      )}

      <AnimatePresence mode="wait">
        {!showSlideshow ? (
          <motion.div 
            key="cake"
            exit={{ y: 300, opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center gap-16 md:scale-110"
          >
            <div className="relative group cursor-crosshair">
               <CakeVisual 
                 config={config} 
                 extinguishedCount={extinguishedCount} 
                 onExtinguish={handleExtinguish} 
               />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.6em] opacity-40 text-center animate-pulse">
              Extinguish the flames<br/>to reveal memories
            </p>
          </motion.div>
        ) : !isFinished ? (
          <motion.div 
            key="slideshow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl aspect-video relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: skin.colors.paper }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={cards[currentIndex]?.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-full h-2/3 mb-8 rounded-xl overflow-hidden">
                   {cards[currentIndex]?.imageUrl ? (
                     <img src={cards[currentIndex].imageUrl} alt="Memory" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: cards[currentIndex]?.bgSolid }}>
                        <ImageIcon size={48} className="opacity-10" />
                     </div>
                   )}
                </div>
                <h3 className="text-3xl font-sans font-bold text-[#2D2D2D] leading-tight">
                  {cards[currentIndex]?.message}
                </h3>
              </motion.div>
            </AnimatePresence>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
              <motion.div 
                className="h-full"
                style={{ backgroundColor: skin.colors.ribbon }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                key={currentIndex}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="final"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8"
          >
            <h1 className="text-6xl font-sans font-bold uppercase tracking-tighter text-[#2D2D2D]">
              Happy Birthday
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
