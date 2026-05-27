'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CakeConfig, CAKE_FLAVORS, ICING_COLORS } from '../data/cake';

interface CakeVisualProps {
  config: CakeConfig;
  isBlowing?: boolean;
  extinguishedCount?: number;
  onExtinguish?: () => void;
}

export function CakeVisual({ config, isBlowing, extinguishedCount = 0, onExtinguish }: CakeVisualProps) {
  const flavorColor = CAKE_FLAVORS.find(f => f.id === config.flavor)?.color || '#ddb892';
  const icingColor = ICING_COLORS.find(c => c.id === config.icingColor)?.color || '#7f5539';
  const middleLayerColor = config.flavor === 'chocolate' ? '#3E2723' : '#b08968';

  const [sparkles] = useState(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      cx: 80 + Math.random() * 240,
      cy: 165 + Math.random() * 30,
      rotate: Math.random() * 360
    }));
  });

  return (
    <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
        {/* 1. Plate */}
        <ellipse cx="200" cy="320" rx="170" ry="20" fill="#FFFFFF" />
        
        {/* 2. Cake Base Body */}
        <path d="M 50 180 L 50 300 A 150 25 0 0 0 350 300 L 350 180 Z" fill={flavorColor} />
        
        {/* 3. Middle Cream Filling */}
        <path d="M 50 230 L 50 250 A 150 25 0 0 0 350 250 L 350 230 A 150 25 0 0 1 50 230 Z" fill={middleLayerColor} />
        
        {/* 4. Icing Drips (Rendered underneath the top surface to blend flawlessly) */}
        <motion.rect x="60" y="180" width="25" height="40" rx="12.5" fill={icingColor} animate={{ height: [40, 50, 40] }} transition={{ repeat: Infinity, duration: 3, delay: 0.1 }} />
        <motion.rect x="100" y="180" width="30" height="55" rx="15" fill={icingColor} animate={{ height: [55, 65, 55] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} />
        <motion.rect x="145" y="180" width="35" height="45" rx="17.5" fill={icingColor} animate={{ height: [45, 55, 45] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.2 }} />
        <motion.rect x="190" y="180" width="40" height="70" rx="20" fill={icingColor} animate={{ height: [70, 85, 70] }} transition={{ repeat: Infinity, duration: 4.5, delay: 0.8 }} />
        <motion.rect x="240" y="180" width="30" height="50" rx="15" fill={icingColor} animate={{ height: [50, 60, 50] }} transition={{ repeat: Infinity, duration: 3.2, delay: 0.3 }} />
        <motion.rect x="285" y="180" width="25" height="60" rx="12.5" fill={icingColor} animate={{ height: [60, 75, 60] }} transition={{ repeat: Infinity, duration: 3.8, delay: 0.6 }} />
        <motion.rect x="320" y="180" width="20" height="35" rx="10" fill={icingColor} animate={{ height: [35, 45, 35] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.9 }} />

        {/* 5. Top Icing Surface */}
        <ellipse cx="200" cy="180" rx="150" ry="25" fill={icingColor} />
        
        {/* 6. Toppings (Sprinkles) */}
        {config.topping === 'sprinkles' && sparkles.map(s => (
          <rect 
            key={s.id} 
            x={s.cx} 
            y={s.cy} 
            width="4" 
            height="10" 
            rx="2" 
            fill="#F9A8D4" 
            transform={`rotate(${s.rotate} ${s.cx + 2} ${s.cy + 5})`} 
          />
        ))}

        {/* 7. Removed Strawberry */}

        {/* 8. Candles (Moved directly into SVG coordinates for perfect scaling and alignment) */}
        <g>
          {[...Array(config.candleCount)].map((_, i) => {
            const total = config.candleCount;
            // Spacing based on total count
            const spacing = total === 5 ? 35 : 45;
            const distFromCenter = i - (total - 1) / 2;
            
            // X position spaced around center 200
            const cx = 200 + distFromCenter * spacing;
            // Y position on the curve of the top surface (cy=180, ry=25)
            // Use a quadratic curve to approximate the ellipse edge
            const curveY = 180 + Math.abs(distFromCenter) * Math.abs(distFromCenter) * 4;
            
            const isExtinguished = isBlowing || extinguishedCount > i;
            
            return (
              <g 
                key={i} 
                transform={`translate(${cx}, ${curveY})`}
                className="pointer-events-auto"
              >
                {/* Candle Body */}
                <rect x="-6" y="-60" width="12" height="60" rx="6" fill="#0284C7" />
                
                {/* Flame (Minimalist Flat Teardrop) */}
                <AnimatePresence>
                  {!isExtinguished && (
                    <motion.svg
                      x="-12"
                      y="-92"
                      width="24"
                      height="32"
                      viewBox="0 0 24 32"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="text-[#F97316] overflow-visible"
                      style={{ transformOrigin: '12px 28px' }}
                    >
                      <path d="M12 2 C12 2 4 12 4 20 C4 24.4183 7.58172 28 12 28 C16.4183 28 20 24.4183 20 20 C20 12 12 2 12 2 Z" fill="currentColor" />
                    </motion.svg>
                  )}
                </AnimatePresence>

                {/* Interactive Hit Target */}
                {onExtinguish && !isExtinguished && (
                  <rect 
                    x="-20" 
                    y="-100" 
                    width="40" 
                    height="100" 
                    fill="transparent" 
                    cursor="pointer"
                    onClick={() => onExtinguish()}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
