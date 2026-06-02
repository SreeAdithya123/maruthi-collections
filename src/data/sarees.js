// ---------------------------------------------------------------------------
// Maruthi Collections — saree catalogue
//
// We have no per-product photography yet, so each saree renders as a designed
// gradient "swatch" (dark→light pair + zari accent + motif), matching the
// editorial collection cards. Swap to real images later by adding an `images`
// array to a product and updating SareeCard / SareeDetail.
// ---------------------------------------------------------------------------

const WEAVE_META = {
  kanjivaram: { label: 'Kanjivaram', region: 'Kanchipuram, Tamil Nadu', state: 'Tamil Nadu', fabric: 'Pure Mulberry Silk', motif: '🦚' },
  banarasi: { label: 'Banarasi', region: 'Varanasi', state: 'Varanasi', fabric: 'Katan Silk', motif: '🌸' },
  pochampally: { label: 'Pochampally', region: 'Bhoodan Pochampally, Telangana', state: 'Telangana', fabric: 'Silk Ikat', motif: '🔷' },
  gadwal: { label: 'Gadwal', region: 'Gadwal, Telangana', state: 'Telangana', fabric: 'Silk-Cotton', motif: '🌊' },
  uppada: { label: 'Uppada Pattu', region: 'Uppada, East Godavari, AP', state: 'Andhra Pradesh', fabric: 'Jamdani Silk', motif: '🌺' },
  venkatagiri: { label: 'Venkatagiri', region: 'Venkatagiri, Andhra Pradesh', state: 'Andhra Pradesh', fabric: 'Fine Cotton', motif: '✨' },
  mangalagiri: { label: 'Mangalagiri', region: 'Mangalagiri, Andhra Pradesh', state: 'Andhra Pradesh', fabric: 'Cotton', motif: '🌾' },
};

// color name -> [dark, light, zari-accent]
const COLORS = {
  Maroon: ['#4A1418', '#6B1F25', '#D4AC7E'],
  Crimson: ['#6B1F25', '#8B2A30', '#D4AC7E'],
  Navy: ['#1E3A52', '#2A4A6B', '#D4AC7E'],
  Indigo: ['#26304F', '#3A4A78', '#D4AC7E'],
  Teal: ['#1F4D44', '#2D6B5F', '#D4AC7E'],
  Green: ['#2C4A2E', '#3E6B40', '#D4AC7E'],
  Mustard: ['#9A6B1E', '#C28A2A', '#4A1418'],
  Gold: ['#9C6F44', '#B8895A', '#4A1418'],
  Rust: ['#7A3520', '#9C4A2E', '#D4AC7E'],
  Pink: ['#7A2A40', '#A23A5A', '#D4AC7E'],
  Purple: ['#3E2A52', '#5A3E78', '#D4AC7E'],
  Black: ['#1A1410', '#2A1F1A', '#B8895A'],
  Ivory: ['#C9BBA0', '#E3D8BF', '#6B1F25'],
};

const OCCASION_LABELS = {
  bridal: 'Bridal',
  festive: 'Festive',
  daily: 'Daily Wear',
  office: 'Office',
  gifting: 'Gifting',
};

function defaultSpecs(meta, seed) {
  const silk = meta.fabric.toLowerCase().includes('silk');
  return {
    Length: '6.3 m saree + 0.8 m blouse piece',
    Width: '47 inches',
    Weight: seed.weight || (silk ? '680 grams' : '420 grams'),
    Zari: silk ? 'Half-fine gold zari' : 'Cotton / no zari',
    'Blouse Piece': 'Included, unstitched',
    'Wash Care': silk ? 'Dry clean only' : 'Gentle hand wash, first wash dry clean',
    Origin: meta.region,
    'GI Certified': seed.gi === false ? 'No' : 'Yes',
  };
}

