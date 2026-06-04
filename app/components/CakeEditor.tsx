'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Palette, Layers, Sparkles, ChevronLeft } from 'lucide-react';
import { CakeConfig, CAKE_FLAVORS, ICING_COLORS } from '../data/cake';
import { useState } from 'react';
import { CakeVisual } from './CakeVisual';

interface CakeEditorProps {
  config: CakeConfig;
  setConfig: (config: CakeConfig) => void;
  onDone: () => void;
}

export function CakeEditor({ config, setConfig, onDone }: CakeEditorProps) {
  const [step, setStep] = useState(0);

  const steps = [
    { title: 'Sponge', subtitle: 'Foundation of flavor', type: 'FLAVOR', icon: Layers },
    { title: 'Icing', subtitle: 'A smooth, colorful finish', type: 'ICING', icon: Palette },
    { title: 'Topping', subtitle: 'The artisanal garnish', type: 'TOPPING', icon: Sparkles },
    { title: 'Candles', subtitle: 'How many wishes?', type: 'CANDLES', icon: Check },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-6xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] md:rounded-[2.5rem] rounded-2xl flex flex-col md:flex-row h-auto md:h-[88vh] border border-[#E8E2D9] overflow-hidden text-[#2D2D2D]">
      
      {/* LEFT: Preview Studio (60% width on desktop, full on mobile) */}
      <div className="w-full md:flex-[1.5] bg-[#F9F7F2] relative flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E2D9] min-h-[300px] md:min-h-auto">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/50 rounded-full blur-3xl hidden md:block" />
        
        {/* Studio Branding - hidden on small mobile */}
        <div className="absolute top-6 md:top-10 left-6 md:left-10 flex items-center gap-4 hidden sm:flex">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#E8E2D9]">
            <Sparkles size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <div className="hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-none mb-1">Preview</p>
            <p className="text-xs font-serif italic text-[#8A817C]">Design Studio v1.0</p>
          </div>
        </div>

        {/* Dynamic Cake Preview */}
        <motion.div 
          key={config.flavor + config.icingColor + config.topping + config.candleCount}
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 0.9, opacity: 1, y: 0 }}
          className="relative z-10 md:scale-110 scale-75 md:scale-100"
        >
          <CakeVisual config={config} />
        </motion.div>

        {/* Floor shadow */}
        <div className="absolute bottom-16 md:bottom-20 w-[300px] md:w-[400px] h-12 bg-black/[0.03] blur-3xl rounded-[100%] scale-x-150" />
        
        {/* Current Selection Pill - compact on mobile */}
        <div className="absolute bottom-4 md:bottom-10 left-4 md:left-10 right-4 md:right-10 flex justify-center">
           <div className="px-3 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-sm flex gap-2 md:gap-6 text-[7px] md:text-[9px] font-bold uppercase tracking-widest text-[#8A817C] flex-wrap justify-center">
             <span className="flex items-center gap-1"><div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full" style={{ backgroundColor: CAKE_FLAVORS.find(f => f.id === config.flavor)?.color }} /> <span className="hidden sm:inline">{config.flavor}</span></span>
             <span className="w-px h-2 md:h-3 bg-[#E8E2D9] my-auto hidden md:block" />
             <span className="flex items-center gap-1"><div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full" style={{ backgroundColor: ICING_COLORS.find(c => c.id === config.icingColor)?.color }} /> <span className="hidden sm:inline">{config.icingColor}</span></span>
             <span className="w-px h-2 md:h-3 bg-[#E8E2D9] my-auto hidden md:block" />
             <span className="flex items-center gap-1 hidden md:flex">{config.topping}</span>
           </div>
        </div>
      </div>

      {/* RIGHT: High-End Controls (40% width on desktop, full on mobile) */}
      <div className="w-full md:flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Progress Header */}
        <div className="p-6 md:p-10 pb-4 md:pb-6 space-y-4 md:space-y-8">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Keepsake Builder</p>
                 <h3 className="text-2xl md:text-4xl font-serif italic font-bold leading-none">{steps[step].title}</h3>
              </div>
              <p className="text-xs md:text-xs font-bold opacity-30 tracking-widest">0{step + 1} / 04</p>
           </div>
           
           {/* Progress Steps Visual */}
           <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full bg-[#F0EBE7] overflow-hidden">
                   <motion.div 
                     className="h-full bg-[#2D2D2D]"
                     initial={false}
                     animate={{ width: i < step ? '100%' : i === step ? '100%' : '0%' }}
                     transition={{ duration: 0.4 }}
                   />
                </div>
              ))}
           </div>
        </div>

        {/* Options Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-4 md:py-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6 md:space-y-8"
            >
              <p className="text-xs md:text-sm text-[#8A817C] font-serif italic leading-relaxed">{steps[step].subtitle}</p>

              {steps[step].type === 'FLAVOR' && (
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {CAKE_FLAVORS.map(flavor => (
                    <button
                      key={flavor.id}
                      onClick={() => setConfig({ ...config, flavor: flavor.id })}
                      className={`group relative p-4 md:p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
                        config.flavor === flavor.id ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl shadow-md border border-black/5" style={{ backgroundColor: flavor.color }} />
                        <span className="font-bold text-base md:text-lg">{flavor.name}</span>
                      </div>
                      {config.flavor === flavor.id && <div className="w-6 h-6 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center"><Check size={14} strokeWidth={3} /></div>}
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'ICING' && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                  {ICING_COLORS.map(icing => (
                    <button
                      key={icing.id}
                      onClick={() => setConfig({ ...config, icingColor: icing.id })}
                      className={`group p-4 md:p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 md:gap-4 ${
                        config.icingColor === icing.id ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="w-12 md:w-20 h-12 md:h-20 rounded-full shadow-xl ring-8 ring-black/[0.02]" style={{ backgroundColor: icing.color }} />
                      <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-40">{icing.id}</span>
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'TOPPING' && (
                <div className="space-y-3 md:space-y-4">
                  {['none', 'sprinkles'].map(topping => (
                    <button
                      key={topping}
                      onClick={() => setConfig({ ...config, topping: topping as any })}
                      className={`w-full p-4 md:p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                        config.topping === topping ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-6">
                         <div className="w-12 md:w-16 h-12 md:h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-2xl md:text-3xl">
                            {topping === 'sprinkles' ? '✨' : '⚪️'}
                         </div>
                         <span className="text-base md:text-xl font-bold uppercase tracking-widest">{topping}</span>
                      </div>
                      {config.topping === topping && <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center shadow-md"><Check size={16} strokeWidth={3} /></div>}
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'CANDLES' && (
                <div className="flex flex-col items-center py-8 md:py-12 space-y-8 md:space-y-12">
                  <div className="w-full space-y-6 md:space-y-8">
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={config.candleCount}
                      onChange={(e) => setConfig({ ...config, candleCount: parseInt(e.target.value) })}
                      className="w-full h-3 bg-[#F0EBE7] rounded-full appearance-none cursor-pointer accent-[#2D2D2D]"
                    />
                    <div className="flex justify-between px-2 text-[8px] md:text-[10px] font-black text-[#A8A29E] tracking-widest">
                      <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
                    </div>
                  </div>
                  <div className="text-center relative">
                    <motion.h4 
                      key={config.candleCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl md:text-8xl font-serif italic font-bold text-[#2D2D2D]"
                    >
                      {config.candleCount}
                    </motion.h4>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-2 md:mt-4">Lighted Candles</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation (Sticky) */}
        <div className="p-4 md:p-10 pt-3 md:pt-4 bg-gradient-to-t from-white via-white to-transparent">
           <div className="flex gap-2 md:gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-12 md:w-16 h-12 md:h-16 flex items-center justify-center border-2 border-[#F0EBE7] rounded-[1.5rem] hover:bg-[#F9F7F2] transition-all text-[#5D554D] shrink-0"
                >
                  <ChevronLeft size={20} className="md:size-24" />
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 h-12 md:h-16 bg-[#2D2D2D] text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-2 md:gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                >
                  <span className="uppercase tracking-[0.2em] text-xs md:text-xs">Continue</span>
                  <ArrowRight size={16} className="md:size-[18px]" />
                </button>
              ) : (
                <button
                  onClick={onDone}
                  className="flex-1 h-12 md:h-16 bg-[#8F9779] text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-2 md:gap-3 hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
                >
                  <span className="uppercase tracking-[0.2em] text-xs md:text-xs">Finalize Card</span>
                  <Check size={16} className="md:size-[20px]" />
                </button>
              )}
           </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E8E2D9; border-radius: 10px; }
      `}</style>
    </div>
  );
}
