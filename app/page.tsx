'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LZString from 'lz-string';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isShared, setIsShared] = useState(false);
  
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

  // URL Hydration logic - Truly Permanent
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadDataFromUrl = () => {
      const getShareData = () => {
        const href = window.location.href;
        const match = href.match(/[?&#]c=([^&#]*)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
        return null;
      };

      const data = getShareData();
      
      if (data) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(data) 
            || LZString.decompress(data);

          if (decompressed) {
            const parsed = JSON.parse(decompressed);
            // Apply state updates
            setTimeout(() => {
              setFrontText(parsed.f || "Happy Birthday!");
              setSurpriseText(parsed.s || "You are Loved!");
              setCards(parsed.c || []);
              setSelectedSkinId(parsed.sk || 'classic');
              setIsShared(true);
              setIsFinished(false);
              setAppState('preview');
              setIsLoading(false);
            }, 50);
          } else {
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Error loading shared card:', err);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadDataFromUrl();
    window.addEventListener('hashchange', loadDataFromUrl);
    return () => window.removeEventListener('hashchange', loadDataFromUrl);
  }, []);

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

  const handleGenerateShare = () => {
    const data = {
      f: frontText,
      s: surpriseText,
      c: cards,
      sk: selectedSkinId
    };
    const serialized = LZString.compressToEncodedURIComponent(JSON.stringify(data));
    // Data is part of the link = Never Expires
    const url = `${window.location.origin}${window.location.pathname}#c=${serialized}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
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
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif italic text-[#D4AF37]">Opening your surprise...</p>
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
                onEdit={isShared ? undefined : handleEdit}
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
