import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase, hasSupabase } from '../lib/supabase';
import { SEED_SAREES, computeCategories } from '../data/sarees';

// Products live in Supabase (`products.data` jsonb). Until the table is seeded
// — or if Supabase isn't configured — the catalogue falls back to the built-in
// sarees so the storefront is never empty. Admins seed/edit via the dashboard.
const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [remote, setRemote] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id, data')
      .order('created_at', { ascending: true });
    if (!error && data) setRemote(data.map((r) => r.data));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const seeded = remote.length > 0;
  const products = seeded ? remote : SEED_SAREES;

  const getProduct = useCallback((id) => products.find((p) => p.id === id) || null, [products]);

  const addProduct = useCallback(
    async (product) => {
      if (!hasSupabase) return toast.error('Catalogue is not connected');
      const { error } = await supabase.from('products').insert({ id: product.id, data: product });
      if (error) return toast.error(error.message);
      toast.success(`${product.title} — added`);
      return fetchProducts();
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (id, product) => {
      if (!hasSupabase) return toast.error('Catalogue is not connected');
      const { error } = await supabase
        .from('products')
        .upsert({ id, data: product, updated_at: new Date().toISOString() });
      if (error) return toast.error(error.message);
      toast.success('Changes saved');
      return fetchProducts();
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id) => {
      if (!hasSupabase) return toast.error('Catalogue is not connected');
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return toast.error(error.message);
      toast('Removed from the collection');
      return fetchProducts();
    },
    [fetchProducts]
  );

  const seedCatalogue = useCallback(async () => {
    if (!hasSupabase) return toast.error('Catalogue is not connected');
    // Replace the whole catalogue with the built-in pieces (clears stale rows).
    await supabase.from('products').delete().neq('id', '__none__');
    const rows = SEED_SAREES.map((p) => ({ id: p.id, data: p }));
    const { error } = await supabase.from('products').upsert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Catalogue seeded with ${rows.length} pieces`);
    return fetchProducts();
  }, [fetchProducts]);

  const value = useMemo(
    () => ({
      products,
      categories: computeCategories(products),
      seeded,
      loading,
      getProduct,
      addProduct,
      updateProduct,
      deleteProduct,
      seedCatalogue,
      refresh: fetchProducts,
    }),
    [products, seeded, loading, getProduct, addProduct, updateProduct, deleteProduct, seedCatalogue, fetchProducts]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
