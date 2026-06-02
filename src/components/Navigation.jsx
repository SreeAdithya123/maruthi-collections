import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { site, navLinks } from '../data/site';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] flex justify-center px-4 pt-4 md:px-8 md:pt-5">
      <nav
        className={`flex w-full max-w-[1400px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-8 ${
          scrolled
            ? 'border border-border bg-ivory/75 shadow-[0_10px_40px_rgba(74,20,24,0.08)] backdrop-blur-md'
            : 'border border-transparent bg-transparent'
        }`}
      >
        {/* Logo — two lines */}
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-roman text-[0.95rem] uppercase tracking-[0.28em] text-maroon-deep md:text-[1.05rem]">
            Maruthi <span className="hidden sm:inline">Collections</span>
          </span>
          <span className="mt-1 font-display text-[0.72rem] italic text-ink-soft">
            {site.est}
          </span>
        </Link>

        {/* Center links */}
        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `font-roman text-[0.72rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? 'text-maroon' : 'text-ink-soft hover:text-maroon'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link to="/visit" className="hidden btn-primary !px-6 !py-2.5 md:inline-flex">
            Enquire
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${
                open ? 'translate-y-[6px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${
                open ? '-translate-y-[6px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-8 bg-ivory/95 backdrop-blur-md transition-opacity duration-400 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {navLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            onClick={() => setOpen(false)}
            className="font-display text-4xl text-maroon-deep"
          >
            {l.label}
          </NavLink>
        ))}
        <Link to="/visit" onClick={() => setOpen(false)} className="btn-primary mt-4">
          Enquire
        </Link>
      </div>
    </header>
  );
}
