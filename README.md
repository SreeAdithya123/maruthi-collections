# Maruthi Collections — _Threads of the Godavari_

A cinematic, scroll-driven website for **Maruthi Collections**, a boutique South
Indian saree house in Nidadavole, Andhra Pradesh, curated by Sai Priyanka
Godavari. The hero is a 56-second saree film rendered as a **scroll-scrubbed
frame sequence**; the rest of the site is a warm-ivory, editorial heritage
experience.

## Tech stack

- **Vite + React** (SWC)
- **Tailwind CSS v3** + CSS variables for the Maruthi palette
- **GSAP / ScrollTrigger** — hero frame scrubbing + pinning
- **Lenis** — smooth scroll (synced to GSAP's ticker)
- **Framer Motion** — entrance micro-interactions
- **Three.js** — the Namaskaram avatar on the Visit page (lazy-loaded, with a
  graceful CSS fallback if WebGL is unavailable)
- **React Router** — Home / Collection / Story / Visit

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## The hero frame pipeline

The raw source is 282 4K frames in [`vid_frames/`](vid_frames/)
(`ezgif-frame-001.jpg` … `ezgif-frame-282.jpg`). These are **not** loaded
directly — preloading 282 frames at 3840×2160 would decode to several GB in the
browser, and they carry a corner watermark.

[`scripts/process-frames.ps1`](scripts/process-frames.ps1) downscales them to
**1280×720**, paints out the watermark, and writes the web sequence to
[`public/frames/`](public/frames/) as `frame_0001.jpg` … `frame_0282.jpg`.
Regenerate anytime:

```powershell
pwsh ./scripts/process-frames.ps1
```

`src/hooks/useCanvasFrames.js` preloads that sequence and scrubs it on scroll;
`FRAME_COUNT` is set in `src/components/HeroCanvas.jsx`.

## Project structure

```
src/
  components/   Cursor, Navigation, HeroCanvas, Marquee, AboutCurator,
                VideoScrollText, CollectionStack, RegionGrid, Testimonials,
                ContactAvatar (Three.js), ContactForm, ContactSection, Footer
  hooks/        useCanvasFrames, useScrollProgress, useRevealOnScroll
  data/         collection, regions, testimonials, site
  pages/        Home, Collection, Story, Visit
public/frames/  web-ready hero frames (generated)
vid_frames/     raw 4K source frames
scripts/        process-frames.ps1
```

## Deployment (Netlify)

[`netlify.toml`](netlify.toml) is preconfigured with the SPA redirect and
long-cache headers for `/frames/*`.

1. Push to GitHub (this repo).
2. In Netlify: **New site from Git** → pick this repo.
3. Build command `npm run build`, publish directory `dist`.

## Notes

- Enquiry CTAs and the contact form open a prefilled **WhatsApp** chat to
  +91 86392 32932 — no backend required.
- The custom gold cursor and most scroll motion are desktop-only / respect
  `prefers-reduced-motion`.

---

© 2025 Maruthi Collections, Nidadavole. _Every saree, hand-picked. Every story, kept._
