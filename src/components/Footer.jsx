import { Link } from 'react-router-dom';
import { site } from '../data/site';
import Logo from './Logo';

const columns = [
  {
    head: 'Collections',
    links: [
      'Kanjivaram',
      'Banarasi',
      'Uppada Pattu',
      'Pochampally',
      'Gadwal',
      'Venkatagiri',
    ],
  },
  {
    head: 'The Boutique',
    links: ['The Curator', 'Visit Us', 'Press & Stories', 'GI Certification', 'Care Guide'],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-maroon-deep text-ivory">
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 pb-16 pt-20 md:grid-cols-[2fr_1fr_1fr_1.2fr] md:px-12">
        {/* Brand blurb */}
        <div>
          <Logo tone="light" markHeight={48} />
          <p className="mt-3 font-display text-2xl italic text-zari-light">{site.tagline}.</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">
            A boutique saree house in Nidadavole, curated by {site.owner} since 2018.
          </p>
          <p className="watermark-telugu mt-6 text-xl" style={{ color: 'rgba(245,239,227,0.18)' }}>
            {site.brandTelugu}
          </p>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.head}>
            <h4 className="font-roman text-[0.65rem] uppercase tracking-[0.2em] text-zari-gold">
              {col.head}
            </h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    to="/collection"
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-zari-light"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Connect */}
        <div>
          <h4 className="font-roman text-[0.65rem] uppercase tracking-[0.2em] text-zari-gold">
            Connect
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-ivory/70">
            <li>
              <a href={`tel:${site.phoneTel}`} className="hover:text-zari-light">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-zari-light">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-zari-light">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.facebook} target="_blank" rel="noreferrer" className="hover:text-zari-light">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-ivory/10 px-6 py-6 text-xs text-ivory/50 md:flex-row md:items-center md:justify-between md:px-12">
        <span>© 2025 Maruthi Collections, Nidadavole.</span>
        <span className="font-display italic text-sm text-zari-light/80">
          Every saree, hand-picked. Every story, kept.
        </span>
      </div>

      {/* Oversized editorial signature */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display font-medium leading-[0.8] text-ivory"
        style={{ fontSize: 'clamp(3rem, 13vw, 13rem)', opacity: 0.06, marginTop: '-0.1em' }}
      >
        MARUTHI COLLECTIONS
      </div>
    </footer>
  );
}
