import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RotateCcw, Phone, Star, Check } from 'lucide-react';
import { relatedSarees, inr, occasionLabel } from '../data/sarees';
import { useProducts } from '../context/ProductsContext';
import { site } from '../data/site';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SareeSwatch from '../components/SareeSwatch';
import SareeCard from '../components/SareeCard';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import NotFound from './NotFound';

// Stand-in "angles" of the swatch until real photography exists.
const VIEWS = [
  { label: 'Body', angle: 150, motifSize: '11rem' },
  { label: 'Pallu', angle: 30, motifSize: '8rem' },
  { label: 'Kongu', angle: 95, motifSize: '14rem' },
  { label: 'Fold', angle: 215, motifSize: '6rem' },
];

const SAMPLE_REVIEWS = [
  { name: 'Lakshmi Prasanna', city: 'Rajahmundry', stars: 5, when: '2 months ago', text: 'Wore this at my daughter’s wedding. The zari catches every light. Priyanka packed it like an heirloom.' },
  { name: 'Meera Sridevi', city: 'Tanuku', stars: 5, when: '5 weeks ago', text: 'She showed me four sarees, not fifty. This was the one. That is a curator, not a salesperson.' },
  { name: 'Swapna Reddy', city: 'Bhimavaram', stars: 4, when: '3 months ago', text: 'Falls like water and still photographs like a queen. Will buy again.' },
];

function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-zari-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < Math.round(value) ? 'currentColor' : 'none'} className={i < Math.round(value) ? '' : 'text-ink-soft/40'} />
      ))}
    </span>
  );
}

const TRUST = [
  { icon: ShieldCheck, label: 'GI Certified' },
  { icon: Truck, label: 'Sent from Nidadavole' },
  { icon: RotateCcw, label: '7-Day Promise' },
  { icon: Phone, label: 'Curator Support' },
];

