import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed frame sequence on a <canvas>.
 *
 * Frames are expected at `${framePath}/frame_0001.jpg` … (1-based, 4-digit).
 * The hook pins the canvas' parent and scrubs through every frame as the user
 * scrolls. Frames are pre-loaded once and drawn with a cover-fit.
 *
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {number} frameCount        total frames available
 * @param {string} framePath         public path to the frame folder
 * @param {number} pxPerFrame        scroll distance (px) allotted per frame
 */
export function useCanvasFrames(canvasRef, frameCount, framePath = '/frames', pxPerFrame = 11) {
  // Defined OUTSIDE the effect so the same arrays survive re-renders.
  const images = useRef([]);
  const state = useRef({ frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // Wider-gamut context where supported; gracefully fall back to sRGB.
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
      const canvasRatio = vw / vh;
      const imgRatio = img.width / img.height;
      let dW, dH, oX, oY;
      if (imgRatio > canvasRatio) {
        dH = vh;
        dW = dH * imgRatio;
        oX = (vw - dW) / 2;
        oY = 0;
      } else {
        dW = vw;
        dH = dW / imgRatio;
        oX = 0;
        oY = (vh - dH) / 2;
      }
      ctx.drawImage(img, oX, oY, dW, dH);
    };

    const render = () => {
      const idx = Math.min(frameCount - 1, Math.max(0, Math.round(state.current.frame)));
      const img = images.current[idx];
      if (img && img.complete && img.naturalWidth) drawCover(img);
    };

    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = Math.floor(vw * dpr);
      canvas.height = Math.floor(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      // setTransform (not scale) so the DPR factor never compounds on resize.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#F5EFE3';
      ctx.fillRect(0, 0, vw, vh);
      render();
    };

    // Preload every frame.
    const srcFor = (i) => `${framePath}/frame_${String(i + 1).padStart(4, '0')}.jpg`;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = srcFor(i);
      img.onload = () => {
        // Paint as soon as the currently-needed frame is ready.
        if (Math.round(state.current.frame) === i) render();
      };
      images.current[i] = img;
    }

    resize();
    window.addEventListener('resize', resize);

    const tween = gsap.to(state.current, {
      frame: frameCount - 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: canvas.parentElement,
        start: 'top top',
        end: () => `+=${Math.round(frameCount * pxPerFrame)}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener('resize', resize);
      images.current = [];
    };
  }, [canvasRef, frameCount, framePath, pxPerFrame]);
}
