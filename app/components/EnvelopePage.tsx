'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skin } from '../data/skins';

interface EnvelopePageProps {
  onOpen?: () => void;
  isOpen?: boolean;
  children?: React.ReactNode;
  isFinished?: boolean;
  frontText?: string;
  surpriseText?: string;
  onEdit?: () => void;
  skin: Skin;
}

export function EnvelopePage({ 
  onOpen, 
  isOpen = false, 
  children, 
  isFinished = false,
  frontText = "I love you, Happy Birthday!",
  surpriseText = "You are Loved! ❤️",
  onEdit,
  skin
}: EnvelopePageProps) {
  const [phase, setPhase] = useState<'closed' | 'untying' | 'unfolding' | 'opened'>(isOpen ? 'opened' : 'closed');

  const handleStartOpen = () => {
    if (phase !== 'closed' || isOpen) return;
    setPhase('untying');
    
    setTimeout(() => {
      setPhase('unfolding');
      setTimeout(() => {
        setPhase('opened');
        if (onOpen) onOpen();
      }, 1200);
    }, 800);
  };

  const containerVariants = {
    closed: { rotate: -3, scale: 0.85, width: 280, height: 280 },
    untying: { rotate: -3, scale: 0.85, width: 280, height: 280 },
    unfolding: { 
      rotate: 0, 
      scale: 1, 
      width: 360, 
      height: 520,
      transition: { type: "spring", stiffness: 50, damping: 15 }
    },
    opened: { rotate: 0, scale: 1, width: 360, height: 520 }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {onEdit && (
        <button 
          onClick={onEdit}
          className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-sm border border-[#E8E2D9] text-[#8A817C] rounded-lg shadow-sm hover:bg-white transition-colors z-50 font-serif italic text-sm"
        >
          ✎ Edit Card
        </button>
      )}

      <motion.div 
        variants={containerVariants}
        animate={phase}
        initial="closed"
        className="relative flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/10 blur-3xl rounded-sm transform translate-y-4 scale-95" />

        <div className="relative w-full h-full">
          {/* Main Paper Sheet */}
          <div 
            className="absolute inset-0 shadow-lg border border-white/10 rounded-sm overflow-hidden z-10"
            style={{ backgroundColor: skin.colors.paper }}
          >
            {skin.texture === 'handmade-paper' && (
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
            )}
            {skin.texture === 'pinstripe' && (
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
            )}
            {skin.texture === 'kraft-paper' && (
              <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]" />
            )}
            {skin.texture === 'noise' && (
              <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: (phase === 'unfolding' || phase === 'opened') ? 1 : 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-1/2 left-0 w-full h-px bg-black/5" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-black/5" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isFinished ? 1 : 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
               <div className="max-w-xs">
                 <h2 
                   className="text-4xl font-serif italic font-bold mb-6 leading-tight"
                   style={{ color: skin.colors.ribbon }}
                 >
                   {surpriseText}
                 </h2>
                 <p 
                   className="text-lg font-serif italic opacity-80"
                   style={{ color: skin.colors.text }}
                 >
                   Thank you for every moment we share.
                 </p>
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: (phase === 'unfolding' || phase === 'opened') ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="w-full h-full relative z-20"
            >
              {children}
            </motion.div>
          </div>

          {/* Folding Flaps */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1 }}
              animate={{ 
                rotateX: phase === 'unfolding' || phase === 'opened' ? (i < 2 ? (i === 0 ? -180 : 180) : 0) : 0,
                rotateY: phase === 'unfolding' || phase === 'opened' ? (i >= 2 ? (i === 2 ? -180 : 180) : 0) : 0,
                opacity: phase === 'opened' ? 0 : 1,
              }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 }}
              className={`absolute inset-0 z-30 pointer-events-none border border-white/5`}
              style={{ 
                backgroundColor: skin.colors.paper,
                clipPath: i === 0 ? 'polygon(0 0, 100% 0, 50% 50%)' :
                          i === 1 ? 'polygon(0 100%, 100% 100%, 50% 50%)' :
                          i === 2 ? 'polygon(0 0, 0 100%, 50% 50%)' :
                                    'polygon(100% 0, 100% 100%, 50% 50%)',
                originX: i === 2 ? '0%' : i === 3 ? '100%' : '50%',
                originY: i === 0 ? '0%' : i === 1 ? '100%' : '50%',
                backfaceVisibility: 'hidden'
              }}
            >
              {skin.texture === 'handmade-paper' && (
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
              )}
              {skin.texture === 'kraft-paper' && (
                <div className="absolute inset-0 opacity-[0.1] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')]" />
              )}
              {skin.texture === 'noise' && (
                <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              )}
            </motion.div>
          ))}

          {phase === 'closed' && (
            <div 
              className="absolute inset-0 z-50 cursor-pointer"
              onClick={handleStartOpen}
            />
          )}

          <AnimatePresence>
            {(phase === 'closed' || phase === 'untying') && (
              <motion.div 
                className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center"
                exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.6 } }}
              >
                <motion.div 
                  className="absolute w-full h-7 backdrop-blur-[1px] shadow-sm -translate-y-1/2 top-1/2"
                  style={{ backgroundColor: `${skin.colors.ribbon}CC` }}
                  animate={phase === 'untying' ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 z-50"
                  animate={phase === 'untying' ? { scale: 0, rotate: 15, y: -20 } : { scale: 1, rotate: 0, y: 0 }}
                  transition={{ type: "spring", damping: 12 }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl" style={{ color: skin.colors.ribbon }}>
                    <path d="M50 50 L 35 85 L 25 80 L 45 50" fill="currentColor" opacity="0.8" />
                    <path d="M50 50 L 65 85 L 75 80 L 55 50" fill="currentColor" opacity="0.8" />
                    <path d="M50 50 C 10 20, 0 60, 50 50" fill="currentColor" stroke="white" strokeWidth="0.5" />
                    <path d="M50 50 C 90 20, 100 60, 50 50" fill="currentColor" stroke="white" strokeWidth="0.5" />
                    <rect x="42" y="44" width="16" height="12" rx="4" fill="currentColor" stroke="white" strokeWidth="0.5" />
                  </svg>
                </motion.div>

                <motion.div 
                  className="absolute top-[15%] left-0 right-0 flex items-center justify-center text-center px-6 z-[45]"
                  animate={phase === 'untying' ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                >
                  <h1 
                    className="text-2xl font-serif italic drop-shadow-sm leading-tight max-w-[85%]"
                    style={{ color: skin.colors.text }}
                  >
                    {frontText}
                  </h1>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
