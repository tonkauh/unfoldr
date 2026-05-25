# 🎁 Interactive Birthday Card Application

A beautiful, interactive web/mobile application for sending personalized birthday celebrations with swipeable cards and confetti animations.

## ✨ Features

### 1. **Envelope Page (Intro)**
- Beautifully designed gift envelope with gradient styling
- Prominent "I love you, Happy Birthday!" message
- Smooth button animation with hover effects
- Call-to-action: "Open Envelope" button

### 2. **Swipeable Cards Page (Main Content)**
- Tinder-style card swiping mechanics
- 6 customizable photo/message cards
- Smooth drag-and-drop animations with rotation
- Card counter showing remaining cards
- Stack effect showing upcoming cards
- Responsive for both desktop and mobile touch

### 3. **Final Surprise Page**
- Animated confetti effect with canvas rendering
- Celebration message with gradient text
- "Start Over" button to restart the flow
- "Reveal Grand Gift" button for additional interactions
- Animated decorative emojis

## 📁 Project Structure

```
celebratecard/
├── app/
│   ├── components/
│   │   ├── EnvelopePage.tsx       # Intro envelope component
│   │   ├── CardSwiper.tsx         # Swipeable card interface
│   │   ├── CelebrationPage.tsx    # Final celebration screen
│   │   └── Confetti.tsx           # Confetti animation effect
│   ├── data/
│   │   └── cards.ts               # Card data & types
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Main app component with state
│   └── globals.css                # Global styles
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 💻 Technical Stack

- **Framework**: Next.js 16.2.6 with App Router
- **React**: 19.2.4
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **State Management**: React Hooks (useState)
- **Animations**: CSS transitions, Canvas API for confetti

## 🎨 Component Architecture

### EnvelopePage.tsx
- Displays decorative envelope with gradient background
- Handles "Open" button interaction
- Props: `onOpen: () => void`

### CardSwiper.tsx
- Main card swiping interface with mouse/touch support
- Tracks drag position and rotation
- Detects swipe threshold (100px) to progress cards
- Auto-detects final card and triggers celebration
- Props: `cards: Card[]`, `onAllCardsRemoved: () => void`

### CelebrationPage.tsx
- Displays final celebration screen
- Integrates Confetti component
- Provides "Start Over" and "Reveal Grand Gift" actions
- Props: `onRestart: () => void`

### Confetti.tsx
- Canvas-based particle animation
- 100 colorful particles with gravity physics
- 3-second animation duration with fade-out effect
- Responsive to window resize

## 📊 Card Data Structure

```typescript
interface Card {
  id: number;
  message: string;
  bgGradient: string;
  emoji: string;
}
```

### Available Cards
1. 💎 "Every moment with you is a treasure"
2. ☀️ "You make my world brighter every single day"
3. 🌟 "Thank you for being absolutely amazing"
4. 😊 "Your smile is my favorite sight"
5. 🙏 "Forever grateful for you"
6. 🚀 "You're my greatest adventure"

## 🎮 User Interaction Flow

1. **Envelope Page**: User sees beautifully designed envelope and clicks "Open Envelope"
2. **Card Swiper**: 
   - First card displays with emoji and message
   - User drags card left/right (desktop) or swipes (mobile)
   - Card rotates and flies away when threshold is reached
   - Next card slides into view with stack effect
   - Counter updates showing remaining cards
3. **Celebration Page**: 
   - Triggered automatically when last card is swiped
   - Confetti animation plays automatically
   - User can restart or reveal grand gift

## 🔧 Customization Guide

### Adding New Cards
Edit `app/data/cards.ts`:
```typescript
{
  id: 7,
  message: "Your custom message here",
  bgGradient: "from-color-400 to-color-500",
  emoji: "🎯",
}
```

### Changing Colors
- Envelope Page: Edit gradient classes in `EnvelopePage.tsx`
- Cards: Add new gradients in `getGradientFrom()` and `getGradientTo()` functions
- Celebration: Modify gradient in `CelebrationPage.tsx`

### Adjusting Swipe Sensitivity
In `CardSwiper.tsx`, change the `threshold` value (line with `const threshold = 100`):
- Lower value = more sensitive
- Higher value = requires more drag

## 📱 Mobile Responsiveness

- Fully responsive touch events for mobile
- Cards adapt to screen size
- Buttons and text scale appropriately
- Touch swipe detection supports all mobile browsers

## ✅ Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance Optimizations

- Client-side rendering with Next.js App Router
- Canvas-based confetti (lightweight, no heavy libraries)
- CSS transforms for smooth animations (GPU accelerated)
- Event delegation for efficient drag handling
- Responsive image optimization

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
```bash
npm run build
npm start
```

## 📝 Code Examples

### State Management (page.tsx)
```typescript
const [currentPage, setCurrentPage] = useState<PageState>('envelope');
const handleEnvelopeOpen = () => setCurrentPage('cards');
const handleAllCardsRemoved = () => setCurrentPage('celebration');
const handleRestart = () => setCurrentPage('envelope');
```

### Drag Detection (CardSwiper.tsx)
```typescript
const handleSwipeEnd = () => {
  const threshold = 100;
  if (Math.abs(position.x) > threshold) {
    if (currentIndex + 1 >= cards.length) {
      onAllCardsRemoved();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }
};
```

### Confetti Animation (Confetti.tsx)
- Uses `requestAnimationFrame` for smooth 60fps animation
- Particle physics: gravity, rotation, fade-out
- Canvas clearing and redrawing each frame

## 🎨 Styling Features

- Gradient backgrounds (pink, purple, blue, green themes)
- Smooth transitions and hover effects
- Blurred backdrop effects (blur filters)
- Shadow effects for depth
- Animated pulse and bounce effects
- Responsive grid/flex layouts

## 🐛 Troubleshooting

**Cards not swiping?**
- Ensure touch/mouse events are properly propagated
- Check browser console for JavaScript errors

**Confetti not appearing?**
- Verify Canvas API is supported
- Check z-index stacking (should be 50)

**Styling issues?**
- Clear cache: `rm -rf .next`
- Rebuild: `npm run build`

## 📄 License

MIT License - Feel free to use this for personal or commercial projects

## 💡 Future Enhancements

- Photo upload functionality
- Custom message editor
- Multiple card decks
- Background music
- Social media sharing
- Database integration for personalized messages
- Video message support

---

**Created with ❤️ for celebrating special moments**
