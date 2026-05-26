'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { EnvelopePage } from '../../components/EnvelopePage';
import { CardSwiper } from '../../components/CardSwiper';
import { Confetti } from '../../components/Confetti';
import { SKINS } from '../../data/skins';
import { CardConfig } from '../../lib/db';

export default function SharedCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [cardData, setCardConfig] = useState<CardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${id}`);
        if (!res.ok) throw new Error('Card not found');
        const data = await res.json();
        setCardConfig(data);

        // Check if current user is the owner
        const storedToken = localStorage.getItem(`card_owner_${id}`);
        if (storedToken === data.ownerToken) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('This card doesn\'t exist or has expired.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem(`card_owner_${id}`);
      const res = await fetch(`/api/cards/${id}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        alert('Card deleted successfully.');
        window.location.href = '/';
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      alert('Error deleting card. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const activeSkin = SKINS.find(s => s.id === cardData?.skinId) || SKINS[0];

  if (isLoading || isDeleting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3F0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif italic text-[#D4AF37]">
            {isDeleting ? 'Deleting your card...' : 'Opening your surprise...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3F0] p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-serif italic text-[#5D554D]">Oops!</h2>
          <p className="text-[#8A817C] font-serif italic">{error}</p>
          <Link href="/" className="inline-block mt-4 text-[#D4AF37] font-bold border-b border-[#D4AF37]">Create your own card</Link>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen relative flex items-center justify-center transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: activeSkin.colors.bg }}
    >
      {/* Owner Management Overlay */}
      {isOwner && !isFinished && (
        <div className="absolute top-6 left-6 z-50">
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg shadow-sm hover:bg-red-100 transition-colors font-serif italic text-sm flex items-center gap-2"
          >
            🗑 Delete My Card
          </button>
        </div>
      )}

      {isFinished && <Confetti />}
      <AnimatePresence mode="wait">
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full"
        >
          <EnvelopePage 
            isFinished={isFinished}
            frontText={cardData.frontText}
            surpriseText={cardData.surpriseText}
            skin={activeSkin}
          >
            {!isFinished && (
              <CardSwiper 
                cards={cardData.cards} 
                onAllCardsRemoved={() => setIsFinished(true)}
                skin={activeSkin}
              />
            )}
          </EnvelopePage>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
