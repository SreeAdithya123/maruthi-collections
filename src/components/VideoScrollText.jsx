import { useRef, useEffect, useCallback } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

// A short looped segment of the hero film (frames already cached by the hero).
const SLICE_START = 120; // 1-based first frame
const SLICE_LEN = 90;
const FPS = 12;

const LINES = [
  { text: 'Every piece we sell', threshold: 0.15, gold: false },
  { text: 'was drawn by hand, dyed with leaf and root,', threshold: 0.35, gold: false },
  { text: 'and chosen one by one.', threshold: 0.55, gold: true },
];

export default function VideoScrollText() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const lineRefs = useRef([]);

  // Looping canvas playback of the slice.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vw = 0;
    let vh = 0;

    const imgs = [];
    for (let i = 0; i < SLICE_LEN; i += 1) {
      const img = new Image();
      img.src = `/frames/frame_${String(SLICE_START + i).padStart(4, '0')}.jpg`;
      imgs.push(img);
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      vw = r.width;
      vh = r.height;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#F5EFE3';
      ctx.fillRect(0, 0, vw, vh);
    };

    const draw = (img) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cr = vw / vh;
      const ir = img.width / img.height;
      let dW, dH, oX, oY;
      if (ir > cr) {
        dH = vh;
        dW = dH * ir;
        oX = (vw - dW) / 2;
        oY = 0;
      } else {
        dW = vw;
        dH = dW / ir;
        oX = 0;
        oY = (vh - dH) / 2;
      }
      ctx.drawImage(img, oX, oY, dW, dH);
    };

    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let last = 0;
    let rafId = 0;
    const tick = (t) => {
      if (t - last > 1000 / FPS) {
        last = t;
        draw(imgs[frame % SLICE_LEN]);
        frame += 1;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Reveal lines as the sticky section scrolls.
  const onProgress = useCallback((p) => {
    LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const local = Math.min(1, Math.max(0, (p - line.threshold) / 0.12));
      el.style.opacity = String(local);
      el.style.transform = `translateY(${(1 - local) * 28}px)`;
    });
  }, []);

  useScrollProgress(sectionRef, onProgress);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-maroon-deep">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* Maroon scrim for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[rgba(42,20,16,0.5)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-maroon-deep/40" />

        <div className="relative z-10 max-w-4xl px-6 text-center">
          {LINES.map((line, i) => (
            <p
              key={line.text}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`font-display leading-tight ${
                line.gold
                  ? 'mt-2 text-4xl italic text-zari-light md:text-6xl'
                  : 'text-4xl text-ivory md:text-6xl'
              }`}
              style={{ opacity: 0, transform: 'translateY(28px)' }}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
