// ---------------------------------------------------------------------------
// Maruthi Collections — catalogue
//
// Maruthi sells four lines: Kalamkari half-&-half kurtis, Kalamkari frocks
// (women + girls), Kalamkari cotton sarees, and easy daily-wear sarees.
// Apparel (kurtis, frocks) carries sizes; sarees are one-size with a blouse
// piece. We have no per-product photography yet, so each piece renders as a
// designed gradient "swatch" until an admin uploads real photos (data.images).
// ---------------------------------------------------------------------------

// Product types — the primary axis of the catalogue.
const TYPE_META = {
  'kalamkari-kurti': { label: 'Kalamkari Kurti', short: 'Kurti', code: 'KUR', kind: 'apparel', audience: 'women', fabric: 'Kalamkari Cotton', motif: '🪷' },
  'kalamkari-frock': { label: 'Kalamkari Frock', short: 'Frock', code: 'FRK', kind: 'apparel', audience: 'both', fabric: 'Kalamkari Cotton', motif: '🌸' },
  'kalamkari-saree': { label: 'Kalamkari Cotton Saree', short: 'Saree', code: 'KAS', kind: 'saree', audience: 'women', fabric: 'Kalamkari Cotton', motif: '🦚' },
  'daily-saree': { label: 'Daily Wear Saree', short: 'Saree', code: 'DWS', kind: 'saree', audience: 'women', fabric: 'Cotton', motif: '🌿' },
};

// Sizes. Apparel only — sarees are one-size.
export const WOMEN_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const KIDS_SIZES = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'];

// Which size chips to offer for a type in the admin: frocks span women + girls.
export function sizeOptionsForType(type) {
  const meta = TYPE_META[type];
  if (!meta || meta.kind !== 'apparel') return { women: [], kids: [] };
  if (type === 'kalamkari-frock') return { women: WOMEN_SIZES, kids: KIDS_SIZES };
  return { women: WOMEN_SIZES, kids: [] };
}

export const isApparelType = (type) => TYPE_META[type]?.kind === 'apparel';

// color name -> [dark, light, accent] — an earthy Kalamkari/cotton palette.
const COLORS = {
  Indigo: ['#26304F', '#3A4A78', '#C9A24B'],
  Maroon: ['#4A1418', '#6B1F25', '#D4AC7E'],
  Rust: ['#7A3520', '#9C4A2E', '#E0C088'],
  Mustard: ['#9A6B1E', '#C28A2A', '#3A2A14'],
  Black: ['#1A1410', '#2A1F1A', '#C9A24B'],
  Teal: ['#1F4D44', '#2D6B5F', '#E0C088'],
  Green: ['#2C4A2E', '#3E6B40', '#E0C088'],
  Crimson: ['#6B1F25', '#8B2A30', '#E0C088'],
  Navy: ['#1E3A52', '#2A4A6B', '#D4AC7E'],
  Pink: ['#7A2A40', '#A23A5A', '#E0C088'],
  Ivory: ['#C9BBA0', '#E3D8BF', '#6B1F25'],
  Mehendi: ['#5A5A23', '#7C7C32', '#E0C088'],
};

const OCCASION_LABELS = {
  daily: 'Daily Wear',
  festive: 'Festive',
  office: 'Office',
  gifting: 'Gifting',
  pooja: 'Pooja',
};

function specsFor(meta, seed = {}, type, audience) {
  if (meta.kind === 'apparel') {
    const kids = audience === 'kids';
    return {
      Fabric: meta.fabric,
      Craft: meta.fabric.includes('Kalamkari') ? 'Hand-block print · natural dyes' : 'Soft cotton',
      Fit: seed.fit || (type === 'kalamkari-frock' ? 'A-line, flared' : 'Straight, with side slits'),
      Sleeves: seed.sleeves || (type === 'kalamkari-frock' ? 'Short / cap sleeve' : 'Three-quarter sleeve'),
      Length: seed.length || (type === 'kalamkari-frock' ? (kids ? 'Knee length' : 'Calf length') : '44 inches'),
      'Wash Care': 'Gentle hand wash separately in cold water; dry in shade — natural dyes mellow beautifully with age.',
      Origin: 'Hand-crafted in Andhra Pradesh',
    };
  }
  return {
    Length: '6.3 m saree + 0.8 m blouse piece',
    Width: '47 inches',
    Fabric: meta.fabric,
    Border: seed.border || (type === 'kalamkari-saree' ? 'Hand-block Kalamkari border' : 'Woven cotton contrast border'),
    'Blouse Piece': 'Included, unstitched',
    'Wash Care': 'Gentle hand wash; dry in shade. Wash separately for the first few washes.',
    Origin: type === 'kalamkari-saree' ? 'Srikalahasti / Machilipatnam, Andhra Pradesh' : 'Andhra Pradesh',
  };
}

