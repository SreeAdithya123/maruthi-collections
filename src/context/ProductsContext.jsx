import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { SEED_SAREES, computeCategories } from '../data/sarees';

// PHASE B (Supabase): replace the localStorage load/save with reads/writes to a
// `products` table. The component API below stays the same.
const ProductsContext = createContext(null);
const KEY = 'maruthi-products';

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(stored) && stored.length) return stored;
  } catch {
    /* ignore */
  }
  return SEED_SAREES;
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(products));
    } catch {
      /* ignore */
    }
  }, [products]);

  const getProduct = useCallback((id) => products.find((p) => p.id === id) || null, [products]);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [product, ...prev.filter((p) => p.id !== product.id)]);
    toast.success(`${product.title} — added`);
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    toast.success('Changes saved');
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast('Removed from the collection');
  }, []);

  const resetCatalogue = useCallback(() => {
    setProducts(SEED_SAREES);
    toast('Catalogue reset to defaults');
  }, []);

  const value = useMemo(
    () => ({
      products,
      categories: computeCategories(products),
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      resetCatalogue,
    }),
    [products, getProduct, addProduct, updateProduct, deleteProduct, resetCatalogue]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
