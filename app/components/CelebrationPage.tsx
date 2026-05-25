'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Confetti } from './Confetti';
import { Gift, Heart, PartyPopper, Sparkles } from 'lucide-react';

interface CelebrationPageProps {
  onRestart: () => void;
}

export function CelebrationPage({ onRestart }: CelebrationPageProps) {
  const [backgroundShapes] = useState(() => {
    return [...Array(6)].map((_, i) => ({
      id: i,
      width: Math.random() * 40 + 20,
      height: Math.random() * 40 + 20,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 2,
    }));
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F7F3F0] p-4 overflow-hidden relative">
      <Confetti />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Animated Icons */}
        <div className="flex gap-4 mb-8">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <PartyPopper size={48} className="text-[#D4AF37]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          >
            <Gift size={48} className="text-[#D4AF37]" />
          </motion.div>
        </div>

        {/* Celebratory Message */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <h1 className="text-6xl md:text-7xl font-serif italic font-bold text-[#D4AF37] leading-tight mb-8 drop-shadow-sm">
            You are Loved!
          </h1>
        </motion.div>

        {/* Message Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FFFDFB] border border-[#E8E2D9] rounded-sm p-10 shadow-xl relative"
        >
          {/* Decorative Corner Icons */}
          <div className="absolute -top-4 -left-4 bg-[#D4AF37] text-white p-2 rounded-full rotate-[-15deg] shadow-md">
            <Sparkles size={24} />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[#D4AF37] text-white p-2 rounded-full rotate-[15deg] shadow-md">
            <Heart size={24} fill="currentColor" />
          </div>

          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

          <p className="text-3xl font-serif italic text-[#5D554D] mb-6">
            A Special Day for a Special Someone
          </p>
          <p className="text-xl text-[#5D554D]/80 leading-relaxed font-serif italic">
            Thank you for being part of my life. I hope these memories brought a smile to your face. May your day be as beautiful and unique as you are!
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onRestart}
          className="mt-14 px-12 py-4 bg-[#D4AF37] text-white font-serif italic font-bold text-2xl rounded-sm shadow-lg hover:bg-[#C5A028] transition-all transform hover:scale-105 active:scale-95"
        >
          Reminisce Again
        </motion.button>
      </div>

      {/* Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {backgroundShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute bg-[#D4AF37] rounded-full"
            style={{
              width: shape.width,
              height: shape.height,
              left: shape.left,
              top: shape.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              delay: shape.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
