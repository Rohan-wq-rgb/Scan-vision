# QR Studio — High-Resolution QR Code Generator

A modern, fast, client-side web application to generate downloadable, high-resolution QR codes from any URL. Designed with an ultra-clean obsidian dark interface, instant live rendering, customizable styling, center logo embedding, and lossless vector SVG / 4K Ultra-HD exports.

![QR Studio Preview](https://raw.githubusercontent.com/github/explore/main/topics/qr-code/qr-code.png)

---

## ✨ Features

- **⚡ Instant Live Rendering**: Generates QR codes on-the-fly as you type or paste URLs.
- **🎨 Custom Styling & Color Palettes**:
  - High-contrast presets (Obsidian & Cyan, Monochrome, Midnight Blue, Emerald Forest, etc.).
  - Custom foreground and background hex color selectors.
  - Transparent background support.
  - Module pattern styles: Classic Square, Smooth Rounded, and Circular Dots.
- **🖼️ Logo & Icon Embedding**: Embed emojis, presets, or custom uploaded brand logos directly into the center of the QR code with automatic error-correction adjustment.
- **🏷️ Call-to-Action Frames**: Choose from Top Header, Bottom Banner, or Minimal Badge frames with customizable CTA text (e.g., `SCAN ME`, `VISIT WEBSITE`).
- **📐 Multi-Format & Multi-Resolution Export**:
  - **Vector SVG**: Infinitely scalable, lossless vector output suitable for print, billboards, and packaging.
  - **Ultra-HD Raster**: 512px, 1024px, 2048px (300 DPI Print-Ready), and 4096px (4K Ultra-HD).
  - Supported raster formats: **PNG**, **JPEG**, **WebP**.
- **📋 One-Click Copy**: Copy generated QR image directly to clipboard for fast pasting into Slack, Figma, Word, or Canva.
- **🕒 Local History**: Automatically saves recent QR codes locally for quick reloading.
- **🔒 100% Private & Client-Side**: All QR codes and images are processed locally in your browser. No URLs or assets are logged to external servers.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 24+
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# 2. Navigate to the project directory
cd <your-repo-name>

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Building for Production

To create an optimized production build in the `dist/` directory:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deployment to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Easy Steps to Deploy:

1. Push your code to your GitHub repository on `main` or `master` branch.
2. In your GitHub repository, go to **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically trigger, build the application, and publish it to `https://<your-username>.github.io/<your-repo-name>/`.

---

## ☁️ Deploy to Other Platforms

### Deploying to Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Click **Deploy**.

### Deploying to Netlify
1. Import your repository into [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **QR Engine**: [node-qrcode](https://github.com/soldair/node-qrcode)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/) & [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
