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
import { Toast, useToast } from './components/Toast';
import { useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { useDraftStorage } from './hooks/useDraftStorage';
import { CARDS, Card } from './data/cards';
import { SKINS, Skin } from './data/skins';
import { CakeConfig } from './data/cake';

type AppState = 'welcome' | 'editor' | 'cake_editor' | 'preview';

export default function BirthdayCard() {
  const { toasts, addToast, removeToast } = useToast();
  const { saveDraft, loadDraft, clearDraft, setIsDirty } = useDraftStorage();

  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentMode, setCurrentMode] = useState<AppMode>('ORIGAMI');
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isShared, setIsShared] = useState(false);
  
  // Customization State
  const [frontText, setFrontText] = useState("I love you, Happy Birthday!");
  const [surpriseText, setSurpriseText] = useState("You are Loved! ❤️");
  const [frontTextColor, setFrontTextColor] = useState("#2D2D2D");
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: () => {
      const draftData = {
        frontText,
        surpriseText,
        cards,
        selectedSkinId,
        currentMode,
        cakeConfig,
        timestamp: Date.now(),
      };
      saveDraft(draftData);
      addToast('✨ Draft saved successfully!', 'success', 2000);
    },
  });

  // Auto-save draft every 30 seconds when editing
  useEffect(() => {
    if (appState !== 'editor' && appState !== 'cake_editor') return;

    const interval = setInterval(() => {
      const draftData = {
        frontText,
        surpriseText,
        cards,
        selectedSkinId,
        currentMode,
        cakeConfig,
        timestamp: Date.now(),
      };
      saveDraft(draftData);
    }, 30000);

    return () => clearInterval(interval);
  }, [frontText, surpriseText, cards, selectedSkinId, currentMode, cakeConfig, appState, saveDraft]);

  // URL Hydration logic with draft loading
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
              clearDraft();
            }, 50);
          } else {
            setIsLoading(false);
          }
        } catch (err) {
          console.error('Error loading shared card:', err);
          setIsLoading(false);
        }
      } else {
        // Try loading draft
        const draft = loadDraft();
        if (draft && Date.now() - draft.timestamp < 7 * 24 * 60 * 60 * 1000) { // 7 days
          setTimeout(() => {
            setFrontText(draft.frontText);
            setSurpriseText(draft.surpriseText);
            setCards(draft.cards);
            setSelectedSkinId(draft.selectedSkinId);
            setCurrentMode(draft.currentMode);
            setCakeConfig(draft.cakeConfig);
    addToast('🎉 Share link generated!', 'success', 2000);
            addToast('📝 Draft restored from last session', 'info', 3000);
            setIsLoading(false);
          }, 100);
        } else {
          setIsLoading(false);
        }
      }
    };

    loadDataFromUrl();
    window.addEventListener('hashchange', loadDataFromUrl);
    return () => window.removeEventListener('hashchange', loadDataFromUrl);
  }, [loadDraft, clearDraft, addToast]);

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
                frontTextColor={frontTextColor}
                setFrontTextColor={setFrontTextColor}
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
                onToast={addToast}
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
        onToast={addToast}
      />

      <PaywallModal 
        isOpen={paywallConfig.isOpen}
        onClose={() => setPaywallConfig(prev => ({ ...prev, isOpen: false }))}
        type={paywallConfig.type}
        itemName={paywallConfig.skin?.name}
        price={paywallConfig.skin?.price}
        onUnlock={handleUnlock}
      />

      <Toast toasts={toasts} removeToast={removeToast}   itemName={paywallConfig.skin?.name}
        price={paywallConfig.skin?.price}
        onUnlock={handleUnlock}
      />
    </main>
  );
}
