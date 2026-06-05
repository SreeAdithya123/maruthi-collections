import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { inr } from '../data/sarees';
import ProductImage from '../components/ProductImage';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  useRevealOnScroll([items.length]);

  const moveAll = () => {
    items.forEach((i) => addToCart(i));
    clearWishlist();
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
        <Heart size={28} className="text-zari-gold" />
        <h1 className="mt-4 font-display text-4xl font-light text-maroon-deep">Save sarees you love.</h1>
        <p className="mt-3 max-w-sm text-ink-soft">
          Tap the heart on any saree to keep it here while you decide.
        </p>
        <Link to="/sarees" className="btn-primary mt-8">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1300px] px-6 pb-24 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-light text-maroon-deep">
            Saved <span className="text-2xl text-ink-soft">({items.length})</span>
          </h1>
          <button onClick={moveAll} className="btn-ghost !py-2.5">Move all to cart</button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="reveal group relative flex flex-col overflow-hidden rounded-[3px] border bg-ivory"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => removeFromWishlist(item.id)}
                aria-label="Remove"
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-ink-soft backdrop-blur transition-colors hover:text-maroon"
              >
                <X size={16} />
              </button>
              <Link to={`/saree/${item.id}`}>
                <ProductImage saree={item} motifSize="5rem" className="aspect-[3/4] w-full" />
              </Link>
              <div className="flex grow flex-col p-4">
                <span className="font-roman text-[10px] uppercase tracking-[0.22em] text-zari-gold">{item.typeLabel}</span>
                <Link to={`/saree/${item.id}`} className="mt-1 font-display text-lg leading-snug text-maroon-deep hover:text-maroon">
                  {item.title}
                </Link>
                <span className="mt-1 font-display text-base text-maroon">{inr(item.price)}</span>
                {item.sizes?.length ? (
                  <Link to={`/saree/${item.id}`} className="btn-primary mt-3 w-full justify-center !py-2.5 !text-[0.6rem]">
                    Select size
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      addToCart(item);
                      removeFromWishlist(item.id);
                    }}
                    className="btn-primary mt-3 w-full justify-center !py-2.5 !text-[0.6rem]"
                  >
                    Move to Cart
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
