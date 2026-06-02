import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { Toaster } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import Cursor from './components/Cursor.jsx';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import Home from './pages/Home.jsx';
import Sarees from './pages/Sarees.jsx';
import SareeDetail from './pages/SareeDetail.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Story from './pages/Story.jsx';
import Visit from './pages/Visit.jsx';
import NotFound from './pages/NotFound.jsx';

gsap.registerPlugin(ScrollTrigger);

/* Keep ScrollTrigger in lock-step with Lenis' smoothed scroll. */
function ScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/* Reset scroll + recalc triggers on every route change so pinned sections from
   one page never bleed into the next. */
function RouteResetter() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);
  return null;
}

export default function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    function raf(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => gsap.ticker.remove(raf);
  }, []);

  return (
    <CartProvider>
      <WishlistProvider>
        <ReactLenis
          root
          ref={lenisRef}
          options={{ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, autoRaf: false, syncTouch: false }}
        >
          <ScrollSync />
          <RouteResetter />
          <Cursor />
          <Navigation />
          <main>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sarees" element={<Sarees />} />
                <Route path="/sarees/:category" element={<Sarees />} />
                <Route path="/saree/:id" element={<SareeDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/story" element={<Story />} />
                <Route path="/visit" element={<Visit />} />
                <Route path="/collection" element={<Navigate to="/sarees" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </ReactLenis>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#4A1418',
              color: '#F5EFE3',
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.82rem',
              borderRadius: '2px',
              border: '1px solid rgba(184,137,90,0.4)',
              boxShadow: '0 12px 30px rgba(74,20,24,0.25)',
            },
            success: { iconTheme: { primary: '#D4AC7E', secondary: '#4A1418' } },
          }}
        />
      </WishlistProvider>
    </CartProvider>
  );
}
