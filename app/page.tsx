'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LZString from 'lz-string';
import { WelcomePage, AppMode } from './components/WelcomePage';
import { TraditionalMode } from './components/TraditionalMode';
import { OrigamiMode } from './components/OrigamiMode';
import { BirthdayWishMode } from './components/BirthdayWishMode';
import { CakeEditor } from './components/CakeEditor';
import { EditorPanel } from './components/EditorPanel';
import { ShareModal } from './components/ShareModal';
import { PaywallModal } from './components/PaywallModal';
import { CARDS, Card } from './data/cards';
import { SKINS, Skin } from './data/skins';
import { CakeConfig } from './data/cake';

type AppState = 'welcome' | 'editor' | 'cake_editor' | 'preview';

export default function BirthdayCard() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentMode, setCurrentMode] = useState<AppMode>('ORIGAMI');
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isShared, setIsShared] = useState(false);
  
  // Customization State
  const [frontText, setFrontText] = useState("I love you, Happy Birthday!");
  const [surpriseText, setSurpriseText] = useState("You are Loved! ❤️");
  const [cards, setCards] = useState<Card[]>([CARDS[0]]);
  const [selectedSkinId, setSelectedSkinId] = useState('classic');
  const [cakeConfig, setCakeConfig] = useState<CakeConfig>({
    flavor: 'vanilla',
    icingColor: 'pink',
    topping: 'sprinkles',
    candleCount: 3,
  });

  // Monetization State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>([]);
  const [paywallConfig, setPaywallConfig] = useState<{
    isOpen: boolean;
    type: 'SKIN' | 'SUBSCRIPTION';
    skin?: Skin;
  }>({ isOpen: false, type: 'SUBSCRIPTION' });

  const activeSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  // URL Hydration logic
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
            setTimeout(() => {
              setFrontText(parsed.f || "Happy Birthday!");
              setSurpriseText(parsed.s || "You are Loved!");
              setCards(parsed.c || []);
              setSelectedSkinId(parsed.sk || 'classic');
              setCurrentMode(parsed.m || 'ORIGAMI');
              if (parsed.ck) setCakeConfig(parsed.ck);
              setIsShared(true);
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

  const handleSelectMode = (mode: AppMode) => {
    setCurrentMode(mode);
    if (mode === 'BIRTHDAY_WISH') {
      setAppState('cake_editor');
    } else {
      setAppState('editor');
    }
    // Ensure card count is correct for mode
    if (mode === 'TRADITIONAL' && cards.length > 1) {
      setCards([cards[0]]);
    }
  };

  const handlePreview = () => {
    setIsShareModalOpen(false);
    setAppState('preview');
  };

  const handleEdit = () => {
    if (currentMode === 'BIRTHDAY_WISH') {
      setAppState('cake_editor');
    } else {
      setAppState('editor');
    }
  };

  const handleGenerateShare = () => {
    const data = {
      f: frontText,
      s: surpriseText,
      c: cards,
      sk: selectedSkinId,
      m: currentMode,
      ck: cakeConfig
    };
    const serialized = LZString.compressToEncodedURIComponent(JSON.stringify(data));
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
      className="min-h-screen relative flex items-center justify-center transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: appState === 'welcome' ? '#F9F7F2' : activeSkin.colors.bg }}
    >
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif italic text-[#D4AF37]">Preparing your surprise...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {appState === 'welcome' ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <WelcomePage onSelectMode={handleSelectMode} />
            </motion.div>
          ) : appState === 'cake_editor' ? (
            <motion.div
              key="cake_editor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex justify-center p-4"
            >
              <CakeEditor 
                config={cakeConfig}
                setConfig={setCakeConfig}
                onDone={() => setAppState('editor')}
              />
            </motion.div>
          ) : appState === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex justify-center p-4"
            >
              <EditorPanel 
                mode={currentMode}
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
              {currentMode === 'TRADITIONAL' && (
                <TraditionalMode 
                  frontText={frontText}
                  surpriseText={surpriseText}
                  cards={cards}
                  skin={activeSkin}
                  onEdit={isShared ? undefined : handleEdit}
                />
              )}
              {currentMode === 'ORIGAMI' && (
                <OrigamiMode 
                  frontText={frontText}
                  surpriseText={surpriseText}
                  cards={cards}
                  skin={activeSkin}
                  onEdit={isShared ? undefined : handleEdit}
                />
              )}
              {currentMode === 'BIRTHDAY_WISH' && (
                <BirthdayWishMode 
                  cards={cards}
                  skin={activeSkin}
                  cakeConfig={cakeConfig}
                  onEdit={isShared ? undefined : handleEdit}
                />
              )}
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
