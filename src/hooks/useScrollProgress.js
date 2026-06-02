import { useEffect } from 'react';

/**
 * Reports scroll progress (0 → 1) through a tall section, via a callback so the
 * consumer can update the DOM imperatively without triggering React re-renders
 * on every frame.
 *
 * progress 0  = section top aligned with viewport top
 * progress 1  = section bottom aligned with viewport bottom
 *
 * @param {React.RefObject<HTMLElement>} ref       the tall (e.g. 400vh) section
 * @param {(p:number)=>void} onProgress            called with clamped progress
 */
export function useScrollProgress(ref, onProgress) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let rafId = 0;
    let ticking = false;

    const compute = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      onProgress(p);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(compute);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [ref, onProgress]);
}