export default function SareeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProduct } = useProducts();
  const saree = getProduct(id);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [view, setView] = useState(0);

  useRevealOnScroll([id]);

  if (!saree) return <NotFound />;

  const inStock = saree.stock > 0;
  const wished = isWishlisted(saree.id);
  const related = relatedSarees(products, saree);
  const gallery = saree.images?.length ? saree.images : null;
  const activeView = gallery ? Math.min(view, gallery.length - 1) : view;
  const waText = encodeURIComponent(
    `Namaskaram Sai Priyanka, I'm interested in "${saree.title}" (${saree.sku}) — ${inr(saree.price)}. Is it available?`
  );

  const buyNow = () => {
    addToCart(saree);
    navigate('/cart');
  };

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* breadcrumb */}
        <nav className="font-roman text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span className="px-2 text-zari-gold">/</span>
          <Link to="/sarees" className="hover:text-maroon">Sarees</Link>
          <span className="px-2 text-zari-gold">/</span>
          <Link to={`/sarees/${saree.weave}`} className="hover:text-maroon">{saree.weaveLabel}</Link>
          <span className="px-2 text-zari-gold">/</span>
          <span className="text-maroon-deep">{saree.title}</span>
        </nav>

        {/* main */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:gap-16">
          {/* gallery */}
          <div className="flex gap-4">
            {(gallery ? gallery.length > 1 : true) && (
              <div className="flex flex-col gap-3">
                {(gallery || VIEWS).map((v, i) => (
                  <button
                    key={gallery ? v : v.label}
                    onClick={() => setView(i)}
                    aria-label={gallery ? `Photo ${i + 1}` : v.label}
                    className={`h-16 w-16 overflow-hidden rounded-[2px] border-2 transition ${
                      activeView === i ? 'border-maroon' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {gallery ? (
                      <img src={v} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <SareeSwatch swatch={saree.swatch} accent={saree.accent} motif={saree.motif} angle={v.angle} motifSize="2rem" className="h-full w-full" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1">
              {gallery ? (
                <img
                  src={gallery[activeView]}
                  alt={saree.title}
                  className="aspect-[4/5] w-full rounded-[3px] object-cover"
                />
              ) : (
                <SareeSwatch
                  swatch={saree.swatch}
                  accent={saree.accent}
                  motif={saree.motif}
                  angle={VIEWS[activeView].angle}
                  motifSize={VIEWS[activeView].motifSize}
                  className="aspect-[4/5] w-full rounded-[3px]"
                />
              )}
              {saree.badge && (
                <span className="absolute left-4 top-4 bg-maroon-deep px-3 py-1 font-roman text-[10px] uppercase tracking-[0.18em] text-ivory">
                  {saree.badge}
                </span>
              )}
            </div>
          </div>

          {/* info */}
          <div>
            <span className="font-roman text-[0.65rem] uppercase tracking-[0.24em] text-zari-gold">
              {saree.weaveLabel} · {saree.region}
            </span>
            <h1 className="mt-2 font-display text-4xl font-light text-maroon-deep">{saree.title}</h1>

            <div className="mt-3 flex items-center gap-3">
              <Stars value={saree.rating} />
              <span className="font-sans text-xs text-ink-soft">{saree.rating} · {saree.reviewCount} reviews</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl text-maroon">{inr(saree.price)}</span>
              {saree.mrp > saree.price && (
                <>
                  <span className="font-sans text-base text-ink-soft line-through">{inr(saree.mrp)}</span>
                  <span className="font-sans text-sm text-peacock-teal">{saree.discount}% off</span>
                </>
              )}
            </div>
            <p className="mt-1 font-sans text-xs text-ink-soft">Inclusive of all taxes</p>

            {/* colour + availability */}
            <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
              <div>
                <span className="font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Colour</span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full border border-border" style={{ background: saree.colorHex }} />
                  <span className="font-sans text-sm text-maroon-deep">{saree.color}</span>
                </div>
              </div>
              <div>
                <span className="font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Availability</span>
                <p className="mt-1.5 font-sans text-sm text-maroon-deep">
                  {inStock ? (saree.isUnique ? 'In stock — One of One' : `In stock — ${saree.stock} available`) : 'Found a home'}
                </p>
              </div>
            </div>

            {/* actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => addToCart(saree)}
                disabled={!inStock}
                className="btn-primary flex-1 justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInCart(saree.id) ? 'In Cart ✓' : 'Add to Cart'}
              </button>
              <button onClick={buyNow} disabled={!inStock} className="btn-ghost flex-1 justify-center disabled:opacity-50">
                Buy Now →
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(saree)}
              className="mt-3 flex items-center gap-2 font-roman text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-maroon"
            >
              <Heart size={14} className={wished ? 'text-maroon' : ''} fill={wished ? 'currentColor' : 'none'} />
              {wished ? 'Saved to wishlist' : 'Save to wishlist'}
            </button>

            {/* trust */}
            <div className="mt-7 grid grid-cols-2 gap-3 border-y py-5 sm:grid-cols-4" style={{ borderColor: 'var(--border)' }}>
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={18} className="text-zari-gold" />
                  <span className="font-roman text-[0.54rem] uppercase tracking-[0.14em] text-ink-soft">{label}</span>
                </div>
              ))}
            </div>

            {/* description */}
            <div className="mt-7">
              <h3 className="font-roman text-[0.62rem] uppercase tracking-[0.22em] text-maroon-deep">The Saree</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{saree.fullDescription}</p>
              {saree.occasion.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {saree.occasion.map((o) => (
                    <span key={o} className="rounded-full bg-maroon/[0.06] px-3 py-1 font-roman text-[0.55rem] uppercase tracking-[0.16em] text-maroon">
                      {occasionLabel(o)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* specs */}
            <div className="mt-7">
              <h3 className="font-roman text-[0.62rem] uppercase tracking-[0.22em] text-maroon-deep">Specifications</h3>
              <dl className="mt-3 divide-y" style={{ borderColor: 'var(--border)' }}>
                {Object.entries(saree.specifications).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b py-2.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                    <dt className="text-ink-soft">{k}</dt>
                    <dd className="text-right text-maroon-deep">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* curator */}
            <div className="mt-7 border bg-maroon/[0.04] p-5" style={{ borderColor: 'rgba(184,137,90,0.35)' }}>
              <p className="font-display text-lg italic text-maroon-deep">Speak to Sai Priyanka</p>
              <p className="mt-1 text-sm text-ink-soft">
                Want to feel the silk first, or ask about this weave? Call the curator directly.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={`tel:${site.phoneTel}`} className="btn-primary !px-5 !py-2.5">{site.phoneDisplay}</a>
                <a href={`https://wa.me/${site.phoneTel.replace('+', '')}?text=${waText}`} target="_blank" rel="noreferrer" className="btn-ghost !px-5 !py-2.5">
                  WhatsApp about this saree →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="reveal text-center font-display text-3xl font-light text-maroon-deep">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {related.map((s) => (
                <SareeCard key={s.id} saree={s} />
              ))}
            </div>
          </section>
        )}

        {/* reviews */}
        <section className="mt-20 pb-24">
          <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display text-3xl font-light text-maroon-deep">Reviews</h2>
            <span className="flex items-center gap-2 text-sm text-ink-soft"><Stars value={saree.rating} size={13} /> {saree.rating} of 5</span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {SAMPLE_REVIEWS.map((r) => (
              <figure key={r.name} className="border p-6" style={{ borderColor: 'var(--border)' }}>
                <Stars value={r.stars} size={13} />
                <blockquote className="mt-3 font-display text-base italic leading-relaxed text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-maroon text-[10px] text-ivory">
                    <Check size={11} />
                  </span>
                  <span className="font-roman text-[0.58rem] uppercase tracking-[0.18em] text-maroon">{r.name} · {r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
