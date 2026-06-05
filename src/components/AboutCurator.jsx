import { site } from '../data/site';

const stats = [
  { value: '40+', label: 'Artisans We Work With' },
  { value: '100%', label: 'Natural-Dye Kalamkari' },
  { value: '6 yrs', label: 'In Nidadavole' },
  { value: 'Hand', label: 'Block & Pen-Painted' },
];

export default function AboutCurator() {
  return (
    <section id="story" className="relative overflow-hidden bg-ivory py-24 md:py-32">
      {/* Telugu grace-note watermark (2 of 2) */}
      <span
        aria-hidden="true"
        className="watermark-telugu absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        style={{ fontSize: 'clamp(3rem, 16vw, 15rem)' }}
      >
        {site.brandTelugu}
      </span>

      <div className="relative z-10 mx-auto grid max-w-[1300px] items-center gap-16 px-6 md:grid-cols-2 md:px-12">
        {/* Left — text */}
        <div className="reveal-left">
          <div className="mb-6 flex items-center gap-3">
            <span className="rule-gold" />
            <span className="label-roman">The Curator</span>
          </div>
          <h2 className="font-display text-4xl font-light leading-tight text-maroon-deep md:text-5xl">
            A boutique built
            <br />
            <em className="italic text-zari-gold">on a daughter&rsquo;s eye.</em>
          </h2>

          <div className="mt-7 space-y-5 text-[1.02rem] leading-relaxed text-ink-soft">
            <p>
              Sai Priyanka Godavari grew up watching her mother fold sarees the way other
              mothers folded prayers — slowly, reverently, with both hands. Maruthi Collections
              is the boutique she always imagined: a quiet room in Nidadavole where hand-block
              Kalamkari is treated as art, not merchandise.
            </p>
            <p>
              Every piece at Maruthi is chosen by Priyanka herself — half &amp; half kurtis,
              frocks for women and little girls, cotton sarees and easy daily-wear drapes, from
              Kalamkari artists in Srikalahasti and Machilipatnam she has known by name for years.
              No bulk orders. No mass imports. Just honest cloth, honest stories.
            </p>
          </div>

          <p className="mt-8 font-display text-xl italic text-maroon">
            — Sai Priyanka Godavari
            <span className="mt-1 block font-roman text-[0.62rem] not-italic uppercase tracking-[0.24em] text-ink-soft">
              Founder &amp; Curator, Maruthi Collections
            </span>
          </p>
        </div>

        {/* Right — 2×2 stats */}
        <div className="reveal-right grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-start justify-center border bg-maroon/[0.04] p-7 transition-colors duration-500 hover:bg-maroon/[0.07]"
              style={{ borderColor: 'rgba(184,137,90,0.35)' }}
            >
              <span className="font-display text-[2.8rem] leading-none text-maroon">{s.value}</span>
              <span className="mt-3 font-roman text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
