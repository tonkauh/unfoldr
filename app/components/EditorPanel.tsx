'use client';

import { Plus, Trash2, Image as ImageIcon, Check, Lock, Palette, Info } from 'lucide-react';
import { Card } from '../data/cards';
import { SKINS, Skin } from '../data/skins';
import { AppMode } from './WelcomePage';

interface EditorPanelProps {
  mode: AppMode;
  frontText: string;
  setFrontText: (text: string) => void;
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
}

export function EditorPanel({
  mode,
  frontText,
  setFrontText,
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setCards(cards.map((c) => (c.id === id ? { ...c, imageUrl: reader.result as string } : c)));
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
    <div className="w-full max-w-lg bg-[#FFFDFB] shadow-2xl rounded-[2rem] flex flex-col h-[92vh] border border-[#E8E2D9] overflow-hidden text-[#5D554D]">
      <div className="p-8 border-b border-[#E8E2D9] bg-[#FFFDFB] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif italic font-bold">Card Creator</h2>
            <p className="text-[#8A817C] font-serif italic text-sm">
              {mode.replace('_', ' ')} Experience
            </p>
          </div>
          <div className="flex -space-x-2">
            {SKINS.slice(0, 3).map((s) => (
              <div key={s.id} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: s.colors.ribbon }} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar">
        {/* Skin Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
              <Palette size={14} /> Style & Theme
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {SKINS.map((skin) => {
              const isSelected = selectedSkinId === skin.id;
              const isLocked = skin.type === 'PREMIUM' && !unlockedSkins.includes(skin.id) && !isSubscribed;
              
              return (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin)}
                  className={`group relative aspect-[4/3] rounded-2xl border-2 transition-all overflow-hidden text-left ${
                    isSelected ? 'border-[#D4AF37] ring-4 ring-[#D4AF37]/10' : 'border-[#F0EBE7] hover:border-[#D4AF37]/30'
                  }`}
                >
                  <div className="absolute inset-0 transition-transform group-hover:scale-110 duration-500" style={{ backgroundColor: skin.colors.bg }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] shadow-md rounded-sm" style={{ backgroundColor: skin.colors.paper }}>
                      <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2" style={{ backgroundColor: skin.colors.ribbon }} />
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold truncate">{skin.name}</p>
                      {isLocked ? <Lock size={10} fill="currentColor" /> : skin.type === 'FREE' && <span className="text-[8px] font-black uppercase opacity-70">Free</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          <div className="space-y-6 bg-[#FBF9F7] p-6 rounded-3xl border border-[#E8E2D9]/50 shadow-inner">
            {mode !== 'BIRTHDAY_WISH' && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Front Text</label>
                <input
                  type="text"
                  value={frontText}
                  onChange={(e) => setFrontText(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#E8E2D9] focus:border-[#D4AF37] outline-none transition-colors font-serif italic text-xl py-2"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">
                {mode === 'TRADITIONAL' ? 'Message' : 'Surprise Reveal'}
              </label>
              <textarea
                value={surpriseText}
                onChange={(e) => setSurpriseText(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 outline-none transition-colors font-serif italic text-xl resize-none h-20 leading-relaxed"
              />
            </div>
          </div>

          {/* Cards Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F7F3F0] pb-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E]">Memories</label>
                <p className="text-[10px] text-[#A8A29E] italic">{cards.length} of {currentMax} slots used</p>
              </div>
              {mode !== 'TRADITIONAL' && (
                <button
                  onClick={addCard}
                  className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-full transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[#C5A028]"
                >
                  <Plus size={12} /> Add Memory
                </button>
              )}
            </div>

            <div className="space-y-6">
              {cards.map((card, idx) => (
                <div key={card.id} className="relative bg-[#FFFDFB] border border-[#E8E2D9] rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-6">
                    <div className="relative w-28 h-28 bg-[#FBF9F7] rounded-xl overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="Memory" className="w-full h-full object-cover grayscale-[0.2]" />
                      ) : (
                        <div className="text-center space-y-1 opacity-40">
                          <ImageIcon size={32} strokeWidth={1.5} />
                          <p className="text-[8px] font-bold uppercase tracking-tighter">Add Photo</p>
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                        <ImageIcon size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(card.id, e)} />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-[#A8A29E] uppercase tracking-widest">Memory {idx + 1}</span>
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
                        className="w-full bg-transparent border-none focus:ring-0 outline-none text-base font-serif italic resize-none h-16 leading-tight placeholder:opacity-30"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 border-t border-[#E8E2D9] bg-[#FFFDFB] shrink-0">
        <button
          onClick={onPreview}
          className="w-full py-5 bg-[#2D2D2D] text-[#FFFDFB] font-serif italic font-bold text-xl rounded-2xl shadow-xl hover:bg-[#1A1A1A] transition-all flex items-center justify-center gap-4 active:scale-[0.98] group"
        >
          <span>Share This Gift</span>
          <Check size={24} className="group-hover:translate-x-1 transition-transform" />
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
