import { Card } from "../data/cards";

// In a real app, this would be a MongoDB, Supabase, or PostgreSQL database.
// For this interactive prototype, we'll model the logic.
export interface CardConfig {
  id: string;
  ownerToken: string; // Secret token for the creator to delete the card
  frontText: string;
  surpriseText: string;
  cards: Card[];
  skinId: string;
  createdAt: number;
}

// Mock in-memory storage. 
// IMPORTANT: In serverless environments (Vercel/Netlify), this resets frequently.
// To fix "expire too fast", connect this to a real database (Supabase/Firebase).
const mockDb = new Map<string, CardConfig>();

export const cardStorage = {
  save: (config: Omit<CardConfig, 'id' | 'createdAt' | 'ownerToken'>) => {
    const id = Math.random().toString(36).substring(2, 11);
    const ownerToken = Math.random().toString(36).substring(2, 15);
    const newConfig: CardConfig = {
      ...config,
      id,
      ownerToken,
      createdAt: Date.now(),
    };
    mockDb.set(id, newConfig);
    return { id, ownerToken };
  },
  get: (id: string) => {
    return mockDb.get(id);
  },
  delete: (id: string, token: string) => {
    const card = mockDb.get(id);
    if (card && card.ownerToken === token) {
      mockDb.delete(id);
      return true;
    }
    return false;
  }
};
