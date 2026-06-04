import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Brand logo lockup: the Hanuman ("Maruti") mark + the wordmark in the site's
 * Cinzel type and maroon/zari-gold palette.
 *
 * The Hanuman art is loaded from /hanuman.png. If that file isn't present yet,
 * the <img> hides itself and the elegant wordmark stands alone — so this is safe
 * to ship before the art is added. Drop a (transparent) PNG at public/hanuman.png
 * and the mark appears everywhere this component is used.
 *
 * tone="dark"  → maroon text (for light/ivory backgrounds: nav)
 * tone="light" → ivory text  (for dark backgrounds: footer)
 */
export default function Logo({ tone = 'dark', markHeight = 40, linked = true, className = '' }) {
  const [hasMark, setHasMark] = useState(true);
  const brand = tone === 'light' ? 'text-ivory' : 'text-maroon-deep';
  const sub = tone === 'light' ? 'text-zari-light' : 'text-zari-gold';

  const inner = (
    <span className="flex items-center gap-2.5">
      {hasMark && (
        <img
          src="/hanuman.png"
          alt=""
          aria-hidden="true"
          onError={() => setHasMark(false)}
          style={{ height: markHeight }}
          className="w-auto shrink-0 object-contain"
        />
      )}
      <span className="flex flex-col leading-none">
        <span
          className={`font-roman font-semibold uppercase tracking-[0.2em] ${brand}`}
          style={{ fontSize: 'clamp(0.98rem, 1.3vw, 1.18rem)' }}
        >
          Maruthi
        </span>
        <span className={`mt-1 flex items-center gap-1.5 font-roman text-[0.58rem] uppercase tracking-[0.3em] ${sub}`}>
          <span className="inline-block h-px w-2.5 bg-current opacity-70" />
          Collections
          <span className="inline-block h-px w-2.5 bg-current opacity-70" />
        </span>
      </span>
    </span>
  );

  return linked ? (
    <Link to="/" aria-label="Maruthi Collections — home" className={className}>
      {inner}
    </Link>
  ) : (
    <span className={className}>{inner}</span>
  );
}