function build(seed, i) {
  const meta = WEAVE_META[seed.weave];
  const [dark, light, accent] = COLORS[seed.color];
  const price = seed.price;
  const mrp = seed.mrp ?? Math.round((price * (seed.bump || 1.22)) / 100) * 100;
  const discount = Math.max(0, Math.round((1 - price / mrp) * 100));
  const num = String(i + 1).padStart(3, '0');
  return {
    id: `mc-${num}`,
    sku: `MC-${seed.weave.slice(0, 3).toUpperCase()}-${num}`,
    title: seed.title,
    weave: seed.weave,
    weaveLabel: meta.label,
    region: meta.region,
    state: meta.state,
    fabric: meta.fabric,
    occasion: seed.occasion,
    color: seed.color,
    colorHex: light,
    price,
    mrp,
    discount,
    swatch: [dark, light],
    accent,
    motif: seed.motif || meta.motif,
    description: seed.desc,
    fullDescription: seed.long || seed.desc,
    specifications: { ...defaultSpecs(meta, seed), ...(seed.specs || {}) },
    stock: seed.stock ?? 1,
    isUnique: seed.isUnique ?? true,
    tags: [seed.weave, ...seed.occasion, ...(seed.tags || [])],
    rating: seed.rating ?? 4.7,
    reviewCount: seed.reviewCount ?? 6,
    badge: seed.badge ?? null,
    featured: seed.featured ?? false,
  };
}

