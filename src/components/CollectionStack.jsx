import { useRef, useCallback, useState } from 'react';
import { collection, collectionFilters } from '../data/collection';
import { site } from '../data/site';
import { useScrollProgress } from '../hooks/useScrollProgress';

const TOTAL = collection.length;

function classFor(i, active) {
  if (i === active) return 'collection-card active';
  if (i === active - 1) return 'collection-card prev';
  if (i === active - 2) return 'collection-card prev-2';
  if (i < active - 2) return 'collection-card gone';
  return 'collection-card';
}

function Card({ item }) {
  return (
    <article
      className="grid h-[74vh] max-h-[660px] w-full max-w-[1080px] grid-cols-1 overflow-hidden rounded-[3px] border bg-ivory shadow-[0_40px_100px_rgba(74,20,24,0.25)] md:grid-cols-2"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Left — saree visual */}
      <div
        className="relative hidden overflow-hidden md:block"
        style={{ background: `linear-gradient(150deg, ${item.swatch[0]}, ${item.swatch[1]})` }}
      >
        {/* woven texture */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.4px), radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.4px)',
            backgroundSize: '14px 14px, 14px 14px',
            backgroundPosition: '0 0, 7px 7px',
          }}
        />
        {/* zari border strip */}
        <div
          className="absolute inset-y-0 right-0 w-9"
          style={{
            background: `repeating-linear-gradient(45deg, ${item.accent}, ${item.accent} 4px, rgba(0,0,0,0.12) 4px, rgba(0,0,0,0.12) 8px)`,
            boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.25)',
          }}
        />
        {/* motif */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10rem] opacity-[0.12]">
          {item.motif}
        </span>
        {/* category footer */}
        <div className="absolute bottom-6 left-6">
          <span className="font-roman text-[0.62rem] uppercase tracking-[0.24em] text-ivory/85">
            {item.category}
          </span>
          <span className="mt-1 block font-display text-sm italic text-ivory/70">
            {item.region}
          </span>
        </div>
      </div>

      {/* Right — info */}
      <div className="relative flex flex-col justify-center p-8 md:p-12">
        <span className="pointer-events-none absolute right-8 top-6 font-display text-[4rem] leading-none text-zari-gold/15">
          {item.num}
        </span>

        <span className="font-roman text-[0.65rem] uppercase tracking-[0.24em] text-zari-gold">
          {item.category} · {item.region}
        </span>
        <h3 className="mt-3 font-display text-[2.2rem] font-light leading-tight text-maroon-deep">
          {item.title}
        </h3>
        <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-ink-soft/90">
          {item.desc}
        </p>

        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-[1.8rem] text-maroon">{item.price}</span>
          <span className="font-roman text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
            {item.suffix}
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-primary !px-6 !py-2.5">
            Enquire
          </a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost !px-6 !py-2.5">
            See Detail →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function CollectionStack({ id = 'collection' }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const [filter, setFilter] = useState('All');

  const onProgress = useCallback((p) => {
    const active = Math.min(Math.floor(p * TOTAL), TOTAL - 1);
    cardRefs.current.forEach((el, i) => {
      if (el) el.className = classFor(i, active);
    });
    dotRefs.current.forEach((el, i) => {
      if (el) {
        const on = i === active;
        el.style.background = on ? 'var(--zari-gold)' : 'rgba(184,137,90,0.25)';
        el.style.transform = on ? 'scale(1.4)' : 'scale(1)';
      }
    });
  }, []);

  useScrollProgress(trackRef, onProgress);

  return (
    <section id={id} className="relative bg-ivory">
      {/* Header + filters */}
      <div className="mx-auto max-w-[1300px] px-6 pt-24 text-center md:px-12 md:pt-28">
        <span className="label-roman">The Collection</span>
        <h2 className="mt-4 font-display text-4xl font-light leading-tight text-maroon-deep md:text-6xl">
          Eight weaves.
          <br />
          <em className="italic text-zari-gold">One curator&rsquo;s eye.</em>
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {collectionFilters.map((f) => (
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
      </div>

      {/* Scroll track */}
      <div ref={trackRef} className="relative h-[400vh]">
        <div
          className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
          style={{ perspective: '1200px' }}
        >
          {collection.map((item, i) => (
            <div
              key={item.num}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={i === 0 ? 'collection-card active' : 'collection-card'}
            >
              <Card item={item} />
            </div>
          ))}

          {/* Progress dots */}
          <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
            {collection.map((item, i) => (
              <span
                key={item.num}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="h-1.5 w-1.5 rounded-full transition-transform duration-300"
                style={{
                  background: i === 0 ? 'var(--zari-gold)' : 'rgba(184,137,90,0.25)',
                  transform: i === 0 ? 'scale(1.4)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
