import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Brand splash on initial load: Hanuman mark + wordmark on ivory, held ~2s,
 * then fades to reveal the site. Mounted once at the app root, so it shows on a
 * full page load but NOT on in-app (SPA) navigation. Honours reduced-motion.
 */
const HOLD_MS = 2000;

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => setShow(false), reduce ? 600 : HOLD_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <motion.img
            src="/hanuman.png"
            alt=""
            className="h-40 w-auto md:h-52"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.div
            className="mt-5 flex flex-col items-center leading-none"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="font-roman text-2xl font-semibold uppercase tracking-[0.24em] text-maroon-deep md:text-4xl">
              Maruthi
            </span>
            <span className="mt-2 flex items-center gap-2 font-roman text-[0.62rem] uppercase tracking-[0.34em] text-zari-gold md:text-xs">
              <span className="h-px w-6 bg-current opacity-70" />
              Collections
              <span className="h-px w-6 bg-current opacity-70" />
            </span>
            <span className="mt-4 font-display text-sm italic text-ink-soft md:text-base">
              Threads of the Godavari
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
