'use client';

import { motion } from 'framer-motion';
import { BookOpen, Mail, Cake, ArrowRight } from 'lucide-react';

export type AppMode = 'TRADITIONAL' | 'ORIGAMI' | 'BIRTHDAY_WISH';

interface WelcomePageProps {
  onSelectMode: (mode: AppMode) => void;
}

const MODES = [
  {
    id: 'TRADITIONAL' as AppMode,
    title: 'Traditional Fold',
    description: 'A simple, elegant paper greeting card folded in half. Opens flat to reveal a two-page layout: one full-page photo on the left, and a heartfelt message on the right. Holds 1 photo.',
    icon: BookOpen,
    price: 'FREE',
    accent: 'bg-[#8F9779]', // Sage
  },
  {
    id: 'ORIGAMI' as AppMode,
    title: 'Origami Letterpress',
    description: 'Our signature experience. A beautiful 2D folded square secured with a ribbon that realistically unpacks and unfolds into a large canvas. Features dynamic multi-card swiping and a hidden message.',
    icon: Mail,
    price: '59 Baht',
    accent: 'bg-[#B5838D]', // Dusty Rose
  },
  {
    id: 'BIRTHDAY_WISH' as AppMode,
    title: 'The Birthday Wish',
    description: 'An interactive digital celebration. Features a customizable 2D birthday cake where the recipient can tap to blow out the candles, unlocking an automated sliding photo slideshow.',
    icon: Cake,
    price: '35 Baht',
    accent: 'bg-[#A8A29E]', // Stone
  }
];

export function WelcomePage({ onSelectMode }: WelcomePageProps) {
  return (
    <div className="min-h-screen w-full bg-[#F9F7F2] flex flex-col items-center justify-center p-6 md:p-12 text-[#2D2D2D]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-light tracking-tighter uppercase">FoldedHeart</h1>
        <div className="w-12 h-0.5 bg-[#2D2D2D] mx-auto opacity-20" />
        <p className="text-[#8A817C] font-serif italic text-lg max-w-md mx-auto">
          Choose an experience to start crafting your digital keepsake.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {MODES.map((mode, idx) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectMode(mode.id)}
            className="group relative flex flex-col items-start text-left bg-white border border-[#E8E2D9] rounded-3xl p-8 hover:border-[#2D2D2D] transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-white ${mode.accent}`}>
              {mode.price}
            </div>

            {/* Icon */}
            <div className="mb-8 p-4 bg-[#F9F7F2] rounded-2xl group-hover:bg-[#2D2D2D] group-hover:text-white transition-colors">
              <mode.icon size={32} strokeWidth={1} />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-serif italic font-bold leading-none">{mode.title}</h2>
              <p className="text-sm text-[#8A817C] leading-relaxed font-light">
                {mode.description}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
              <span>Start Creating</span>
              <ArrowRight size={16} strokeWidth={3} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer Decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
        className="mt-20 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40"
      >
        Artisanal Digital Keepsakes
      </motion.div>
    </div>
  );
}
