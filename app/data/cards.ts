export interface Card {
  id: number;
  message: string;
  bgGradient: string;
  emoji: string;
  imageUrl?: string;
}

export const CARDS: Card[] = [
  {
    id: 1,
    message: "Every moment with you is a treasure 💎",
    bgGradient: "from-pink-400 to-rose-500",
    emoji: "💎",
  },
  {
    id: 2,
    message: "You make my world brighter every single day ☀️",
    bgGradient: "from-yellow-300 to-orange-400",
    emoji: "☀️",
  },
  {
    id: 3,
    message: "Thank you for being absolutely amazing 🌟",
    bgGradient: "from-purple-400 to-indigo-500",
    emoji: "🌟",
  },
  {
    id: 4,
    message: "Your smile is my favorite sight 😊",
    bgGradient: "from-blue-400 to-cyan-500",
    emoji: "😊",
  },
  {
    id: 5,
    message: "Forever grateful for you 🙏",
    bgGradient: "from-green-400 to-emerald-500",
    emoji: "🙏",
  },
  {
    id: 6,
    message: "You're my greatest adventure 🚀",
    bgGradient: "from-red-400 to-pink-500",
    emoji: "🚀",
  },
];
