import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, RotateCcw, Database, ImagePlus, Loader2 } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { makeProduct, inr, WEAVES, COLOR_NAMES, OCCASIONS, occasionLabel } from '../data/sarees';
import SareeSwatch from '../components/SareeSwatch';
import { uploadSareeImage, deleteSareeImage } from '../lib/uploadImage';

const MAX_IMAGES = 4;

const EMPTY = {
  title: '',
  weave: 'kanjivaram',
  color: 'Maroon',
  price: '',
  mrp: '',
  occasion: ['festive'],
  description: '',
  fullDescription: '',
  badge: '',
  featured: false,
  isUnique: true,
  images: [],
};

const FIELD = 'w-full border bg-ivory px-3 py-2 font-sans text-sm text-ink outline-none transition-colors focus:border-zari-gold';
const LABEL = 'mb-1.5 block font-roman text-[0.55rem] uppercase tracking-[0.18em] text-ink-soft';

export default function Admin() {
  const { products, seeded, addProduct, updateProduct, deleteProduct, seedCatalogue } = useProducts();
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const openNew = () => setEditing({ ...EMPTY, images: [] });
  const openEdit = (p) =>
    setEditing({
      id: p.id,
      sku: p.sku,
      title: p.title,
      weave: p.weave,
      color: p.color,
      price: String(p.price),
      mrp: String(p.mrp),
      occasion: [...p.occasion],
      description: p.description,
      fullDescription: p.fullDescription,
      badge: p.badge || '',
      featured: p.featured,
      isUnique: p.isUnique,
      images: [...(p.images || [])],
    });

  const set = (k, v) => setEditing((f) => ({ ...f, [k]: v }));

  const onPickImages = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // let the same file be chosen again later
    if (!files.length) return;
    const room = MAX_IMAGES - (editing.images?.length || 0);
    if (room <= 0) {
      toast.error(`Up to ${MAX_IMAGES} photos per saree`);
      return;
    }
    setUploading(true);
    try {
      for (const file of files.slice(0, room)) {
        const url = await uploadSareeImage(file);
        setEditing((f) => ({ ...f, images: [...(f.images || []), url] }));
      }
      toast.success('Photo added');
    } catch (err) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setEditing((f) => ({ ...f, images: (f.images || []).filter((u) => u !== url) }));
    deleteSareeImage(url); // best-effort cleanup in Storage
  };

  const toggleOcc = (o) =>
    setEditing((f) => ({
      ...f,
      occasion: f.occasion.includes(o) ? f.occasion.filter((x) => x !== o) : [...f.occasion, o],
    }));

  const save = (e) => {
    e.preventDefault();
    const built = makeProduct({
      ...editing,
      price: Number(editing.price),
      mrp: editing.mrp ? Number(editing.mrp) : undefined,
      stock: editing.isUnique ? 1 : 10,
    });
    if (editing.id) updateProduct(editing.id, built);
    else addProduct(built);
    setEditing(null);
  };

  const preview = editing ? makeProduct({ ...editing, price: Number(editing.price) || 0 }) : null;

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1300px] px-6 pb-24 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="label-roman">Curator Studio</span>
            <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep">Manage the collection</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Signed in as {user?.email} · {products.length} sarees{seeded ? ' · live in Supabase' : ' · built-in (not seeded)'}
            </p>
          </div>
          {seeded && (
            <div className="flex gap-3">
              <button onClick={seedCatalogue} className="btn-ghost inline-flex items-center gap-2 !py-2.5">
                <RotateCcw size={14} /> Reset to defaults
              </button>
              <button onClick={openNew} className="btn-primary inline-flex items-center gap-2">
                <Plus size={15} /> Add Saree
              </button>
            </div>
          )}
        </div>

        {!seeded ? (
          <div className="mt-10 border bg-ivory-soft/40 p-10 text-center" style={{ borderColor: 'rgba(184,137,90,0.4)' }}>
            <Database size={26} className="mx-auto text-zari-gold" />
            <p className="mt-4 font-display text-2xl font-light text-maroon-deep">The catalogue isn&rsquo;t in Supabase yet.</p>
            <p className="mx-auto mt-2 max-w-md text-ink-soft">
              Visitors currently see the built-in 35 sarees. Seed the catalogue once to manage it here — then add, edit, and remove pieces, and your changes show on the live site.
            </p>
            <button onClick={seedCatalogue} className="btn-primary mt-6 inline-flex items-center gap-2">
              <Database size={15} /> Seed catalogue (35 sarees)
            </button>
          </div>
        ) : (
          <>
            {editing && (
              <form onSubmit={save} className="mt-8 border bg-ivory-soft/40 p-6" style={{ borderColor: 'rgba(184,137,90,0.4)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="font-roman text-[0.65rem] uppercase tracking-[0.22em] text-maroon-deep">
                    {editing.id ? 'Edit saree' : 'New saree'}
                  </h2>
                  <button type="button" onClick={() => setEditing(null)} aria-label="Close"><X size={18} /></button>
                </div>

                <div className="mt-5 grid gap-6 md:grid-cols-[200px_1fr]">
                  <div>
                    {editing.images?.length ? (
                      <img src={editing.images[0]} alt="" className="aspect-[3/4] w-full rounded-[3px] object-cover" />
                    ) : (
                      <SareeSwatch swatch={preview.swatch} accent={preview.accent} motif={preview.motif} motifSize="4rem" className="aspect-[3/4] w-full rounded-[3px]" />
                    )}
                    <p className="mt-2 text-center font-sans text-xs text-ink-soft">Live preview</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={LABEL}>Title</label>
                      <input className={FIELD} style={{ borderColor: 'var(--border)' }} required value={editing.title} onChange={(e) => set('title', e.target.value)} placeholder="The Bridal Maroon" />
                    </div>
                    <div>
                      <label className={LABEL}>Weave</label>
                      <select className={FIELD} style={{ borderColor: 'var(--border)' }} value={editing.weave} onChange={(e) => set('weave', e.target.value)}>
                        {WEAVES.map((w) => <option key={w.slug} value={w.slug}>{w.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Colour</label>
                      <select className={FIELD} style={{ borderColor: 'var(--border)' }} value={editing.color} onChange={(e) => set('color', e.target.value)}>
                        {COLOR_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL}>Price (₹)</label>
                      <input type="number" min="0" className={FIELD} style={{ borderColor: 'var(--border)' }} required value={editing.price} onChange={(e) => set('price', e.target.value)} placeholder="42000" />
                    </div>
                    <div>
                      <label className={LABEL}>MRP (₹, optional)</label>
                      <input type="number" min="0" className={FIELD} style={{ borderColor: 'var(--border)' }} value={editing.mrp} onChange={(e) => set('mrp', e.target.value)} placeholder="auto" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={LABEL}>Occasion</label>
                      <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map((o) => (
                          <button type="button" key={o} onClick={() => toggleOcc(o)} className={`rounded-full border px-3 py-1 font-roman text-[0.58rem] uppercase tracking-[0.14em] transition ${editing.occasion.includes(o) ? 'border-maroon bg-maroon text-ivory' : 'border-border text-ink-soft hover:border-maroon'}`}>
                            {occasionLabel(o)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={LABEL}>Short description</label>
                      <input className={FIELD} style={{ borderColor: 'var(--border)' }} value={editing.description} onChange={(e) => set('description', e.target.value)} placeholder="One evocative line for the card" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={LABEL}>Full description</label>
                      <textarea rows={3} className={`${FIELD} resize-none`} style={{ borderColor: 'var(--border)' }} value={editing.fullDescription} onChange={(e) => set('fullDescription', e.target.value)} placeholder="The full story for the product page" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={LABEL}>Photos (up to {MAX_IMAGES})</label>
                      <div className="flex flex-wrap gap-3">
                        {(editing.images || []).map((url, i) => (
                          <div key={url} className="relative h-24 w-20 overflow-hidden rounded-[2px] border" style={{ borderColor: 'var(--border)' }}>
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            {i === 0 && (
                              <span className="absolute inset-x-0 bottom-0 bg-maroon-deep/85 py-0.5 text-center font-roman text-[0.5rem] uppercase tracking-[0.12em] text-ivory">Cover</span>
                            )}
                            <button type="button" onClick={() => removeImage(url)} aria-label="Remove photo" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ivory/90 text-ink-soft transition-colors hover:text-maroon">
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                        {(editing.images?.length || 0) < MAX_IMAGES && (
                          <label className={`flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[2px] border border-dashed text-ink-soft transition-colors hover:border-zari-gold hover:text-maroon ${uploading ? 'pointer-events-none opacity-60' : ''}`} style={{ borderColor: 'var(--border)' }}>
                            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                            <span className="font-roman text-[0.5rem] uppercase tracking-[0.12em]">{uploading ? 'Uploading' : 'Add'}</span>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={onPickImages} disabled={uploading} />
                          </label>
                        )}
                      </div>
                      <p className="mt-2 font-sans text-xs text-ink-soft">First photo is the cover. Drag-free — just pick up to {MAX_IMAGES}. Leave empty to use the woven swatch.</p>
                    </div>
                    <div>
                      <label className={LABEL}>Badge (optional)</label>
                      <input className={FIELD} style={{ borderColor: 'var(--border)' }} value={editing.badge} onChange={(e) => set('badge', e.target.value)} placeholder="Bridal Heirloom" />
                    </div>
                    <div className="flex items-end gap-5">
                      <label className="flex items-center gap-2 text-sm text-ink-soft">
                        <input type="checkbox" checked={editing.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured
                      </label>
                      <label className="flex items-center gap-2 text-sm text-ink-soft">
                        <input type="checkbox" checked={editing.isUnique} onChange={(e) => set('isUnique', e.target.checked)} /> One of One
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button type="submit" className="btn-primary">{editing.id ? 'Save changes' : 'Add to collection'}</button>
                  <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            )}

            <div className="mt-8 overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <SareeSwatch swatch={p.swatch} accent={p.accent} motif={p.motif} motifSize="1.4rem" className="h-14 w-12 shrink-0 rounded-[2px]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base text-maroon-deep">{p.title}</p>
                    <p className="font-roman text-[0.55rem] uppercase tracking-[0.16em] text-zari-gold">{p.weaveLabel} · {p.color}</p>
                  </div>
                  <span className="hidden w-24 text-right font-display text-maroon sm:block">{inr(p.price)}</span>
                  <span className="hidden w-20 text-center font-sans text-xs text-ink-soft md:block">{p.isUnique ? '1 / one' : `${p.stock} stk`}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} aria-label="Edit" className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-maroon"><Pencil size={15} /></button>
                    <button onClick={() => deleteProduct(p.id)} aria-label="Delete" className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-maroon-silk"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
