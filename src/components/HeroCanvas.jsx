import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useCanvasFrames } from '../hooks/useCanvasFrames';
import { site } from '../data/site';

// 282 frames live in /public/frames as frame_0001.jpg … frame_0282.jpg
const FRAME_COUNT = 282;

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const lenis = useLenis();
  // Shorter pinned scroll on phones; longer & more cinematic on desktop.
  const [pxPerFrame] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 7 : 11
  );

  useCanvasFrames(canvasRef, FRAME_COUNT, '/frames', pxPerFrame);

  const scrollTo = useCallback(
    (sel) => (e) => {
      e.preventDefault();
      const el = document.querySelector(sel);
      if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      else if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    [lenis]
  );

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ivory">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'contrast(1.06) saturate(1.12) brightness(1.02)' }}
      />

      {/* Soft scrim confined to the left column only — keeps the film bright
          and true while the headline stays legible. No full-frame wash. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ivory/80 via-ivory/15 to-transparent md:w-[55%] md:from-ivory/85 md:via-ivory/10" />

      {/* Hero copy */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="rule-gold" />
            <span className="label-roman">A Saree House from the Godavari</span>
          </div>

          <h1 className="font-display text-6xl font-light leading-[1.04] text-maroon-deep md:text-8xl">
            Threads
            <br />
            <em className="italic text-zari-gold">of the Godavari.</em>
          </h1>

          <p className="mt-6 max-w-lg font-display text-lg leading-relaxed text-ink-soft md:text-xl">
            Maruthi Collections is a curated saree boutique in Nidadavole, where every
            Kanjivaram, Banarasi, and Pochampally is hand-chosen by Sai Priyanka — one weave
            at a time.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#collection" onClick={scrollTo('#collection')} className="btn-primary">
              View the Collection
            </a>
            <a href="#visit" onClick={scrollTo('#visit')} className="btn-ghost">
              Visit the Store →
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-display text-sm italic text-ink-soft">scroll to unfold the silk</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-zari-gold to-transparent" />
      </motion.div>

      {/* Telugu grace note watermark (1 of 2 on the site) */}
      <span
        aria-hidden="true"
        className="watermark-telugu absolute bottom-6 right-6 z-10 hidden text-2xl md:block"
        style={{ color: 'rgba(74,20,24,0.10)' }}
      >
        {site.brandTelugu}
      </span>
    </section>
  );
}
