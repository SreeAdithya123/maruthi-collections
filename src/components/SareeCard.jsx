import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { inr } from '../data/sarees';
import SareeSwatch from './SareeSwatch';

export default function SareeCard({ saree }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const wished = isWishlisted(saree.id);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-[3px] border bg-ivory"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Save button */}
      <button
        onClick={() => toggleWishlist(saree)}
        aria-label={wished ? 'Remove from saved' : 'Save'}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 backdrop-blur transition-colors hover:bg-ivory"
      >
        <Heart size={16} className={wished ? 'text-maroon' : 'text-ink-soft'} fill={wished ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/saree/${saree.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          {saree.images?.length ? (
            <>
              <img
                src={saree.images[0]}
                alt={saree.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {saree.images[1] && (
                <img
                  src={saree.images[1]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </>
          ) : (
            <SareeSwatch
              swatch={saree.swatch}
              accent={saree.accent}
              motif={saree.motif}
              motifSize="7rem"
              className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          {saree.badge && (
            <span className="absolute left-3 top-3 bg-maroon-deep px-3 py-1 font-roman text-[10px] uppercase tracking-[0.18em] text-ivory">
              {saree.badge}
            </span>
          )}
          {saree.isUnique && (
            <span className="absolute bottom-3 left-3 bg-zari-gold px-2 py-1 font-roman text-[9px] uppercase tracking-[0.15em] text-maroon-deep">
              One of One
            </span>
          )}
          <button
            onClick={(e) => {
              if (saree.sizes?.length) return; // let the card open the product to choose a size
              e.preventDefault();
              addToCart(saree);
            }}
            className="absolute bottom-3 right-3 flex translate-y-2 items-center gap-1.5 bg-maroon-deep/95 px-3 py-2 font-roman text-[9px] uppercase tracking-[0.18em] text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBag size={12} /> {saree.sizes?.length ? 'Select size' : 'Add'}
          </button>
        </div>
      </Link>

      <Link to={`/saree/${saree.id}`} className="flex grow flex-col p-4">
        <span className="font-roman text-[10px] uppercase tracking-[0.22em] text-zari-gold">
          {saree.typeLabel}
        </span>
        <h3 className="mt-1 font-display text-lg leading-snug text-maroon-deep">{saree.title}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-display text-lg text-maroon">{inr(saree.price)}</span>
          {saree.mrp > saree.price && (
            <>
              <span className="font-sans text-xs text-ink-soft line-through">{inr(saree.mrp)}</span>
              <span className="font-sans text-xs text-peacock-teal">{saree.discount}% off</span>
            </>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
