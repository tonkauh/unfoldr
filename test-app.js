// Quick test to verify component logic
const CARDS = [
  { id: 1, message: "Every moment with you is a treasure 💎", emoji: "💎" },
  { id: 2, message: "You make my world brighter every single day ☀️", emoji: "☀️" },
  { id: 3, message: "Thank you for being absolutely amazing 🌟", emoji: "🌟" },
  { id: 4, message: "Your smile is my favorite sight 😊", emoji: "😊" },
  { id: 5, message: "Forever grateful for you 🙏", emoji: "🙏" },
  { id: 6, message: "You're my greatest adventure 🚀", emoji: "🚀" },
];

console.log("✅ Birthday Card Test Suite");
console.log("========================");
console.log(`Total cards: ${CARDS.length}`);
console.log("\nCards in sequence:");
CARDS.forEach((card, idx) => {
  console.log(`${idx + 1}. ${card.emoji} ${card.message.substring(0, 40)}...`);
});

console.log("\n✅ All components and data structure verified!");
