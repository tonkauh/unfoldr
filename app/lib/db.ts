import { Card } from "../data/cards";

// In a real app, this would be a MongoDB, Supabase, or PostgreSQL database.
// For this interactive prototype, we'll model the logic.
export interface CardConfig {
  id: string;
  frontText: string;
  surpriseText: string;
  cards: Card[];
  skinId: string;
  createdAt: number;
}

// Mock in-memory storage (Note: in serverless, this won't persist across requests)
const mockDb = new Map<string, CardConfig>();

export const cardStorage = {
  save: (config: Omit<CardConfig, 'id' | 'createdAt'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const newConfig: CardConfig = {
      ...config,
      id,
      createdAt: Date.now(),
    };
    mockDb.set(id, newConfig);
    return id;
  },
  get: (id: string) => {
    return mockDb.get(id);
  }
};
