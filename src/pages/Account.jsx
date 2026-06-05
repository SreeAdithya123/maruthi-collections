import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, ShoppingBag, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { supabase, hasSupabase } from '../lib/supabase';
import { inr } from '../data/sarees';

const STATUS_TONE = {
  pending: 'text-zari-gold',
  confirmed: 'text-peacock-teal',
  shipped: 'text-peacock-teal',
  delivered: 'text-peacock-teal',
  cancelled: 'text-maroon-silk',
};

export default function Account() {
  const { user, isAdmin, signOut } = useAuth();
  const { items: wishItems } = useWishlist();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [optIn, setOptIn] = useState(true);

  useEffect(() => {
    if (!hasSupabase || !user) return;
    supabase
      .from('orders')
      .select('id, order_no, items, total, status, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []));
    supabase
      .from('profiles')
      .select('email_opt_in')
      .eq('id', user.id)
      .single()
      .then(({ data }) => { if (data) setOptIn(data.email_opt_in); });
  }, [user]);

  const toggleOptIn = async () => {
    const next = !optIn;
    setOptIn(next);
    await supabase.from('profiles').update({ email_opt_in: next }).eq('id', user.id);
  };

  const logout = () => {
    signOut();
    navigate('/');
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="bg-ivory pt-28 md:pt-32">
      <div className="mx-auto max-w-[1000px] px-6 pb-24 md:px-10">
        <span className="label-roman">Your Account</span>
        <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep md:text-5xl">
          Namaskaram, {firstName}.
        </h1>
        <p className="mt-2 text-ink-soft">{user?.email}</p>

        {isAdmin && (
          <Link
            to="/admin"
            className="mt-6 inline-flex items-center gap-2 border bg-maroon/[0.05] px-5 py-3 font-roman text-[0.62rem] uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-maroon/[0.1]"
            style={{ borderColor: 'rgba(184,137,90,0.4)' }}
          >
            <LayoutDashboard size={15} /> Open Curator Studio (Admin)
          </Link>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <Link to="/wishlist" className="group border p-6 transition-colors hover:bg-ivory-soft/60" style={{ borderColor: 'var(--border)' }}>
            <Heart size={20} className="text-zari-gold" />
            <h3 className="mt-3 font-display text-xl text-maroon-deep">Saved</h3>
            <p className="mt-1 text-sm text-ink-soft">{wishItems.length} piece{wishItems.length === 1 ? '' : 's'} kept for later</p>
          </Link>
          <Link to="/cart" className="group border p-6 transition-colors hover:bg-ivory-soft/60" style={{ borderColor: 'var(--border)' }}>
            <ShoppingBag size={20} className="text-zari-gold" />
            <h3 className="mt-3 font-display text-xl text-maroon-deep">Cart</h3>
            <p className="mt-1 text-sm text-ink-soft">{itemCount} item{itemCount === 1 ? '' : 's'} ready to order</p>
          </Link>
          <div className="border p-6" style={{ borderColor: 'var(--border)' }}>
            <Package size={20} className="text-zari-gold" />
            <h3 className="mt-3 font-display text-xl text-maroon-deep">Orders</h3>
            <p className="mt-1 text-sm text-ink-soft">{orders.length} order{orders.length === 1 ? '' : 's'} placed</p>
          </div>
        </div>

        {/* Order history */}
        <div className="mt-12">
          <h2 className="font-roman text-[0.62rem] uppercase tracking-[0.22em] text-maroon-deep">Order history</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">
              No orders yet. When you place one, your invoice is emailed and it appears here.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b px-4 py-3 last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-roman text-[0.62rem] uppercase tracking-[0.16em] text-zari-gold">{o.order_no}</span>
                  <span className="text-sm text-ink-soft">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="text-sm text-ink-soft">{(o.items || []).reduce((n, i) => n + (i.qty || 1), 0)} item(s)</span>
                  <span className={`text-xs uppercase tracking-[0.14em] ${STATUS_TONE[o.status] || 'text-ink-soft'}`}>{o.status}</span>
                  <span className="ml-auto font-display text-lg text-maroon">{inr(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-roman text-[0.62rem] uppercase tracking-[0.22em] text-maroon-deep">Profile</h2>
          <dl className="mt-4 max-w-md space-y-2.5 text-sm">
            <div className="flex justify-between border-b py-2" style={{ borderColor: 'var(--border)' }}>
              <dt className="text-ink-soft">Name</dt>
              <dd className="text-maroon-deep">{user?.name}</dd>
            </div>
            <div className="flex justify-between border-b py-2" style={{ borderColor: 'var(--border)' }}>
              <dt className="text-ink-soft">Email</dt>
              <dd className="text-maroon-deep">{user?.email}</dd>
            </div>
          </dl>

          <label className="mt-5 flex max-w-md cursor-pointer items-center gap-3 text-sm text-ink-soft">
            <input type="checkbox" checked={optIn} onChange={toggleOptIn} />
            Email me about new arrivals and offers
          </label>

          <button onClick={logout} className="btn-ghost mt-8 inline-flex items-center gap-2">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
