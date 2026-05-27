'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopePage } from './EnvelopePage';
import { CardSwiper } from './CardSwiper';
import { Confetti } from './Confetti';
import { Skin } from '../data/skins';
import { Card } from '../data/cards';

interface OrigamiModeProps {
  frontText: string;
  surpriseText: string;
  cards: Card[];
  skin: Skin;
  onEdit?: () => void;
}

export function OrigamiMode({ frontText, surpriseText, cards, skin, onEdit }: OrigamiModeProps) {
  const [isFinished, setIsFinished] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  return (
    <div className="w-full h-full relative">
      {isFinished && <Confetti />}
      
      <EnvelopePage 
        onOpen={() => setIsEnvelopeOpen(true)} 
        isOpen={isEnvelopeOpen}
        isFinished={isFinished}
        frontText={frontText}
        surpriseText={surpriseText}
        onEdit={onEdit}
        skin={skin}
      >
        {isEnvelopeOpen && !isFinished && (
          <CardSwiper 
            cards={cards} 
            onAllCardsRemoved={() => setIsFinished(true)}
            skin={skin}
          />
        )}
      </EnvelopePage>
    </div>
  );
}
