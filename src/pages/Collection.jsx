import { useState } from 'react';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { collection } from '../data/collection';
import { site } from '../data/site';
import RegionGrid from '../components/RegionGrid';

const FILTERS = ['All', 'Bridal', 'Festive', 'Daily'];

function GalleryCard({ item }) {
  return (
    <article
      className="reveal group overflow-hidden rounded-[3px] border bg-ivory"
      style={{ borderColor: 'var(--border)' }}
      data-cursor
    >
      <div
        className="relative h-64 overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${item.swatch[0]}, ${item.swatch[1]})` }}
      >
        <div
          className="absolute inset-0 opacity-[0.18] transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.4px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-7"
          style={{
            background: `repeating-linear-gradient(45deg, ${item.accent}, ${item.accent} 4px, rgba(0,0,0,0.12) 4px, rgba(0,0,0,0.12) 8px)`,
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-7xl opacity-[0.14]">
          {item.motif}
        </span>
        <span className="absolute left-5 top-5 font-display text-3xl text-ivory/25">{item.num}</span>
      </div>

      <div className="p-6">
        <span className="font-roman text-[0.6rem] uppercase tracking-[0.22em] text-zari-gold">
          {item.category} · {item.region}
        </span>
        <h3 className="mt-2 font-display text-2xl text-maroon-deep">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft/90 line-clamp-3">{item.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-xl text-maroon">
            {item.price}{' '}
            <span className="font-roman text-[0.55rem] uppercase tracking-[0.18em] text-ink-soft">
              {item.suffix}
            </span>
          </span>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="font-roman text-[0.62rem] uppercase tracking-[0.18em] text-maroon hover:text-zari-gold"
          >
            Enquire →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Collection() {
  const [filter, setFilter] = useState('All');
  const items =
    filter === 'All' ? collection : collection.filter((c) => c.tags.includes(filter));
  // Re-run reveal observer whenever the filtered set changes.
  useRevealOnScroll([filter]);

  return (
    <div className="bg-ivory">
      {/* Header band */}
      <header className="px-6 pb-10 pt-36 text-center md:px-12 md:pt-40">
        <span className="label-roman">The Collection</span>
        <h1 className="mt-4 font-display text-5xl font-light text-maroon-deep md:text-7xl">
          Eight weaves. <em className="italic text-zari-gold">One curator&rsquo;s eye.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink-soft">
          Every saree below is hand-picked by Sai Priyanka from looms she has known for years.
          Prices are a starting point — the conversation is the real thing.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`font-roman text-[0.66rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                filter === f ? 'text-maroon' : 'text-ink-soft hover:text-maroon'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="mx-auto max-w-[1300px] px-6 pb-24 md:px-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.num} item={item} />
          ))}
        </div>
      </div>

      <RegionGrid />
    </div>
  );
}
