import { useEffect, useRef } from 'react';

/**
 * Scroll-scrubbed frame sequence on a <canvas>, driven by `position: sticky`
 * (NOT GSAP pinning). The hero is a tall section; an inner sticky 100vh box
 * holds the canvas. As the section scrolls past, progress 0→1 maps to the
 * frame index.
 *
 * Why not GSAP ScrollTrigger pin? Pinning reparents the hero into a pin-spacer
 * div outside React's control; on client-side route changes React then fails to
 * remove the node ("NotFoundError: removeChild"), crashing navigation. Sticky
 * keeps the DOM entirely React-owned.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {React.RefObject<HTMLElement>} sectionRef  the tall outer section
 * @param {number} frameCount
 * @param {string} framePath
 * @param {number} pxPerFrame  scroll distance allotted per frame
 */
export function useCanvasFrames(canvasRef, sectionRef, frameCount, framePath = '/frames', pxPerFrame = 11) {
  const images = useRef([]);
  const lastIdx = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    let ctx = null;
    try {
      ctx = canvas.getContext('2d', { alpha: false, colorSpace: 'display-p3' });
    } catch (e) {
      ctx = null;
    }
    if (!ctx) ctx = canvas.getContext('2d', { alpha: false });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const drawCover = (img) => {
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

    const renderFrame = (idx) => {
      const i = Math.min(frameCount - 1, Math.max(0, idx));
      const img = images.current[i];
      if (img && img.complete && img.naturalWidth) drawCover(img);
    };

    const update = () => {
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = -section.getBoundingClientRect().top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      const idx = Math.round(p * (frameCount - 1));
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        renderFrame(idx);
      }
    };

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#F5EFE3';
      ctx.fillRect(0, 0, vw, vh);
      lastIdx.current = -1;
      update();
    };

    // Preload all frames.
    const srcFor = (i) => `${framePath}/frame_${String(i + 1).padStart(4, '0')}.jpg`;
    for (let i = 0; i < frameCount; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.src = srcFor(i);
      img.onload = () => {
        if (i === lastIdx.current || (lastIdx.current <= 0 && i === 0)) renderFrame(i);
      };
      images.current[i] = img;
    }

    resize();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          update();
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      images.current = [];
    };
  }, [canvasRef, sectionRef, frameCount, framePath, pxPerFrame]);
}
