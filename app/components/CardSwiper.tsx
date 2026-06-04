'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Card } from '../data/cards';
import { Heart, Image as ImageIcon } from 'lucide-react';
import { Skin } from '../data/skins';

interface CardSwiperProps {
  cards: Card[];
  onAllCardsRemoved: () => void;
  skin: Skin;
}

interface SwipeableCardProps {
  card: Card;
  isTop: boolean;
  baseRotation: number;
  onSwipeOff: () => void;
  skin: Skin;
}

function SwipeableCard({ card, isTop, baseRotation, onSwipeOff, skin }: SwipeableCardProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      onSwipeOff();
    }
  };

  return (
    <motion.div
      key={card.id}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 15, rotate: baseRotation }}
      animate={{ 
        scale: isTop ? 1 : 0.96,
        opacity: 1,
        y: isTop ? 0 : 3,
        rotate: prefersReducedMotion ? 0 : isTop ? rotate.get() : baseRotation
      }}
      exit={{ 
        x: x.get() > 0 ? 600 : -600, 
        opacity: 0, 
        rotate: x.get() > 0 ? 30 : -30,
        transition: { type: "spring", stiffness: 40, damping: 12 } 
      }}
      className="absolute inset-0 shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-between cursor-grab active:cursor-grabbing border-2"
      style={{ 
        backgroundColor: skin.colors.paper,
        borderColor: `${skin.colors.accent}40`,
        x,
        rotate: prefersReducedMotion ? 0 : rotate,
        opacity,
        zIndex: isTop ? 100 : 10,
        clipPath: 'polygon(2% 1%, 98% 0.5%, 100% 2%, 99.5% 98%, 98% 100%, 2% 99.5%, 0% 98%, 0.5% 2%)'
      }}
    >
      {/* Texture layers - use CSS fallback instead of external URLs for better performance */}
      {skin.texture === 'handmade-paper' && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ 
          background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)'
        }} />
      )}
      {skin.texture === 'kraft-paper' && (
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)'
        }} />
      )}
      {skin.texture === 'noise' && (
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '2px 2px'
        }} />
      )}

      <div 
        className={`w-full aspect-[4/3] flex items-center justify-center overflow-hidden shadow-inner relative group rounded-sm`}
        style={{ backgroundColor: card.bgSolid }}
      >
        {card.imageUrl ? (
          <img 
            src={card.imageUrl} 
            alt="Memory" 
            className="w-full h-full object-cover grayscale-[0.1] contrast-[0.9]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-4xl sm:text-6xl drop-shadow-md opacity-10">
            <ImageIcon size={48} />
          </span>
        )}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex-1 flex items-center justify-center text-center px-2 sm:px-4 py-3 sm:py-6">
        <p 
          className="text-lg sm:text-2xl font-serif italic leading-relaxed tracking-tight"
          style={{ color: skin.colors.text }}
        >
          {card.message}
        </p>
      </div>

      <div className="w-full flex justify-between items-center opacity-40 border-t border-black/5 pt-2 sm:pt-4">
        <Heart size={16} className="sm:size-[20px]" style={{ color: skin.colors.accent }} />
        <span 
          className="text-[8px] sm:text-[10px] font-serif uppercase tracking-[0.2em]"
          style={{ color: skin.colors.accent }}
        >
          Memory No. {card.id.toString().slice(-4)}
        </span>
        <Heart size={16} className="sm:size-[20px]" style={{ color: skin.colors.accent }} />
      </div>
    </motion.div>
  );
}

export function CardSwiper({ cards, onAllCardsRemoved, skin }: CardSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardRotations] = useState(() => cards.map(() => (Math.random() * 4 - 2)));

  const handleSwipeOff = () => {
    if (currentIndex === cards.length - 1) {
      onAllCardsRemoved();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center select-none p-4 sm:p-8">
      <div className="relative w-full h-[85%] max-h-[600px]">
        <AnimatePresence mode="popLayout">
          {cards.slice(currentIndex, currentIndex + 2).reverse().map((card, index, array) => {
            const isTop = index === array.length - 1;
            const originalIndex = currentIndex + (array.length - 1 - index);
            const baseRotation = cardRotations[originalIndex];
            
            return (
              <SwipeableCard
                key={card.id}
                card={card}
                isTop={isTop}
                baseRotation={baseRotation}
                onSwipeOff={handleSwipeOff}
                skin={skin}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
