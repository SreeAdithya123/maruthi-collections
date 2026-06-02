import { useEffect } from 'react';

/**
 * Adds `.visible` to every `.reveal*` element once it scrolls into view.
 * Call once per page; pass a dependency that changes when the page's content
 * is mounted so the observer re-queries fresh nodes.
 */
export function useRevealOnScroll(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
