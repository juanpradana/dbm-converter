# 📻 Signal Meter Pro

Modern S-Meter & dB Converter - A Progressive Web App (PWA) for converting between S-Meter, dBm, dBµV, and dBV units.

## Features

- ⚡ **Real-time Conversion** - Instant conversion between S-Meter, dBm, dBµV, and dBV
- 📱 **PWA Support** - Installable on mobile and desktop devices
- 🎨 **Glass Morphism UI** - Beautiful, modern design with glassmorphism effects
- 📊 **Reference Table** - Complete S-Meter reference table
- 📝 **Conversion History** - Stores last 10 conversions in localStorage
- 📱 **100% Responsive** - Mobile-first design that works on all devices
- ⚡ **Fast Performance** - Built with Vite for optimal loading times

## Tech Stack

- **Vue 3** with Composition API
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **Vite PWA Plugin** - PWA functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Conversion Formulas

- **dBm to dBµV**: `dBµV = dBm + 107` (50Ω system)
- **dBm to dBV**: `dBV = dBm - 13.01` (50Ω system)
- **S-Meter to dBm**: Based on standard amateur radio table (S1 = -121 dBm, S9 = -73 dBm)

## S-Meter Reference

| S-Meter | dBm | dBµV | dBV |
|---------|-----|------|-----|
| S1 | -121 | -14 | -134.01 |
| S9 | -73 | 34 | -86.01 |
| S9+60 | -13 | 94 | -26.01 |

Full table available in the app's reference section.

## PWA Installation

The app can be installed as a Progressive Web App:

- **Mobile**: Use browser's "Add to Home Screen" option
- **Desktop**: Click the install button when prompted (Chrome/Edge)

## Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions to deploy

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with PWA support

## License

MIT

## Credits

**Developer:** Farzani RBA

Built for Radio Amateur, Telecommunication Engineers, and Electronics Enthusiasts.
