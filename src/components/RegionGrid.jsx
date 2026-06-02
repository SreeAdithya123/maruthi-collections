import { regions } from '../data/regions';

export default function RegionGrid() {
  return (
    <section className="bg-ivory-soft py-24 md:py-32">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12">
        <div className="reveal mb-14 text-center">
          <span className="label-roman">Browse by Region</span>
          <h2 className="mt-4 font-display text-4xl font-light text-maroon-deep md:text-6xl">
            Where the silk <em className="italic text-zari-gold">comes from.</em>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, i) => (
            <div
              key={r.name}
              className={`reveal group relative h-72 cursor-pointer overflow-hidden rounded-[3px] delay-${
                (i % 3) + 1
              }`}
              data-cursor
            >
              {/* swatch */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                style={{ background: `linear-gradient(155deg, ${r.swatch[0]}, ${r.swatch[1]})` }}
              />
              {/* woven texture */}
              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.4px)',
                  backgroundSize: '13px 13px',
                }}
              />
              {/* darken on hover */}
              <div className="absolute inset-0 bg-maroon-deep/0 transition-colors duration-500 group-hover:bg-maroon-deep/25" />

              {/* content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <h3 className="font-display text-3xl text-ivory">{r.name}</h3>
                <p className="mt-1 font-display text-base italic text-ivory/80">{r.note}</p>
                <p className="mt-3 max-h-0 overflow-hidden font-roman text-[0.6rem] uppercase tracking-[0.2em] text-zari-light opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">
                  {r.weaves}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