function deriveAudience(type, sizes) {
  if (!isApparelType(type)) return 'women';
  const hasKids = sizes.some((s) => KIDS_SIZES.includes(s));
  const hasWomen = sizes.some((s) => WOMEN_SIZES.includes(s));
  return hasKids && hasWomen ? 'both' : hasKids ? 'kids' : 'women';
}

function build(seed, i) {
  const meta = TYPE_META[seed.type] || TYPE_META['kalamkari-kurti'];
  const [dark, light, accent] = COLORS[seed.color] || COLORS.Indigo;
  const price = seed.price;
  const mrp = seed.mrp ?? Math.round((price * (seed.bump || 1.25)) / 100) * 100;
  const discount = Math.max(0, Math.round((1 - price / mrp) * 100));
  const num = String(i + 1).padStart(3, '0');
  const apparel = meta.kind === 'apparel';
  const sizes = apparel
    ? seed.sizes || (seed.type === 'kalamkari-frock' ? ['4-5Y', '6-7Y', '8-9Y'] : ['S', 'M', 'L', 'XL'])
    : [];
  const audience = apparel ? deriveAudience(seed.type, sizes) : 'women';
  return {
    id: `mc-${num}`,
    sku: `MC-${meta.code}-${num}`,
    title: seed.title,
    type: seed.type,
    typeLabel: meta.label,
    kind: meta.kind,
    audience,
    region: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
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
    sizes,
    description: seed.desc,
    fullDescription: seed.long || seed.desc,
    specifications: { ...specsFor(meta, seed, seed.type, audience), ...(seed.specs || {}) },
    stock: seed.stock ?? (apparel ? 8 : 5),
    isUnique: seed.isUnique ?? false,
    tags: [seed.type, ...seed.occasion],
    rating: seed.rating ?? 4.7,
    reviewCount: seed.reviewCount ?? 6,
    badge: seed.badge ?? null,
    featured: seed.featured ?? false,
    images: [],
  };
}

