'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const TOAST_ICONS = {
  success: Check,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const TOAST_COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-sm space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, x: 400 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 20, x: 400 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className={`${TOAST_COLORS[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto`}
            >
              <Icon size={20} />
              <span className="font-serif text-sm">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto hover:opacity-80 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </AnimatePresence>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
