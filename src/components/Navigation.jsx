import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { site, navLinks } from '../data/site';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function Badge({ n }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-maroon px-1 text-[10px] leading-none text-ivory">
      {n}
    </span>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { items: wishItems } = useWishlist();
  const { user, isAdmin } = useAuth();

  const forceSolid = pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || forceSolid;

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] flex justify-center px-4 pt-4 md:px-8 md:pt-5">
      <nav
        className={`flex w-full max-w-[1500px] items-center justify-between rounded-full px-5 py-3 transition-all duration-500 md:px-8 ${
          solid
            ? 'border border-border bg-ivory/80 shadow-[0_10px_40px_rgba(74,20,24,0.08)] backdrop-blur-md'
            : 'border border-transparent bg-transparent'
        }`}
      >
        {/* Logo */}
        <Logo markHeight={38} />

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

        {/* Right cluster */}
        <div className="flex items-center gap-4 md:gap-5">
          <Link to="/wishlist" aria-label="Saved" className="relative text-maroon-deep transition-colors hover:text-maroon">
            <Heart size={19} />
            <Badge n={wishItems.length} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative text-maroon-deep transition-colors hover:text-maroon">
            <ShoppingBag size={19} />
            <Badge n={itemCount} />
          </Link>
          <Link to={user ? '/account' : '/login'} aria-label="Account" className="text-maroon-deep transition-colors hover:text-maroon">
            <User size={19} />
          </Link>
          {isAdmin && (
            <Link to="/admin" className="hidden font-roman text-[0.62rem] uppercase tracking-[0.18em] text-maroon transition-colors hover:text-zari-gold lg:inline">
              Admin
            </Link>
          )}
          <Link to="/visit" className="hidden btn-primary !px-6 !py-2.5 md:inline-flex">Enquire</Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`h-px w-6 bg-maroon-deep transition-all duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-8 bg-ivory/95 backdrop-blur-md transition-opacity duration-300 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {navLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className="font-display text-4xl text-maroon-deep">
            {l.label}
          </NavLink>
        ))}
        <NavLink to={user ? '/account' : '/login'} onClick={() => setOpen(false)} className="font-display text-4xl text-maroon-deep">
          {user ? 'Account' : 'Sign In'}
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" onClick={() => setOpen(false)} className="font-display text-4xl text-maroon-deep">
            Admin
          </NavLink>
        )}
        <Link to="/visit" onClick={() => setOpen(false)} className="btn-primary mt-4">Enquire</Link>
      </div>
    </header>
  );
}