// Compact seeds across the four lines, at realistic cotton / daily-wear prices.
const SEED = [
  // — Kalamkari half & half kurtis (women) —
  { type: 'kalamkari-kurti', title: 'The Indigo Half & Half', color: 'Indigo', price: 1150, occasion: ['festive', 'office'], badge: 'Half & Half', featured: true, rating: 4.8, reviewCount: 19, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Two Kalamkari prints, one kurti — indigo florals meeting a cream block-print panel, split down the middle.', long: 'A half-&-half Kalamkari kurti in pure cotton — hand-block indigo florals on one half, a warm cream panel of running buti on the other, joined by a fine piping. Natural dyes, side slits, three-quarter sleeves. Made to be worn to work and to a festival with only a change of earrings.' },
  { type: 'kalamkari-kurti', title: 'The Rust & Cream', color: 'Rust', price: 980, occasion: ['daily', 'office'], rating: 4.6, reviewCount: 11, sizes: ['S', 'M', 'L', 'XL'], desc: 'Madder-rust block print against a calm cream half — easy cotton for long workdays.' },
  { type: 'kalamkari-kurti', title: 'The Black Mustard', color: 'Black', price: 1250, occasion: ['festive'], rating: 4.7, reviewCount: 9, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Ink-black Kalamkari with a mustard half and tree-of-life motifs along the yoke.' },
  { type: 'kalamkari-kurti', title: 'The Teal Buti', color: 'Teal', price: 1050, occasion: ['office', 'daily'], rating: 4.6, reviewCount: 8, sizes: ['S', 'M', 'L', 'XL'], desc: 'Cool teal with an ivory half, scattered jasmine buti — desk to dinner.' },
  { type: 'kalamkari-kurti', title: 'The Maroon Temple', color: 'Maroon', price: 1180, occasion: ['festive'], rating: 4.7, reviewCount: 7, sizes: ['M', 'L', 'XL', 'XXL'], desc: 'Deep maroon Kalamkari with a black temple-border half — pooja-day ready.' },
  { type: 'kalamkari-kurti', title: 'The Mustard Indigo', color: 'Mustard', price: 890, occasion: ['daily'], badge: 'Under ₹1,000', rating: 4.5, reviewCount: 14, sizes: ['S', 'M', 'L', 'XL'], desc: 'Turmeric-mustard half against indigo florals — soft cotton, everyday joy.' },
  { type: 'kalamkari-kurti', title: 'The Mehendi Green', color: 'Mehendi', price: 1090, occasion: ['office', 'festive'], featured: true, rating: 4.8, reviewCount: 10, sizes: ['S', 'M', 'L', 'XL', 'XXL'], desc: 'Henna-green Kalamkari with a cream half and peacock buti at the hem.' },
  { type: 'kalamkari-kurti', title: 'The Crimson Peacock', color: 'Crimson', price: 1320, occasion: ['festive'], rating: 4.7, reviewCount: 6, sizes: ['S', 'M', 'L', 'XL'], desc: 'Crimson and black halves with a hand-drawn peacock kongu — a festival favourite.' },

  // — Kalamkari frocks (women) —
  { type: 'kalamkari-frock', title: 'The Indigo Long Frock', color: 'Indigo', price: 1650, occasion: ['festive'], badge: 'Women', featured: true, rating: 4.8, reviewCount: 12, sizes: ['S', 'M', 'L', 'XL'], desc: 'A flowing calf-length Kalamkari frock in indigo, tree-of-life panels sweeping the skirt.', long: 'A calf-length A-line frock in hand-block Kalamkari cotton. Indigo tree-of-life panels run the full skirt, gathered at a piped waist, with short sleeves and a covered placket. Lined cotton, pockets, and natural dyes that soften with every wash.' },
  { type: 'kalamkari-frock', title: 'The Rust A-line', color: 'Rust', price: 1350, occasion: ['daily', 'office'], rating: 4.6, reviewCount: 7, sizes: ['S', 'M', 'L', 'XL'], desc: 'Madder-rust Kalamkari A-line, knee length — throw it on and go.' },
  { type: 'kalamkari-frock', title: 'The Black Peacock Frock', color: 'Black', price: 1750, occasion: ['festive'], rating: 4.8, reviewCount: 9, sizes: ['S', 'M', 'L', 'XL'], desc: 'Black Kalamkari frock with hand-drawn peacocks and a mustard border at the hem.' },

  // — Kalamkari frocks (girls / kids) —
  { type: 'kalamkari-frock', title: 'The Little Indigo Frock', color: 'Indigo', price: 650, occasion: ['daily', 'festive'], badge: 'For Girls', featured: true, rating: 4.9, reviewCount: 16, sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'], desc: 'A tiny version of our indigo frock — same Kalamkari, made for little ones.' },
  { type: 'kalamkari-frock', title: 'The Mustard Bird Frock', color: 'Mustard', price: 720, occasion: ['festive'], rating: 4.8, reviewCount: 8, sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'], desc: 'Mustard Kalamkari with hand-drawn birds — a twirl-worthy festival frock for girls.' },
  { type: 'kalamkari-frock', title: 'The Rose Floral Frock', color: 'Pink', price: 590, occasion: ['daily'], badge: 'Under ₹1,000', rating: 4.7, reviewCount: 10, sizes: ['2-3Y', '4-5Y', '6-7Y'], desc: 'Soft rose Kalamkari florals, gentle cotton for everyday play.' },
  { type: 'kalamkari-frock', title: 'The Teal Mango Frock', color: 'Teal', price: 680, occasion: ['festive', 'daily'], rating: 4.7, reviewCount: 6, sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'], desc: 'Teal Kalamkari with a mango-buti border — light and breezy for summer.' },

  // — Kalamkari cotton sarees —
  { type: 'kalamkari-saree', title: 'The Srikalahasti Pen-Kalamkari', color: 'Maroon', price: 3200, mrp: 3900, occasion: ['festive'], badge: 'Hand-Painted', featured: true, rating: 4.9, reviewCount: 21, desc: 'Pen-Kalamkari, drawn entirely by hand in Srikalahasti — a tree of life across the pallu.', long: 'A Srikalahasti pen-Kalamkari saree: every line drawn by hand with a bamboo kalam and natural dyes, on a soft cotton body. A full tree-of-life pallu, narrative borders, and the faint earthiness of myrobalan and madder that only real Kalamkari carries. One of a kind.', isUnique: true, stock: 1 },
  { type: 'kalamkari-saree', title: 'The Machilipatnam Indigo', color: 'Indigo', price: 1850, occasion: ['festive', 'daily'], featured: true, rating: 4.8, reviewCount: 15, desc: 'Machilipatnam block-print Kalamkari in indigo, with a running floral border.' },
  { type: 'kalamkari-saree', title: 'The Tree of Life', color: 'Rust', price: 2400, occasion: ['festive'], rating: 4.8, reviewCount: 11, desc: 'Madder-rust Kalamkari with a classic tree-of-life pallu on handloom cotton.' },
  { type: 'kalamkari-saree', title: 'The Mustard Block-Print', color: 'Mustard', price: 1450, occasion: ['daily', 'office'], rating: 4.6, reviewCount: 9, desc: 'Soft mustard Kalamkari, all-over buti — a saree that works on a Tuesday.' },
  { type: 'kalamkari-saree', title: 'The Black & Red Narrative', color: 'Black', price: 2100, occasion: ['festive'], rating: 4.8, reviewCount: 7, desc: 'Black body, red Kalamkari figures telling a story along the border.' },
  { type: 'kalamkari-saree', title: 'The Teal Temple Kalamkari', color: 'Teal', price: 1950, occasion: ['festive'], rating: 4.7, reviewCount: 6, desc: 'Teal cotton with a temple-border Kalamkari pallu in ochre and cream.' },

  // — Daily wear sarees —
  { type: 'daily-saree', title: 'The Indigo Everyday', color: 'Indigo', price: 650, occasion: ['daily', 'office'], badge: 'Under ₹1,000', featured: true, rating: 4.6, reviewCount: 24, desc: 'A soft indigo cotton with a thin gold line — the saree you reach for on Mondays.' },
  { type: 'daily-saree', title: 'The Mangalagiri Cotton', color: 'Maroon', price: 890, occasion: ['office', 'daily'], featured: true, rating: 4.7, reviewCount: 18, desc: 'Crisp Mangalagiri-style cotton with the signature gold-tissue border.' },
  { type: 'daily-saree', title: 'The Mustard Soft Cotton', color: 'Mustard', price: 550, occasion: ['daily'], badge: 'Under ₹1,000', rating: 4.5, reviewCount: 15, desc: 'Featherlight mustard cotton, gentle drape, easy iron.' },
  { type: 'daily-saree', title: 'The Teal Jasmine', color: 'Teal', price: 480, occasion: ['daily'], badge: 'Under ₹500', rating: 4.4, reviewCount: 12, desc: 'Cool teal cotton with scattered jasmine buti — under five hundred, over-delivers.' },
  { type: 'daily-saree', title: 'The Rose Floral Daily', color: 'Pink', price: 620, occasion: ['daily'], rating: 4.5, reviewCount: 9, desc: 'Dusty-rose cotton with a small floral border — the gift that always fits.' },
  { type: 'daily-saree', title: 'The Green Check', color: 'Green', price: 720, occasion: ['office'], rating: 4.5, reviewCount: 8, desc: 'Bottle-green cotton with a fine check and a thin zari line — sharp at the office.' },
  { type: 'daily-saree', title: 'The Charcoal Office', color: 'Black', price: 990, occasion: ['office', 'daily'], featured: true, rating: 4.6, reviewCount: 13, desc: 'Charcoal cotton with a single gold border line — quiet, structured, Monday-ready.' },
  { type: 'daily-saree', title: 'The Crimson Festive Cotton', color: 'Crimson', price: 1150, occasion: ['festive', 'daily'], rating: 4.6, reviewCount: 7, desc: 'Crimson cotton dressed up with a wide gold-tissue pallu for small festivals.' },
  { type: 'daily-saree', title: 'The Ivory Gold Tissue', color: 'Ivory', price: 1200, occasion: ['festive'], rating: 4.6, reviewCount: 6, desc: 'Ivory cotton-tissue with a self-gold sheen — barely-there festive light.' },
];

// Built-in catalogue used to seed the products store (and the Supabase
// `products` table). Pages read the *live* products from ProductsContext.
export const SEED_SAREES = SEED.map((s, i) => build(s, i));

// --- categories (counts computed from data) ---
const CATEGORY_DEFS = [
  { slug: 'all', label: 'All' },
  { slug: 'kalamkari-kurti', label: 'Kalamkari Kurtis' },
  { slug: 'kalamkari-frock', label: 'Kalamkari Frocks' },
  { slug: 'kalamkari-saree', label: 'Kalamkari Sarees' },
  { slug: 'daily-saree', label: 'Daily Wear Sarees' },
  { slug: 'kids', label: 'For Girls' },
  { slug: 'under-1000', label: 'Under ₹1,000' },
];

export function inCategory(s, cat) {
  if (!cat || cat === 'all') return true;
  switch (cat) {
    case 'under-1000':
      return s.price < 1000;
    case 'kids':
      return (s.sizes || []).some((sz) => KIDS_SIZES.includes(sz));
    default:
      return s.type === cat;
  }
}

export const computeCategories = (products) =>
  CATEGORY_DEFS.map((c) => ({
    ...c,
    count: c.slug === 'all' ? products.length : products.filter((s) => inCategory(s, c.slug)).length,
  }));

// price bands tuned for cotton / daily wear
export const PRICE_BANDS = [
  { id: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: '2000-3500', label: '₹2,000 – ₹3,500', min: 2000, max: 3500 },
  { id: 'above-3500', label: 'Above ₹3,500', min: 3500, max: Infinity },
];

export const TYPES = Object.entries(TYPE_META).map(([slug, m]) => ({ slug, label: m.label }));
export const OCCASIONS = ['daily', 'festive', 'office', 'gifting', 'pooja'];
export const COLOR_NAMES = Object.keys(COLORS);
export const colorSwatch = (name) => COLORS[name] || ['#26304F', '#3A4A78', '#C9A24B'];
export const occasionLabel = (o) => OCCASION_LABELS[o] || o;
export const typeLabel = (t) => TYPE_META[t]?.label || t;

/**
 * Filter + sort. Multi-select fields accept arrays (empty = no constraint).
 */
export function filterSarees(products, {
  category = 'all',
  bands = [],
  type = [],
  occasion = [],
  color = [],
  size = [],
  sortBy = 'featured',
} = {}) {
  let result = products.filter((s) => inCategory(s, category));

  if (bands.length) {
    result = result.filter((s) =>
      bands.some((b) => {
        const band = PRICE_BANDS.find((p) => p.id === b);
        return band && s.price >= band.min && s.price < band.max;
      })
    );
  }
  if (type.length) result = result.filter((s) => type.includes(s.type));
  if (occasion.length) result = result.filter((s) => occasion.some((o) => s.occasion.includes(o)));
  if (color.length) result = result.filter((s) => color.includes(s.color));
  if (size.length) result = result.filter((s) => (s.sizes || []).some((sz) => size.includes(sz)));

  const sorted = [...result];
  if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
  else if (sortBy === 'newest') sorted.sort((a, b) => b.id.localeCompare(a.id));
  else if (sortBy === 'popular') sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  return sorted;
}

export const getSaree = (products, id) => products.find((s) => s.id === id) || null;

export function relatedSarees(products, saree, n = 4) {
  if (!saree) return [];
  return products
    .filter((s) => s.id !== saree.id)
    .map((s) => ({
      s,
      score:
        (s.type === saree.type ? 2 : 0) +
        (s.occasion.some((o) => saree.occasion.includes(o)) ? 1 : 0) +
        (Math.abs(s.price - saree.price) < 800 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.s);
}

export const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/**
 * Build a complete product object from the fields an admin enters in the
 * dashboard (derives swatch/accent/sku/discount/specs from type + colour).
 */
export function makeProduct(input) {
  const type = input.type || 'kalamkari-kurti';
  const meta = TYPE_META[type] || TYPE_META['kalamkari-kurti'];
  const [dark, light, accent] = COLORS[input.color] || COLORS.Indigo;
  const price = Number(input.price) || 0;
  const mrp = Number(input.mrp) || Math.round((price * 1.2) / 100) * 100;
  const discount = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  const stamp = Date.now().toString(36);
  const apparel = meta.kind === 'apparel';
  const sizes = apparel && Array.isArray(input.sizes) ? input.sizes : [];
  const audience = deriveAudience(type, sizes);
  return {
    id: input.id || `mc-${stamp}`,
    sku: input.sku || `MC-${meta.code}-${stamp.slice(-4).toUpperCase()}`,
    title: input.title?.trim() || 'Untitled',
    type,
    typeLabel: meta.label,
    kind: meta.kind,
    audience,
    region: 'Andhra Pradesh',
    state: 'Andhra Pradesh',
    fabric: meta.fabric,
    occasion: input.occasion || [],
    color: input.color,
    colorHex: light,
    price,
    mrp,
    discount,
    swatch: [dark, light],
    accent,
    motif: input.motif || meta.motif,
    sizes,
    description: input.description || '',
    fullDescription: input.fullDescription || input.description || '',
    specifications: { ...specsFor(meta, input, type, audience), ...(input.specifications || {}) },
    stock: input.stock ?? (apparel ? 8 : 5),
    isUnique: input.isUnique ?? false,
    tags: [type, ...(input.occasion || [])],
    rating: input.rating ?? 4.7,
    reviewCount: input.reviewCount ?? 0,
    badge: input.badge?.trim() || null,
    featured: input.featured ?? false,
    images: Array.isArray(input.images) ? input.images.filter(Boolean).slice(0, 4) : [],
  };
}
