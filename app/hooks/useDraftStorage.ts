import { useCallback, useEffect, useState } from 'react';
import { Card } from '../data/cards';
import { CakeConfig } from '../data/cake';
import { AppMode } from '../components/WelcomePage';

export interface DraftData {
  frontText: string;
  surpriseText: string;
  cards: Card[];
  selectedSkinId: string;
  currentMode: AppMode;
  cakeConfig: CakeConfig;
  timestamp: number;
}

const DRAFT_STORAGE_KEY = 'unfoldr_draft';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export function useDraftStorage() {
  const [lastSaved, setLastSaved] = useState<number>(0);
  const [isDirty, setIsDirty] = useState(false);

  const saveDraft = useCallback((data: DraftData) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      setLastSaved(Date.now());
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, []);

  const loadDraft = useCallback((): DraftData | null => {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setLastSaved(0);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, []);

  const getDraftAge = useCallback(() => {
    if (lastSaved === 0) return null;
    return Math.floor((Date.now() - lastSaved) / 1000);
  }, [lastSaved]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    lastSaved,
    isDirty,
    setIsDirty,
    getDraftAge,
  };
}
