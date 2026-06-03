import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const KEY = 'maruthi-cart';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [items]);

  const addToCart = useCallback((saree, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === saree.id);
      // Unique pieces can't exceed stock.
      if (existing) {
        if (saree.isUnique) {
          toast(`${saree.title} is already in your cart`);
          return prev;
        }
        return prev.map((i) => (i.id === saree.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...saree, qty }];
    });
    toast.success(`${saree.title} — added to cart`);
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      qty < 1 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const savings = items.reduce((sum, i) => sum + Math.max(0, (i.mrp - i.price) * i.qty), 0);
    return { items, addToCart, removeFromCart, updateQty, clearCart, isInCart, subtotal, itemCount, savings };
  }, [items, addToCart, removeFromCart, updateQty, clearCart, isInCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
