'use client';

import { Plus, Trash2, Image as ImageIcon, Check, Lock, Palette, Info } from 'lucide-react';
import { Card } from '../data/cards';
import { SKINS, Skin } from '../data/skins';
import { AppMode } from './WelcomePage';
import { ColorPicker } from './ColorPicker';
import { ToastType } from './Toast';

interface EditorPanelProps {
  mode: AppMode;
  frontText: string;
  setFrontText: (text: string) => void;
  frontTextColor?: string;
  setFrontTextColor?: (color: string) => void;
  surpriseText: string;
  setSurpriseText: (text: string) => void;
  cards: Card[];
  setCards: (cards: Card[]) => void;
  onPreview: () => void;
  selectedSkinId: string;
  setSelectedSkinId: (id: string) => void;
  isSubscribed: boolean;
  unlockedSkins: string[];
  onTriggerPaywall: (type: 'SKIN' | 'SUBSCRIPTION', skin?: Skin) => void;
  onToast?: (message: string, type: ToastType, duration?: number) => void;
}

export function EditorPanel({
  mode,
  frontText,
  setFrontText,
  frontTextColor,
  setFrontTextColor,
  surpriseText,
  setSurpriseText,
  cards,
  setCards,
  onPreview,
  selectedSkinId,
  setSelectedSkinId,
  isSubscribed,
  unlockedSkins,
  onTriggerPaywall,
  onToast,
}: EditorPanelProps) {
  const MAX_FREE_CARDS = mode === 'TRADITIONAL' ? 1 : 4;
  const MAX_PREMIUM_CARDS = mode === 'TRADITIONAL' ? 1 : 10;
  const currentMax = isSubscribed ? MAX_PREMIUM_CARDS : MAX_FREE_CARDS;

  const addCard = () => {
    if (cards.length >= currentMax) {
      if (!isSubscribed && mode !== 'TRADITIONAL') onTriggerPaywall('SUBSCRIPTION');
      return;
    }
    const newCard: Card = {
      id: Date.now(),
      message: 'New Memory',
      bgSolid: '#F3F4F6',
    };
    setCards([...cards, newCard]);
  };

  const updateCardMessage = (id: number, message: string) => {
    setCards(cards.map((c) => (c.id === id ? { ...c, message } : c)));
  };

  const removeCard = (id: number) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((c) => (c.id !== id)));
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        onToast?.('Image size should be less than 2MB', 'warning', 3000);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCards(cards.map((c) => (c.id === id ? { ...c, imageUrl: reader.result as string } : c)));
        onToast?.('📸 Image added successfully!', 'success', 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkinSelect = (skin: Skin) => {
    const isUnlocked = skin.type === 'FREE' || unlockedSkins.includes(skin.id) || isSubscribed;
    if (isUnlocked) {
      setSelectedSkinId(skin.id);
    } else {
      onTriggerPaywall('SKIN', skin);
    }
  };

  return (
    <div className="w-full max-w-lg h-screen md:h-[92vh] bg-[#FFFDFB] shadow-2xl rounded-2xl md:rounded-[2rem] flex flex-col border border-[#E8E2D9] overflow-hidden text-[#5D554D]">
      <div className="p-4 md:p-8 border-b border-[#E8E2D9] bg-[#FFFDFB] shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-serif italic font-bold">Card Creator</h2>
            <p className="text-[#8A817C] font-serif italic text-xs md:text-sm truncate">
              {mode.replace('_', ' ')} Experience
            </p>
          </div>
          <div className="flex -space-x-2 shrink-0">
            {SKINS.slice(0, 3).map((s) => (
              <div key={s.id} className="w-6 md:w-8 h-6 md:h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: s.colors.ribbon }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12 custom-scrollbar">
        {/* Skin Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
              <Palette size={14} /> Style & Theme
            </label>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
            {SKINS.map((skin) => {
              const isSelected = selectedSkinId === skin.id;
              const isLocked = skin.type === 'PREMIUM' && !unlockedSkins.includes(skin.id) && !isSubscribed;
              
              return (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin)}
                  className={`group relative aspect-[4/3] rounded-lg md:rounded-2xl border-2 transition-all overflow-hidden text-left ${
                    isSelected ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-[#F0EBE7] hover:border-[#D4AF37]/30'
                  }`}
                >
                  <div className="absolute inset-0 transition-transform group-hover:scale-110 duration-500" style={{ backgroundColor: skin.colors.bg }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] shadow-md rounded-sm" style={{ backgroundColor: skin.colors.paper }}>
                      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2" style={{ backgroundColor: skin.colors.ribbon }} />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] md:text-[11px] font-bold truncate">{skin.name}</p>
                      {isLocked ? <Lock size={10} fill="currentColor" /> : skin.type === 'FREE' && <span className="text-[7px] md:text-[8px] font-black uppercase opacity-70">Free</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6 bg-[#FBF9F7] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#E8E2D9]/50 shadow-inner">
            {mode !== 'BIRTHDAY_WISH' && (
              <div className="space-y-2">
                <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Front Text</label>
                <input
                  type="text"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#E8E2D9] focus:border-[#D4AF37] outline-none transition-colors font-serif italic text-lg md:text-xl py-2"
                />
                {setFrontTextColor && (
                  <div className="mt-3">
                    <ColorPicker 
                      label="Text Color" 
                      value={frontTextColor || '#2D2D2D'}
                      onChange={(color) => setFrontTextColor(color)}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
                {mode === 'TRADITIONAL' ? 'Message' : 'Surprise Reveal'}
              </label>
              <textarea
                value={surpriseText}
                onChange={(e) => setSurpriseText(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 outline-none transition-colors font-serif italic text-base md:text-xl resize-none h-16 md:h-20 leading-relaxed"
              />
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between border-b border-[#F7F3F0] pb-3">
              <div className="space-y-1">
                <label className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Memories</label>
                <p className="text-[8px] md:text-[10px] text-[#A8A29E] italic">{cards.length} of {currentMax} slots</p>
              </div>
              {mode !== 'TRADITIONAL' && (
                <button
                  onClick={addCard}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-[#D4AF37] text-white rounded-full transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[#C5A028]"
                >
                  <Plus size={12} /> Add
                </button>
              )}
            </div>

            <div className="space-y-4 md:space-y-6">
              {cards.map((card, idx) => (
                <div key={card.id} className="relative bg-[#FFFDFB] border border-[#E8E2D9] rounded-xl md:rounded-[1.5rem] p-3 md:p-5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative w-20 md:w-28 h-20 md:h-28 bg-[#FBF9F7] rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="Memory" className="w-full h-full object-cover grayscale-[0.2]" />
                      ) : (
                        <div className="text-center space-y-1 opacity-40">
                          <ImageIcon size={24} className="md:size-[32px]" strokeWidth={1.5} />
                          <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-tighter">Add Photo</p>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                        <ImageIcon size={18} className="md:size-[20px]" />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(card.id, e)} />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[7px] md:text-[9px] font-bold text-[#A8A29E] uppercase tracking-widest">Memory {idx + 1}</span>
                        {cards.length > 1 && mode !== 'TRADITIONAL' && (
                          <button onClick={() => removeCard(card.id)} className="text-[#A8A29E] hover:text-red-400 p-1 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <textarea
                        value={card.message}
                        onChange={(e) => updateCardMessage(card.id, e.target.value)}
                        placeholder="Write something sweet..."
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm md:text-base font-serif italic resize-none h-12 md:h-16 leading-tight placeholder:opacity-30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 border-t border-[#E8E2D9] bg-[#FFFDFB] shrink-0">
        <button
          onClick={onPreview}
          className="w-full py-4 md:py-5 bg-[#2D2D2D] text-[#FFFDFB] font-serif italic font-bold text-lg md:text-xl rounded-lg md:rounded-2xl shadow-xl hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-3 md:gap-4 active:scale-[0.98] group"
        >
          <span>Share This Gift</span>
          <Check size={20} className="md:size-[24px] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E2D9; border-radius: 10px; }
      `}</style>
    </div>
  );
}
