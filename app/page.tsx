'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopePage } from './components/EnvelopePage';
import { CardSwiper } from './components/CardSwiper';
import { Confetti } from './components/Confetti';
import { EditorPanel } from './components/EditorPanel';
import { ShareModal } from './components/ShareModal';
import { PaywallModal } from './components/PaywallModal';
import { CARDS, Card } from './data/cards';
import { SKINS, Skin } from './data/skins';

type AppState = 'editor' | 'preview';

export default function BirthdayCard() {
  const [appState, setAppState] = useState<AppState>('editor');
  const [isFinished, setIsFinished] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Customization State
  const [frontText, setFrontText] = useState("I love you, Happy Birthday!");
  const [surpriseText, setSurpriseText] = useState("You are Loved! ❤️");
  const [cards, setCards] = useState<Card[]>([CARDS[0]]);
  const [selectedSkinId, setSelectedSkinId] = useState('classic');

  // Monetization State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>([]);
  const [paywallConfig, setPaywallConfig] = useState<{
    isOpen: boolean;
    type: 'SKIN' | 'SUBSCRIPTION';
    skin?: Skin;
  }>({ isOpen: false, type: 'SUBSCRIPTION' });

  const activeSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  const handleAllCardsRemoved = () => {
    setIsFinished(true);
  };

  const handlePreview = () => {
    setIsFinished(false);
    setIsShareModalOpen(false);
    setAppState('preview');
  };

  const handleEdit = () => {
    setAppState('editor');
  };

  const handleGenerateShare = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frontText,
          surpriseText,
          cards,
          skinId: selectedSkinId
        }),
      });

      if (!res.ok) throw new Error('Failed to publish');
      
      const { id } = await res.json();
      const url = `${window.location.origin}/card/${id}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (err) {
      console.error('Publishing failed:', err);
      alert('Failed to publish your card. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTriggerPaywall = (type: 'SKIN' | 'SUBSCRIPTION', skin?: Skin) => {
    setPaywallConfig({ isOpen: true, type, skin });
  };

  const handleUnlock = () => {
    if (paywallConfig.type === 'SKIN' && paywallConfig.skin) {
      setUnlockedSkins(prev => [...prev, paywallConfig.skin!.id]);
      setSelectedSkinId(paywallConfig.skin.id);
    } else {
      setIsSubscribed(true);
    }
    setPaywallConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <main 
      className="min-h-screen relative flex items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: activeSkin.colors.bg }}
    >
      {isPublishing ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif italic text-[#D4AF37]">Generating your unique card...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {appState === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex justify-center p-4"
            >
              <EditorPanel 
                frontText={frontText}
                setFrontText={setFrontText}
                surpriseText={surpriseText}
                setSurpriseText={setSurpriseText}
                cards={cards}
                setCards={setCards}
                onPreview={handleGenerateShare}
                selectedSkinId={selectedSkinId}
                setSelectedSkinId={setSelectedSkinId}
                isSubscribed={isSubscribed}
                unlockedSkins={unlockedSkins}
                onTriggerPaywall={handleTriggerPaywall}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              {isFinished && <Confetti />}
              <EnvelopePage 
                isFinished={isFinished}
                frontText={frontText}
                surpriseText={surpriseText}
                onEdit={handleEdit}
                skin={activeSkin}
              >
                {!isFinished && cards.length > 0 && (
                  <CardSwiper 
                    cards={cards} 
                    onAllCardsRemoved={handleAllCardsRemoved}
                    skin={activeSkin}
                  />
                )}
              </EnvelopePage>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        onPreview={handlePreview}
      />

      <PaywallModal 
        isOpen={paywallConfig.isOpen}
        onClose={() => setPaywallConfig(prev => ({ ...prev, isOpen: false }))}
        type={paywallConfig.type}
        itemName={paywallConfig.skin?.name}
        price={paywallConfig.skin?.price}
        onUnlock={handleUnlock}
      />
    </main>
  );
}