// Compact seeds — variety across weave / colour / occasion / price band.
const SEED = [
  // — Kanjivaram —
  { weave: 'kanjivaram', title: 'The Bridal Maroon', color: 'Maroon', price: 42000, mrp: 52000, occasion: ['bridal', 'festive'], badge: 'Bridal Heirloom', rating: 4.9, reviewCount: 23, featured: true, desc: 'Pure mulberry silk with real gold zari, temple border and peacock kongu — three months on the loom.', long: 'A bridal Kanjivaram woven over three months in Kanchipuram. Fine lotus buti across deep maroon mulberry silk, a peacock kongu in hand-meenakari blue, green and saffron, finished with a 24-karat gold zari border. GI-certified Silk Mark.', specs: { Zari: '24-karat real gold', Weight: '780 grams' } },
  { weave: 'kanjivaram', title: 'The Temple Green', color: 'Green', price: 38500, occasion: ['bridal', 'festive'], badge: 'Bridal', rating: 4.8, reviewCount: 14, featured: true, desc: 'Emerald silk with a contrast maroon korvai border and a gold temple kongu.' },
  { weave: 'kanjivaram', title: 'The Royal Navy', color: 'Navy', price: 34000, occasion: ['festive'], rating: 4.7, reviewCount: 9, desc: 'Midnight-navy silk with rich gold checks and a wide brocade pallu.' },
  { weave: 'kanjivaram', title: 'The Mustard Reign', color: 'Mustard', price: 29500, occasion: ['festive'], rating: 4.6, reviewCount: 7, desc: 'Turmeric-mustard silk with a maroon temple border — a festival heirloom.' },
  { weave: 'kanjivaram', title: 'The Black Gold', color: 'Black', price: 47000, occasion: ['bridal', 'festive'], badge: 'One of One', rating: 4.9, reviewCount: 11, featured: true, desc: 'Ink-black mulberry silk flooded with antique gold zari — for the woman who arrives last.' },
  { weave: 'kanjivaram', title: 'The Rose Bridal', color: 'Pink', price: 39000, occasion: ['bridal'], badge: 'Bridal', rating: 4.8, reviewCount: 16, desc: 'Rose-pink silk with a deep maroon kongu and meenakari floral buti.' },

  // — Banarasi —
  { weave: 'banarasi', title: 'The Maroon Banarasi', color: 'Maroon', price: 28000, occasion: ['bridal', 'festive'], badge: 'From the Film', rating: 4.9, reviewCount: 31, featured: true, desc: 'The exact silk in our film — deep maroon body, lotus buti in fine gold zari, peacock kongu with hand-meena thread.', long: 'The Banarasi from our hero film. A deep maroon Katan silk body scattered with small lotus buti in fine gold zari, finished with a peacock kongu in hand-meena blue, green and saffron. Soft enough to fold into a book, regal enough to inherit.' },
  { weave: 'banarasi', title: 'The Crimson Brocade', color: 'Crimson', price: 32000, occasion: ['bridal'], badge: 'Bridal', rating: 4.8, reviewCount: 12, desc: 'Bridal-red Katan silk with edge-to-edge jangla brocade.' },
  { weave: 'banarasi', title: 'The Peacock Teal', color: 'Teal', price: 21000, occasion: ['festive'], rating: 4.7, reviewCount: 8, desc: 'Teal silk-georgette Banarasi with a shikargah border in gold.' },
  { weave: 'banarasi', title: 'The Amethyst', color: 'Purple', price: 18500, occasion: ['festive'], rating: 4.6, reviewCount: 6, desc: 'Amethyst Katan with a feather-light meenakari jaal.' },

  // — Pochampally —
  { weave: 'pochampally', title: 'The Geometry', color: 'Crimson', price: 14000, occasion: ['festive', 'office'], rating: 4.7, reviewCount: 10, desc: 'Double ikat — warp and weft dyed before they meet on the loom. UNESCO heritage.' },
  { weave: 'pochampally', title: 'The Indigo Ikat', color: 'Indigo', price: 12500, occasion: ['festive', 'daily'], rating: 4.6, reviewCount: 8, desc: 'Indigo double-ikat with a telia-rumal diamond grid.' },
  { weave: 'pochampally', title: 'The Verdant Ikat', color: 'Teal', price: 9500, occasion: ['daily', 'office'], rating: 4.5, reviewCount: 5, desc: 'Soft teal ikat that drapes like water — desk to dinner.' },

  // — Gadwal —
  { weave: 'gadwal', title: 'The Korvai Teal', color: 'Teal', price: 11500, occasion: ['festive', 'office'], rating: 4.7, reviewCount: 9, desc: 'Cotton body, pure silk border joined by korvai — breathes in summer, sparkles at dusk.' },
  { weave: 'gadwal', title: 'The Maroon Korvai', color: 'Maroon', price: 12800, occasion: ['festive'], rating: 4.6, reviewCount: 6, desc: 'Ivory cotton body with a maroon-and-gold silk border.' },
  { weave: 'gadwal', title: 'The Olive Border', color: 'Green', price: 8900, occasion: ['daily', 'office'], rating: 4.5, reviewCount: 4, desc: 'Featherweight cotton-silk with an olive korvai border.' },

  // — Uppada —
  { weave: 'uppada', title: 'The Featherweight Navy', color: 'Navy', price: 18500, occasion: ['festive'], badge: 'From our District', rating: 4.8, reviewCount: 13, featured: true, desc: 'Featherlight Uppada from our own East Godavari — jamdani floral, folds into a book.' },
  { weave: 'uppada', title: 'The Rose Jamdani', color: 'Pink', price: 16000, occasion: ['festive', 'bridal'], rating: 4.7, reviewCount: 7, desc: 'Rose Uppada jamdani with a gossamer gold floral weave.' },
  { weave: 'uppada', title: 'The Maroon Tissue', color: 'Maroon', price: 22000, occasion: ['bridal', 'festive'], rating: 4.8, reviewCount: 9, desc: 'Maroon tissue Uppada with a self-gold sheen — bridal, but barely-there light.' },

  // — Venkatagiri (fine cotton, gentle prices) —
  { weave: 'venkatagiri', title: 'The Everyday Ivory', color: 'Ivory', price: 4200, occasion: ['daily', 'office'], rating: 4.6, reviewCount: 12, desc: 'Almost-translucent fine cotton with delicate floral buti — the everyday heirloom.' },
  { weave: 'venkatagiri', title: 'The Rose Cotton', color: 'Pink', price: 4800, occasion: ['daily', 'office'], rating: 4.5, reviewCount: 9, desc: 'Soft rose cotton with a fine gold-zari buti.' },
  { weave: 'venkatagiri', title: 'The Mustard Whisper', color: 'Mustard', price: 5200, occasion: ['daily', 'festive'], rating: 4.6, reviewCount: 6, desc: 'Mustard fine-cotton with a slim zari border.' },
  { weave: 'venkatagiri', title: 'The Teal Buti', color: 'Teal', price: 3900, occasion: ['daily', 'office'], rating: 4.5, reviewCount: 8, desc: 'Cool teal cotton with scattered jasmine buti — desk-ready.' },

  // — Mangalagiri / cotton (daily + budget) —
  { weave: 'mangalagiri', title: 'The Nizam Maroon', color: 'Maroon', price: 2800, occasion: ['daily', 'office'], badge: 'Under ₹5,000', rating: 4.5, reviewCount: 18, desc: 'Crisp Mangalagiri cotton with the signature Nizam gold border.' },
  { weave: 'mangalagiri', title: 'The Indigo Daily', color: 'Indigo', price: 2400, occasion: ['daily', 'office'], badge: 'Under ₹5,000', rating: 4.4, reviewCount: 15, desc: 'Everyday indigo cotton — light, structured, machine-friendly after first wash.' },
  { weave: 'mangalagiri', title: 'The Green Office', color: 'Green', price: 2600, occasion: ['daily', 'office'], rating: 4.5, reviewCount: 11, desc: 'Bottle-green Mangalagiri with a thin gold-tissue border.' },
  { weave: 'mangalagiri', title: 'The Rust Cotton', color: 'Rust', price: 3100, occasion: ['daily', 'festive'], rating: 4.4, reviewCount: 7, desc: 'Warm rust cotton with a contrast black-and-gold border.' },
  { weave: 'mangalagiri', title: 'The Pebble Grey', color: 'Gold', price: 2200, occasion: ['daily', 'office'], badge: 'Under ₹5,000', rating: 4.3, reviewCount: 9, desc: 'Sandstone cotton with a fine zari line — the saree you reach for on Mondays.' },
  { weave: 'mangalagiri', title: 'The Festive Crimson', color: 'Crimson', price: 3600, occasion: ['festive', 'daily'], rating: 4.5, reviewCount: 6, desc: 'Crimson cotton dressed up with a wide gold-tissue pallu.' },
  { weave: 'mangalagiri', title: 'The Black Line', color: 'Black', price: 2900, occasion: ['daily', 'office'], rating: 4.4, reviewCount: 8, desc: 'Charcoal cotton with a single gold border line — quiet and sharp.' },
  { weave: 'mangalagiri', title: 'The Rose Daily', color: 'Pink', price: 2500, occasion: ['daily'], badge: 'Under ₹5,000', rating: 4.4, reviewCount: 10, desc: 'Dusty-rose cotton, gentle drape, the gift that always fits.', occasionExtra: ['gifting'] },

  // — A few more silks for catalogue depth —
  { weave: 'kanjivaram', title: 'The Festive Rust', color: 'Rust', price: 31000, occasion: ['festive'], rating: 4.7, reviewCount: 5, desc: 'Rust silk with a green-and-gold contrast border and annam birds in the pallu.' },
  { weave: 'banarasi', title: 'The Ivory Bridal', color: 'Ivory', price: 36000, occasion: ['bridal'], badge: 'Bridal', rating: 4.8, reviewCount: 10, desc: 'Ivory Katan silk with kadhua gold booties — for the morning muhurtam.' },
  { weave: 'pochampally', title: 'The Maroon Telia', color: 'Maroon', price: 15500, occasion: ['festive'], rating: 4.6, reviewCount: 6, desc: 'Maroon telia-rumal ikat with an oil-treated, decades-soft handle.' },
  { weave: 'uppada', title: 'The Teal Tissue', color: 'Teal', price: 19500, occasion: ['festive', 'bridal'], rating: 4.7, reviewCount: 8, desc: 'Teal Uppada tissue with a full gold-jamdani pallu.' },
];

