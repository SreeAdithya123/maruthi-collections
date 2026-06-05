import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Minus, Plus, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { inr } from '../data/sarees';
import { site } from '../data/site';
import ProductImage from '../components/ProductImage';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

const COUPONS = { FESTIVE10: 0.1, GODAVARI5: 0.05 };

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, subtotal, savings, itemCount } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [placing, setPlacing] = useState(false);
  useRevealOnScroll([items.length]);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setApplied(code);
      setCouponMsg(`Applied ${code} — ${COUPONS[code] * 100}% off`);
    } else {
      setApplied(null);
      setCouponMsg('That code isn’t one of ours.');
    }
  };

  const couponDiscount = applied ? Math.round(subtotal * COUPONS[applied]) : 0;
  const taxable = subtotal - couponDiscount;
  const gst = Math.round(taxable * 0.05);
  const total = taxable + gst;

  const saveForLater = (item) => {
    addToWishlist(item);
    removeFromCart(item.lineId);
  };

  const placeOrder = async () => {
    if (!user) {
      toast('Please sign in to place your order');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (!supabase) return toast.error('Orders are not configured yet');
    setPlacing(true);
    const payload = {
      user_id: user.id,
      email: user.email,
      customer_name: user.name,
      items: items.map((i) => ({ id: i.id, title: i.title, sku: i.sku, size: i.size || null, qty: i.qty, price: i.price })),
      subtotal,
      discount: couponDiscount,
      gst,
      total,
      status: 'pending',
    };
    const { data, error } = await supabase.from('orders').insert(payload).select().single();
    if (error) {
      setPlacing(false);
      return toast.error(error.message);
    }
    // Email the invoice (best-effort; needs the email function + RESEND key).
    supabase.functions.invoke('email', { body: { kind: 'invoice', orderId: data.id } }).catch(() => {});
    clearCart();
    setPlacing(false);
    toast.success(`Order ${data.order_no} placed — your invoice is on its way`);
    navigate('/account');
  };

  const orderViaWhatsApp = () => {
    const lines = items
      .map((i) => `• ${i.title}${i.size ? ` · Size ${i.size}` : ''} (${i.sku}) x${i.qty} — ${inr(i.price * i.qty)}`)
      .join('%0A');
    const msg =
      `Namaskaram Sai Priyanka, I'd like to order:%0A%0A${lines}%0A%0A` +
      `Subtotal: ${inr(subtotal)}` +
      (applied ? `%0ACoupon ${applied}: -${inr(couponDiscount)}` : '') +
      `%0AGST (5%25): ${inr(gst)}%0ATotal: ${inr(total)}%0A%0APlease confirm availability and how to pay.`;
    window.open(`https://wa.me/${site.phoneTel.replace('+', '')}?text=${msg}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
        <span className="label-roman">Your Cart</span>
        <h1 className="mt-4 font-display text-4xl font-light text-maroon-deep">Your cart is quiet.</h1>
        <p className="mt-3 max-w-sm text-ink-soft">
          No sarees chosen yet. Every piece is hand-picked — take your time.
        </p>
        <Link to="/sarees" className="btn-primary mt-8">Browse the Collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1300px] px-6 pb-24 md:px-10">
        <h1 className="font-display text-4xl font-light text-maroon-deep">
          Your Cart <span className="text-2xl text-ink-soft">({itemCount})</span>
        </h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* items */}
          <div>
            {items.map((item) => (
              <div key={item.lineId} className="reveal flex gap-4 border-b py-5" style={{ borderColor: 'var(--border)' }}>
                <Link to={`/saree/${item.id}`} className="shrink-0">
                  <ProductImage saree={item} motifSize="2.5rem" className="h-28 w-24 rounded-[2px]" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-roman text-[0.58rem] uppercase tracking-[0.2em] text-zari-gold">{item.typeLabel}</span>
                      <Link to={`/saree/${item.id}`} className="block font-display text-lg text-maroon-deep hover:text-maroon">{item.title}</Link>
                      <span className="font-sans text-xs text-ink-soft">
                        {item.color}{item.size ? ` · Size ${item.size}` : ''}
                      </span>
                    </div>
                    <button onClick={() => removeFromCart(item.lineId)} aria-label="Remove" className="h-8 w-8 shrink-0 text-ink-soft transition-colors hover:text-maroon">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center border" style={{ borderColor: 'var(--border)' }}>
                      <button onClick={() => updateQty(item.lineId, item.qty - 1)} className="px-2.5 py-1.5 text-ink-soft hover:text-maroon" aria-label="Decrease"><Minus size={14} /></button>
                      <span className="min-w-[2rem] text-center font-sans text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.lineId, item.qty + 1)} disabled={item.isUnique} className="px-2.5 py-1.5 text-ink-soft hover:text-maroon disabled:opacity-30" aria-label="Increase"><Plus size={14} /></button>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-lg text-maroon">{inr(item.price * item.qty)}</span>
                      {item.mrp > item.price && <span className="ml-2 font-sans text-xs text-ink-soft line-through">{inr(item.mrp * item.qty)}</span>}
                    </div>
                  </div>
                  <button onClick={() => saveForLater(item)} className="mt-2 self-start font-roman text-[0.55rem] uppercase tracking-[0.16em] text-ink-soft hover:text-maroon">
                    Save for later
                  </button>
                </div>
              </div>
            ))}
            <Link to="/sarees" className="mt-6 inline-block font-roman text-[0.62rem] uppercase tracking-[0.18em] text-maroon hover:text-zari-gold">
              ← Continue shopping
            </Link>
          </div>

          {/* summary */}
          <aside>
            <div className="sticky top-28 border bg-ivory-soft/50 p-6" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-roman text-[0.65rem] uppercase tracking-[0.22em] text-maroon-deep">Order Summary</h2>

              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="min-w-0 flex-1 border bg-ivory px-3 py-2 font-sans text-sm outline-none focus:border-zari-gold"
                    style={{ borderColor: 'var(--border)' }}
                  />
                  <button onClick={applyCoupon} className="btn-ghost !px-4 !py-2">Apply</button>
                </div>
                {couponMsg && (
                  <p className={`mt-2 font-sans text-xs ${applied ? 'text-peacock-teal' : 'text-maroon-silk'}`}>{couponMsg}</p>
                )}
              </div>

              <dl className="mt-5 space-y-2.5 border-t pt-5 text-sm" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="text-maroon-deep">{inr(subtotal)}</dd></div>
                {savings > 0 && <div className="flex justify-between"><dt className="text-ink-soft">You save</dt><dd className="text-peacock-teal">−{inr(savings)}</dd></div>}
                {applied && <div className="flex justify-between"><dt className="text-ink-soft">Coupon ({applied})</dt><dd className="text-peacock-teal">−{inr(couponDiscount)}</dd></div>}
                <div className="flex justify-between"><dt className="text-ink-soft">Shipping</dt><dd className="text-peacock-teal">Free</dd></div>
                <div className="flex justify-between"><dt className="text-ink-soft">GST (5%)</dt><dd className="text-maroon-deep">{inr(gst)}</dd></div>
              </dl>

              <div className="mt-4 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <span className="font-display text-lg text-maroon-deep">Total</span>
                <span className="font-display text-2xl text-maroon">{inr(total)}</span>
              </div>

              <button onClick={placeOrder} disabled={placing} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {placing ? 'Placing…' : 'Place Order'}
              </button>
              <button onClick={orderViaWhatsApp} className="btn-ghost mt-2 w-full justify-center">
                Order on WhatsApp instead
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-sans text-[0.7rem] text-ink-soft">
                <ShieldCheck size={12} className="text-zari-gold" /> You&rsquo;ll get an invoice by email; Sai Priyanka confirms payment personally
              </p>
              <p className="mt-4 border-t pt-4 text-center font-sans text-xs text-ink-soft" style={{ borderColor: 'var(--border)' }}>
                Prefer to talk? <a href={`tel:${site.phoneTel}`} className="text-maroon">{site.phoneDisplay}</a>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
