import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);
const KEY = 'maruthi-wishlist';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const isWishlisted = useCallback((id) => items.some((i) => i.id === id), [items]);

  const addToWishlist = useCallback((saree) => {
    setItems((prev) => (prev.find((i) => i.id === saree.id) ? prev : [...prev, saree]));
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleWishlist = useCallback((saree) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === saree.id)) {
        toast(`${saree.title} — removed from saved`);
        return prev.filter((i) => i.id !== saree.id);
      }
      toast.success(`${saree.title} — saved`);
      return [...prev, saree];
    });
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, isWishlisted, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist }),
    [items, isWishlisted, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
