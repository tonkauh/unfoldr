'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Sparkles, Zap } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'SKIN' | 'SUBSCRIPTION';
  itemName?: string;
  price?: string;
  onUnlock: () => void;
}

export function PaywallModal({ isOpen, onClose, type, itemName, price, onUnlock }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden text-center"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-yellow-100 rounded-full">
                  {type === 'SKIN' ? <Sparkles size={32} className="text-yellow-600" /> : <Zap size={32} className="text-yellow-600" />}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {type === 'SKIN' ? 'Unlock Theme' : 'Upgrade to Pro'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {type === 'SKIN' 
                    ? `Get the "${itemName}" look for your special card for just ${price}.`
                    : "Add up to 10 memories and unlock all premium themes with a monthly subscription."}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onUnlock}
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                >
                  <CreditCard size={20} />
                  {type === 'SKIN' ? `Buy for ${price}` : 'Subscribe for $4.99/mo'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-all"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
