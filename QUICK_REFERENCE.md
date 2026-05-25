# Quick Reference & Customization Guide

## 🎯 5-Minute Overview

### What Does This App Do?
Interactive birthday card that guides users through:
1. **Open Envelope** → Beautiful intro
2. **Swipe Cards** → 6 personalized messages with Tinder-style swiping
3. **Celebrate** → Confetti animation & congratulations

### Core Technologies
- **Next.js 16** - React framework with App Router
- **React 19** - Component library
- **Tailwind CSS 4** - Utility-first styling
- **TypeScript** - Type-safe JavaScript
- **Canvas API** - Confetti animation

---

## 📁 File Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `app/page.tsx` | Main app & state management | `BirthdayCard` component |
| `app/components/EnvelopePage.tsx` | Intro screen | `EnvelopePage` component |
| `app/components/CardSwiper.tsx` | Card swiping interface | `CardSwiper` component |
| `app/components/CelebrationPage.tsx` | Final celebration | `CelebrationPage` component |
| `app/components/Confetti.tsx` | Particle animation | `Confetti` component |
| `app/data/cards.ts` | Card data | `CARDS` array, `Card` type |
| `app/layout.tsx` | Root layout | `RootLayout` component |

---

## 🛠️ Common Tasks

### Add a New Card
```typescript
// In app/data/cards.ts
{
  id: 7,
  message: "Your new message here 🎯",
  bgGradient: "from-indigo-400 to-purple-500",
  emoji: "🎯",
}
```

### Change Envelope Message
```typescript
// In app/components/EnvelopePage.tsx
// Find this section and edit:
<h2 className="text-3xl font-bold...">
  Your New Message Here!
</h2>
```

### Adjust Card Swipe Sensitivity
```typescript
// In app/components/CardSwiper.tsx, line ~100
const threshold = 100; // Change to 50 for easier, 150 for harder
```

### Add Custom Colors
```typescript
// In CardSwiper.tsx, update gradient mappings:
function getGradientFrom(gradient: string): string {
  const gradients: Record<string, string> = {
    'from-your-color': 'rgb(r, g, b)',
    // ... add your color here
  };
}
```

### Change Confetti Duration
```typescript
// In app/components/Confetti.tsx
if (elapsed < 3000) { // Change 3000 to milliseconds
  animationId = requestAnimationFrame(animate);
}
```

### Modify Card Counter Text
```typescript
// In CardSwiper.tsx
<p className="text-xl font-bold text-purple-700">
  {cardsRemaining} card{cardsRemaining !== 1 ? 's' : ''} left
</p>
```

---

## 🎨 Tailwind CSS Classes Used

### Backgrounds
- `bg-gradient-to-br` - Diagonal gradient
- `from-pink-100 via-purple-100 to-blue-100` - Multi-stop gradient

### Text
- `text-transparent bg-clip-text` - Gradient text
- `font-bold text-2xl` - Font styling
- `text-purple-700` - Text color

### Effects
- `shadow-2xl` - Box shadow
- `rounded-2xl` - Border radius
- `opacity-70` - Transparency
- `blur-3xl` - Background blur

### Animations
- `animate-bounce` - Bouncing animation
- `animate-pulse` - Pulse effect
- `hover:scale-105` - Hover scaling

### Layout
- `flex flex-col` - Flex container
- `items-center justify-center` - Centering
- `gap-8` - Spacing between items
- `p-6` - Padding
- `absolute inset-0` - Full size overlay

---

## 🔄 State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ app/page.tsx (Main App)                                 │
│ State: currentPage = 'envelope' | 'cards' | 'celebration'│
└─────────────────────────────────────────────────────────┘
         │
         ├─→ currentPage === 'envelope'
         │   ↓
         │   EnvelopePage
         │   ├─ onOpen() → setCurrentPage('cards')
         │   └─ 🎁 Opens envelope
         │
         ├─→ currentPage === 'cards'
         │   ↓
         │   CardSwiper
         │   ├─ Manage: currentIndex, position, isDragging
         │   ├─ onAllCardsRemoved() → setCurrentPage('celebration')
         │   └─ Swipe through cards
         │
         └─→ currentPage === 'celebration'
             ↓
             CelebrationPage
             ├─ Confetti component auto-plays
             ├─ onRestart() → setCurrentPage('envelope')
             └─ 🎉 Final celebration
```

---

## 📊 Props Reference

### EnvelopePage Props
```typescript
interface EnvelopePageProps {
  onOpen: () => void;
}
```

### CardSwiper Props
```typescript
interface CardSwiperProps {
  cards: Card[];
  onAllCardsRemoved: () => void;
}
```

### CelebrationPage Props
```typescript
interface CelebrationPageProps {
  onRestart: () => void;
}
```

### Card Type
```typescript
interface Card {
  id: number;
  message: string;
  bgGradient: string;
  emoji: string;
}
```

---

## 🎬 Animation Breakdown

### Confetti Particle Behavior
```
Initial:     Random position above screen
             Random direction (vx, vy)
             Random size (5-15px)
             Random color from palette

