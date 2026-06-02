import { useEffect, useRef } from 'react';

/**
 * Antique-gold dot (tracks 1:1) + lagging gold ring. Hover over interactive
 * elements scales both up and warms the colour. Disabled on touch devices.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      rafId = requestAnimationFrame(loop);
    };

    const interactiveSel = 'a, button, input, textarea, select, label, [data-cursor]';
    const onOver = (e) => {
      if (e.target.closest?.(interactiveSel)) {
        document.documentElement.classList.add('cursor--hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest?.(interactiveSel)) {
        document.documentElement.classList.remove('cursor--hover');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    loop();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('cursor--hover');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <i />
      </div>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <i />
      </div>
    </>
  );
}