export const sarees = SEED.map((s, i) =>
  build({ ...s, occasion: [...s.occasion, ...(s.occasionExtra || [])] }, i)
);

// --- categories (counts computed from data) ---
const CATEGORY_DEFS = [
  { slug: 'all', label: 'All Sarees' },
  { slug: 'kanjivaram', label: 'Kanjivaram' },
  { slug: 'banarasi', label: 'Banarasi' },
  { slug: 'pochampally', label: 'Pochampally' },
  { slug: 'gadwal', label: 'Gadwal' },
  { slug: 'uppada', label: 'Uppada Pattu' },
  { slug: 'venkatagiri', label: 'Venkatagiri' },
  { slug: 'cotton', label: 'Cotton' },
  { slug: 'daily-wear', label: 'Daily Wear' },
  { slug: 'budget-friendly', label: 'Budget Friendly' },
  { slug: 'bridal', label: 'Bridal' },
  { slug: 'festive', label: 'Festive' },
];

export function inCategory(s, cat) {
  if (!cat || cat === 'all') return true;
  switch (cat) {
    case 'budget-friendly':
      return s.price < 5000;
    case 'daily-wear':
      return s.occasion.includes('daily') || s.fabric.toLowerCase().includes('cotton');
    case 'cotton':
      return s.fabric.toLowerCase().includes('cotton');
    case 'bridal':
      return s.occasion.includes('bridal');
    case 'festive':
      return s.occasion.includes('festive');
    default:
      return s.weave === cat;
  }
}

