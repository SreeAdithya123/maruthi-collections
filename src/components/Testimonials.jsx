import { testimonials } from '../data/testimonials';

function Stars() {
  return (
    <div className="flex gap-1 text-zari-gold" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-xs">
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-ivory py-24 md:py-32">
      {/* oversized quote glyph */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-display leading-none"
        style={{ fontSize: '26rem', color: 'rgba(107,31,37,0.04)' }}
      >
        &ldquo;
      </span>

      <div className="relative z-10 mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="reveal mb-14 text-center">
          <span className="label-roman">Kept as Heirlooms</span>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-maroon-deep md:text-5xl">
            Worn at weddings,
            <br />
            <em className="italic text-zari-gold">kept as heirlooms.</em>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className={`reveal group flex flex-col rounded-[3px] border p-8 transition-all duration-500 delay-${
                i + 1
              } hover:-translate-y-1`}
              style={{ borderColor: 'rgba(184,137,90,0.35)', background: 'rgba(184,137,90,0.04)' }}
            >
              <Stars />
              <blockquote className="mt-5 grow font-display text-[1.12rem] italic leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <span className="font-roman text-[0.66rem] uppercase tracking-[0.2em] text-maroon">
                  {t.name}
                </span>
                <span className="mt-1 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">
                  {t.city}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
