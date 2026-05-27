export interface Card {
  id: number;
  message: string;
  bgSolid: string;
  imageUrl?: string;
}

export const CARDS: Card[] = [
  {
    id: 1,
    message: "A moment preserved in time.",
    bgSolid: "#F3F4F6", // Gray 100
  },
  {
    id: 2,
    message: "The journey we share together.",
    bgSolid: "#FEF3C7", // Amber 100
  }
];