export const categories = CATEGORY_DEFS.map((c) => ({
  ...c,
  count: c.slug === 'all' ? sarees.length : sarees.filter((s) => inCategory(s, c.slug)).length,
}));

// price bands for the sidebar
export const PRICE_BANDS = [
  { id: 'under-2k', label: 'Under ₹2,000', min: 0, max: 2000 },
  { id: '2k-5k', label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { id: '5k-15k', label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { id: '15k-50k', label: '₹15,000 – ₹50,000', min: 15000, max: 50000 },
  { id: 'above-50k', label: 'Above ₹50,000', min: 50000, max: Infinity },
];

export const FABRICS = ['Pure Mulberry Silk', 'Katan Silk', 'Silk Ikat', 'Jamdani Silk', 'Silk-Cotton', 'Fine Cotton', 'Cotton'];
export const OCCASIONS = ['bridal', 'festive', 'daily', 'office', 'gifting'];
export const REGIONS = ['Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Varanasi'];
export const WEAVES = Object.entries(WEAVE_META).map(([slug, m]) => ({ slug, label: m.label }));
export const COLOR_NAMES = Object.keys(COLORS);
export const colorSwatch = (name) => COLORS[name] || ['#6B1F25', '#8B2A30', '#D4AC7E'];
export const occasionLabel = (o) => OCCASION_LABELS[o] || o;

/**
 * Filter + sort. Multi-select fields accept arrays (empty = no constraint).
 */
export function filterSarees({
  category = 'all',
  bands = [],
  weave = [],
  fabric = [],
  occasion = [],
  color = [],
  region = [],
  sortBy = 'featured',
} = {}) {
  let result = sarees.filter((s) => inCategory(s, category));

  if (bands.length) {
    result = result.filter((s) =>
      bands.some((b) => {
        const band = PRICE_BANDS.find((p) => p.id === b);
        return band && s.price >= band.min && s.price < band.max;
      })
    );
  }
  if (weave.length) result = result.filter((s) => weave.includes(s.weave));
  if (fabric.length) result = result.filter((s) => fabric.includes(s.fabric));
  if (occasion.length) result = result.filter((s) => occasion.some((o) => s.occasion.includes(o)));
  if (color.length) result = result.filter((s) => color.includes(s.color));
  if (region.length) result = result.filter((s) => region.includes(s.state));

  const sorted = [...result];
  if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
  else if (sortBy === 'newest') sorted.sort((a, b) => b.id.localeCompare(a.id));
  else if (sortBy === 'popular') sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  return sorted;
}

export const getSaree = (id) => sarees.find((s) => s.id === id) || null;

export function relatedSarees(saree, n = 4) {
  if (!saree) return [];
  return sarees
    .filter((s) => s.id !== saree.id)
    .map((s) => ({
      s,
      score:
        (s.weave === saree.weave ? 2 : 0) +
        (s.occasion.some((o) => saree.occasion.includes(o)) ? 1 : 0) +
        (Math.abs(s.price - saree.price) < 8000 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.s);
}

export const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
