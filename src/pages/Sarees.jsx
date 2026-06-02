import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { filterSarees, categories } from '../data/sarees';
import SareeCard from '../components/SareeCard';
import SareeFilters from '../components/SareeFilters';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest first' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Loved' },
];

export default function Sarees() {
  const { category = 'all' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const getArr = (k) => searchParams.get(k)?.split(',').filter(Boolean) || [];
  const selected = {
    bands: getArr('price'),
    weave: getArr('weave'),
    fabric: getArr('fabric'),
    occasion: getArr('occasion'),
    color: getArr('color'),
    region: getArr('region'),
  };
  const sortBy = searchParams.get('sort') || 'featured';

  const onToggle = (key, val) => {
    const cur = getArr(key);
    const next = cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val];
    const sp = new URLSearchParams(searchParams);
    if (next.length) sp.set(key, next.join(','));
    else sp.delete(key);
    setSearchParams(sp, { replace: true });
  };
  const onSort = (e) => {
    const sp = new URLSearchParams(searchParams);
    if (e.target.value === 'featured') sp.delete('sort');
    else sp.set('sort', e.target.value);
    setSearchParams(sp, { replace: true });
  };
  const clearAll = () => setSearchParams({}, { replace: true });

  const results = filterSarees({ category, ...selected, sortBy });
  const activeCat = categories.find((c) => c.slug === category) || categories[0];

  useRevealOnScroll([category, searchParams.toString()]);

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        {/* breadcrumb */}
        <nav className="font-roman text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span className="px-2 text-zari-gold">/</span>
          <Link to="/sarees" className="hover:text-maroon">Sarees</Link>
          {category !== 'all' && (
            <>
              <span className="px-2 text-zari-gold">/</span>
              <span className="text-maroon-deep">{activeCat.label}</span>
            </>
          )}
        </nav>

        {/* header */}
        <div className="mt-5">
          <span className="label-roman">The Collection</span>
          <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep md:text-6xl">
            {category === 'all' ? 'Every saree, hand-picked.' : activeCat.label}
          </h1>
        </div>

        {/* category pills */}
        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((c) => {
            const to = c.slug === 'all' ? '/sarees' : `/sarees/${c.slug}`;
            const active = c.slug === category;
            return (
              <Link
                key={c.slug}
                to={to}
                className={`whitespace-nowrap rounded-full border px-4 py-2 font-roman text-[0.62rem] uppercase tracking-[0.16em] transition ${
                  active
                    ? 'border-maroon bg-maroon text-ivory'
                    : 'border-border text-ink-soft hover:border-maroon hover:text-maroon'
                }`}
              >
                {c.label} <span className="opacity-60">{c.count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* toolbar */}
      <div className="mx-auto mt-8 max-w-[1500px] px-6 md:px-10">
        <div className="flex items-center justify-between border-y py-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawer(true)}
              className="flex items-center gap-2 font-roman text-[0.62rem] uppercase tracking-[0.18em] text-maroon-deep lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <span className="font-sans text-sm text-ink-soft">
              {results.length} {results.length === 1 ? 'saree' : 'sarees'}
            </span>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="hidden font-roman text-[0.6rem] uppercase tracking-[0.18em] sm:inline">Sort</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={onSort}
                className="appearance-none border bg-ivory py-2 pl-3 pr-8 font-sans text-sm text-maroon-deep outline-none"
                style={{ borderColor: 'var(--border)' }}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-soft" />
            </div>
          </label>
        </div>
      </div>

      {/* body */}
      <div className="mx-auto max-w-[1500px] px-6 pb-24 md:px-10">
        <div className="flex gap-10">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-28">
              <SareeFilters selected={selected} onToggle={onToggle} onClear={clearAll} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <p className="font-display text-2xl italic text-maroon-deep">No sarees match just yet.</p>
                <p className="mt-2 text-ink-soft">Try fewer filters — or let Sai Priyanka find one for you.</p>
                <button onClick={clearAll} className="btn-ghost mt-6">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                {results.map((s) => (
                  <SareeCard key={s.id} saree={s} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile filter drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[1100] lg:hidden">
          <div className="absolute inset-0 bg-maroon-deep/40" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-ivory p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-roman text-sm uppercase tracking-[0.2em] text-maroon-deep">Filters</span>
              <button onClick={() => setDrawer(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <SareeFilters selected={selected} onToggle={onToggle} onClear={clearAll} />
            <button onClick={() => setDrawer(false)} className="btn-primary mt-6 w-full">
              Show {results.length} sarees
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
