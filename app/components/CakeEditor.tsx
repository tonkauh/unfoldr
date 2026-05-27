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
    <div className="w-full max-w-6xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2.5rem] flex flex-col md:flex-row h-[88vh] border border-[#E8E2D9] overflow-hidden text-[#2D2D2D]">
      
      {/* LEFT: Preview Studio (60% width) */}
      <div className="flex-[1.5] bg-[#F9F7F2] relative flex flex-col items-center justify-center p-12 overflow-hidden border-b md:border-b-0 md:border-r border-[#E8E2D9]">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/50 rounded-full blur-3xl" />
        
        {/* Studio Branding */}
        <div className="absolute top-10 left-10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-[#E8E2D9]">
            <Sparkles size={18} className="text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 leading-none mb-1">Preview</p>
            <p className="text-xs font-serif italic text-[#8A817C]">Design Studio v1.0</p>
          </div>
        </div>

        {/* Dynamic Cake Preview */}
        <motion.div 
          key={config.flavor + config.icingColor + config.topping + config.candleCount}
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 0.9, opacity: 1, y: 0 }}
          className="relative z-10 md:scale-110"
        >
          <CakeVisual config={config} />
        </motion.div>

        {/* Floor shadow */}
        <div className="absolute bottom-20 w-[400px] h-12 bg-black/[0.03] blur-3xl rounded-[100%] scale-x-150" />
        
        {/* Current Selection Pill */}
        <div className="absolute bottom-10 left-10 right-10 flex justify-center">
           <div className="px-6 py-3 bg-white/80 backdrop-blur-md border border-white rounded-full shadow-sm flex gap-6 text-[9px] font-bold uppercase tracking-widest text-[#8A817C]">
             <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: CAKE_FLAVORS.find(f => f.id === config.flavor)?.color }} /> {config.flavor}</span>
             <span className="w-px h-3 bg-[#E8E2D9] my-auto" />
             <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: ICING_COLORS.find(c => c.id === config.icingColor)?.color }} /> {config.icingColor}</span>
             <span className="w-px h-3 bg-[#E8E2D9] my-auto" />
             <span className="flex items-center gap-2">{config.topping}</span>
           </div>
        </div>
      </div>

      {/* RIGHT: High-End Controls (40% width) */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Progress Header */}
        <div className="p-10 pb-6 space-y-8">
           <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Keepsake Builder</p>
                 <h3 className="text-4xl font-serif italic font-bold leading-none">{steps[step].title}</h3>
              </div>
              <p className="text-xs font-bold opacity-30 tracking-widest">0{step + 1} / 04</p>
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
        <div className="flex-1 overflow-y-auto px-10 py-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
              <p className="text-sm text-[#8A817C] font-serif italic leading-relaxed">{steps[step].subtitle}</p>

              {steps[step].type === 'FLAVOR' && (
                <div className="grid grid-cols-1 gap-4">
                  {CAKE_FLAVORS.map(flavor => (
                    <button
                      key={flavor.id}
                      onClick={() => setConfig({ ...config, flavor: flavor.id })}
                      className={`group relative p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between ${
                        config.flavor === flavor.id ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl shadow-md border border-black/5" style={{ backgroundColor: flavor.color }} />
                        <span className="font-bold text-lg">{flavor.name}</span>
                      </div>
                      {config.flavor === flavor.id && <div className="w-6 h-6 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center"><Check size={14} strokeWidth={3} /></div>}
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'ICING' && (
                <div className="grid grid-cols-2 gap-4">
                  {ICING_COLORS.map(icing => (
                    <button
                      key={icing.id}
                      onClick={() => setConfig({ ...config, icingColor: icing.id })}
                      className={`group p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${
                        config.icingColor === icing.id ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-full shadow-xl ring-8 ring-black/[0.02]" style={{ backgroundColor: icing.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{icing.id}</span>
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'TOPPING' && (
                <div className="space-y-4">
                  {['none', 'sprinkles'].map(topping => (
                    <button
                      key={topping}
                      onClick={() => setConfig({ ...config, topping: topping as any })}
                      className={`w-full p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                        config.topping === topping ? 'border-[#2D2D2D] bg-[#FBF9F7] shadow-lg' : 'border-[#F0EBE7] hover:border-[#2D2D2D]/30'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-3xl">
                            {topping === 'sprinkles' ? '✨' : '⚪️'}
                         </div>
                         <span className="text-xl font-bold uppercase tracking-widest">{topping}</span>
                      </div>
                      {config.topping === topping && <div className="w-8 h-8 rounded-full bg-[#2D2D2D] text-white flex items-center justify-center shadow-md"><Check size={20} strokeWidth={3} /></div>}
                    </button>
                  ))}
                </div>
              )}

              {steps[step].type === 'CANDLES' && (
                <div className="flex flex-col items-center py-12 space-y-12">
                  <div className="w-full space-y-8">
                    <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      value={config.candleCount}
                      onChange={(e) => setConfig({ ...config, candleCount: parseInt(e.target.value) })}
                      className="w-full h-3 bg-[#F0EBE7] rounded-full appearance-none cursor-pointer accent-[#2D2D2D]"
                    />
                    <div className="flex justify-between px-2 text-[10px] font-black text-[#A8A29E] tracking-widest">
                      <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
                    </div>
                  </div>
                  <div className="text-center relative">
                    <motion.h4 
                      key={config.candleCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-serif italic font-bold text-[#2D2D2D]"
                    >
                      {config.candleCount}
                    </motion.h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mt-4">Lighted Candles</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation (Sticky) */}
        <div className="p-10 pt-4 bg-gradient-to-t from-white via-white to-transparent">
           <div className="flex gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-16 h-16 flex items-center justify-center border-2 border-[#F0EBE7] rounded-[1.5rem] hover:bg-[#F9F7F2] transition-all text-[#5D554D] shrink-0"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 h-16 bg-[#2D2D2D] text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-[0.98]"
                >
                  <span className="uppercase tracking-[0.2em] text-xs">Continue</span>
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={onDone}
                  className="flex-1 h-16 bg-[#8F9779] text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-[0.98]"
                >
                  <span className="uppercase tracking-[0.2em] text-xs">Finalize Card</span>
                  <Check size={20} />
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
