import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, ShoppingBag, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Account() {
  const { user, isAdmin, signOut } = useAuth();
  const { items: wishItems } = useWishlist();
  const { itemCount } = useCart();
  const navigate = useNavigate();

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
            <p className="mt-1 text-sm text-ink-soft">{wishItems.length} saree{wishItems.length === 1 ? '' : 's'} kept for later</p>
          </Link>
          <Link to="/cart" className="group border p-6 transition-colors hover:bg-ivory-soft/60" style={{ borderColor: 'var(--border)' }}>
            <ShoppingBag size={20} className="text-zari-gold" />
            <h3 className="mt-3 font-display text-xl text-maroon-deep">Cart</h3>
            <p className="mt-1 text-sm text-ink-soft">{itemCount} item{itemCount === 1 ? '' : 's'} ready to order</p>
          </Link>
          <div className="border p-6" style={{ borderColor: 'var(--border)' }}>
            <Package size={20} className="text-zari-gold" />
            <h3 className="mt-3 font-display text-xl text-maroon-deep">Orders</h3>
            <p className="mt-1 text-sm text-ink-soft">Placed via WhatsApp with Sai Priyanka. Order history arrives with Supabase.</p>
          </div>
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
          <button onClick={logout} className="btn-ghost mt-8 inline-flex items-center gap-2">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
