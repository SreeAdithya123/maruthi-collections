import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import { Toaster } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './context/AuthContext.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { RequireAuth, RequireAdmin } from './components/RouteGuards.jsx';

import Home from './pages/Home.jsx';
import Sarees from './pages/Sarees.jsx';
import SareeDetail from './pages/SareeDetail.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Story from './pages/Story.jsx';
import Visit from './pages/Visit.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AuthCallback from './pages/AuthCallback.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

gsap.registerPlugin(ScrollTrigger);

function ScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

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
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <ReactLenis
              root
              ref={lenisRef}
              options={{ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, autoRaf: false, syncTouch: false }}
            >
              <SplashScreen />
              <ScrollSync />
              <RouteResetter />
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
                    <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
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
      </ProductsProvider>
    </AuthProvider>
  );
}
