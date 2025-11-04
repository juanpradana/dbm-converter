# PWA Icons Setup

This app requires PWA icons for proper installation. You need to create two icon files:

## Required Icons

- `public/icon-192.png` - 192x192 pixels
- `public/icon-512.png` - 512x512 pixels

## How to Generate Icons

### Option 1: Using Online Tools
1. Go to https://realfavicongenerator.net/ or https://favicon.io/
2. Upload or create a 512x512 PNG image
3. Download the generated icons
4. Place `icon-192.png` and `icon-512.png` in the `public/` folder

### Option 2: Using Image Editor
1. Create a 512x512 PNG image with your app logo/icon
2. Resize it to 192x192 for the smaller icon
3. Save both files in the `public/` folder

### Option 3: Using Command Line (if ImageMagick is installed)
```bash
# Convert SVG to PNG (if you have an SVG logo)
convert -background none -size 192x192 logo.svg public/icon-192.png
convert -background none -size 512x512 logo.svg public/icon-512.png
```

## Temporary Workaround

If you don't have icons yet, the app will still work, but PWA installation might not work properly. You can use a simple colored square or the existing vite.svg as a placeholder.

The vite-plugin-pwa will automatically include these icons in the manifest when they exist.
