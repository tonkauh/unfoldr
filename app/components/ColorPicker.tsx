'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
}

const PRESET_COLORS = [
  '#2D2D2D', // Dark
  '#8A817C', // Gray
  '#D4AF37', // Gold
  '#B5838D', // Rose
  '#8F9779', // Sage
  '#E8A87C', // Coral
  '#6B5B95', // Purple
  '#C2B1BC', // Lavender
];

export function ColorPicker({ label, value, onChange, colors = PRESET_COLORS }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8A29E] mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full p-3 bg-[#FBF9F7] border border-[#E8E2D9] rounded-lg hover:border-[#D4AF37] transition-colors"
      >
        <div
          className="w-8 h-8 rounded-lg shadow-sm border-2 border-white"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-[#5D554D] flex-1 text-left">{value}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E8E2D9] rounded-lg shadow-lg p-3 z-50"
        >
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className={`w-full aspect-square rounded-lg transition-all border-2 ${
                  value === color ? 'border-[#2D2D2D] ring-2 ring-[#D4AF37]' : 'border-[#E8E2D9] hover:border-[#D4AF37]'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          <div className="mt-3 border-t border-[#E8E2D9] pt-3">
            <input
              type="color"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