Update Loop: Position += velocity
             Velocity.y += gravity (0.1)
             Rotation += rotationSpeed
             Alpha fades from 1 → 0 over 3s

End:         Auto-stops after 3 seconds
```

### Card Swipe Animation
```
Drag Start:  scale: 1 → 1.02
             cursor: grab

During Drag: translateX: dragged amount
             translateY: dragged amount
             rotate: dragged-x * 0.1

Swipe End:   If distance > 100px:
               → Next card (animate out & in)
             Else:
               → Snap back (300ms)
```

---

## 🔌 Integration Points

### Add API Integration
```typescript
// In CardSwiper.tsx, on mount or in effect:
useEffect(() => {
  fetchCardsFromAPI().then(setCards);
}, []);
```

### Add Analytics
```typescript
// In page.tsx, on page changes:
const handleEnvelopeOpen = () => {
  trackEvent('envelope_opened');
  setCurrentPage('cards');
};
```

### Add Authentication
```typescript
// In page.tsx:
const [isLoggedIn, setIsLoggedIn] = useState(false);
if (!isLoggedIn) return <LoginPage />;
```

---

## 🚀 Performance Tips

### Reduce Confetti
```typescript
// In Confetti.tsx, reduce particles:
for (let i = 0; i < 50; i++) { // was 100
```

### Optimize Images
- Use Next.js Image component for card backgrounds
- Lazy load images with `loading="lazy"`

### Code Splitting
```typescript
// Import components with dynamic:
const CelebrationPage = dynamic(
  () => import('./components/CelebrationPage'),
  { ssr: false }
);
```

---

## 📱 Mobile Considerations

### Current Support
- ✅ Touch swipe events
- ✅ Responsive layout
- ✅ Mobile viewport handling
- ✅ Touch-friendly button sizes

### Add Viewport Meta Tag
```html
<!-- In app/layout.tsx -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Test on Mobile
```bash
# Run dev server and visit from mobile browser:
# http://YOUR_IP:3000
```

---

## 🐛 Debug Tips

### Check Component Rendering
```typescript
// Add console logs:
console.log('Current page:', currentPage);
console.log('Card index:', currentIndex);
console.log('Drag position:', position);
```

### Check Event Firing
```typescript
// In CardSwiper.tsx:
const handleMouseDown = (e: React.MouseEvent) => {
  console.log('Mouse down at:', e.clientX, e.clientY);
  setIsDragging(true);
};
```

### Canvas Debugging
```typescript
// In Confetti.tsx:
console.log('Confetti particles:', confetti.length);
console.log('Animation elapsed:', elapsed);
```

### Browser DevTools
- React DevTools: Inspect component state
- Canvas DevTools: Inspect canvas rendering
- Performance Tab: Check animation smoothness

---

## 📈 Growth Ideas

### Feature Additions
1. **Photo Upload**: Let users add their own images
2. **Music**: Background birthday song
3. **Video Message**: Embedded video in envelope
4. **Share**: Share card via email/social
5. **Multiple Recipients**: Create different cards for different people
6. **Countdown**: Days until birthday
7. **Memory Gallery**: Photo slideshow instead of text
8. **Voting**: Let guests vote on favorite message

### Technical Enhancements
1. **Database**: Store cards and recipient data
2. **Authentication**: User accounts to create custom cards
3. **Email Send**: Email cards to recipients
4. **CMS**: Content management for card templates
5. **Analytics**: Track opens, shares, engagement
6. **A/B Testing**: Test different designs

---

## 🎓 Learning Resources

### Used Technologies
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Concepts Demonstrated
- **Client Components**: `'use client'` directive
- **React Hooks**: useState, useRef, useEffect
- **Event Handling**: Mouse and touch events
- **Drag & Drop**: Custom drag implementation
- **Canvas Animation**: Particle physics
- **Responsive Design**: Tailwind CSS
- **TypeScript**: Type-safe interfaces and props

---

## ⚡ Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter

# Maintenance
npm update           # Update dependencies
npm audit            # Check for vulnerabilities
npm audit fix        # Fix vulnerabilities
```

---

## 📞 Customization Support

For common customizations:
1. Edit `app/data/cards.ts` - Change messages/emojis
2. Edit gradient classes - Change colors
3. Edit `handleSwipeEnd()` - Change swipe logic
4. Edit `Confetti.tsx` - Change animation duration

For advanced customizations:
1. Add new components to `app/components/`
2. Import and add routes in `page.tsx`
3. Extend types in `data/cards.ts`

---

**Happy customizing! 🎉**
