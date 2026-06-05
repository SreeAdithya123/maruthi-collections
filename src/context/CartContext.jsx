import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const KEY = 'maruthi-cart';

// A cart line is unique per (product, size). Sarees have no size → keyed by id.
const lineKey = (id, size) => (size ? `${id}__${size}` : id);

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || [];
    // Backfill lineId for carts saved before sizes existed.
    return raw.map((i) => ({ ...i, lineId: i.lineId || lineKey(i.id, i.size) }));
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

  const addToCart = useCallback((saree, qty = 1, size = null) => {
    const id = lineKey(saree.id, size);
    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === id);
      if (existing) {
        if (saree.isUnique) {
          toast(`${saree.title} is already in your cart`);
          return prev;
        }
        return prev.map((i) => (i.lineId === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...saree, qty, size: size || null, lineId: id }];
    });
    toast.success(`${saree.title}${size ? ` · ${size}` : ''} — added to cart`);
  }, []);

  const removeFromCart = useCallback((lineId) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQty = useCallback((lineId, qty) => {
    setItems((prev) =>
      qty < 1 ? prev.filter((i) => i.lineId !== lineId) : prev.map((i) => (i.lineId === lineId ? { ...i, qty } : i))
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
