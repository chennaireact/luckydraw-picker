# Lucky Draw Picker

A clean, presentation-ready lucky draw wheel built with React, Vite, and Framer Motion. Designed for conferences, meetups, and events — with big-screen visibility, smooth animations, and an image-downloadable winner card.

![Lucky Draw Picker](public/chennaireact.webp)

## Features

- **Spin wheel** with easeOutQuart deceleration and tick sound effects
- **Dynamic font sizing** — winner name auto-scales for long names
- **Colorful confetti** with timed bursts for celebration
- **Downloadable winner card** as a clean PNG image
- **Spin duration slider** — 5s to 25s configurable per draw
- **Two-column input** — form on the left, live participant list on the right
- **Presentation mode** — scales up for large screens (1400px+ and 1800px+)
- **Audio feedback** — tick sounds while spinning, chord on winner reveal
- **Clean corporate aesthetic** — no emoji clutter, minimal winner card for exports

## Tech Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Framer Motion](https://motion.dev) — animations
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — confetti effects
- [html2canvas](https://html2canvas.hertzen.com) — winner card image export

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. Enter an **event name** (e.g. "Ticket Giveaway")
2. Type **participant names** separated by commas
3. Set the **spin duration** using the slider (5–25 seconds)
4. Click **Continue** → **Pick a Winner**
5. Celebrate 🎉 — confetti bursts every 5 seconds
6. **Save Image** to download a clean winner card PNG
7. **Draw Again** or start with a **New List**

## Customization

- Swap `public/chennaireact.webp` to update the event logo
- Footer links to [chennaireact.in](https://chennaireact.in) — update in `src/App.jsx`

## License

MIT