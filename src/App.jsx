import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Cursor from './components/Cursor.jsx';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import Home from './pages/Home.jsx';
import Collection from './pages/Collection.jsx';
import Story from './pages/Story.jsx';
import Visit from './pages/Visit.jsx';

gsap.registerPlugin(ScrollTrigger);

/* Keep ScrollTrigger in lock-step with Lenis' smoothed scroll. */
function ScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

/* Reset scroll + recalculate triggers whenever the route changes. */
function ScrollToTop() {
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
    // Drive Lenis from GSAP's ticker so scroll + scrub share one clock.
    function raf(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Fonts shift layout — recompute trigger positions once they load.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => gsap.ticker.remove(raf);
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        autoRaf: false,
        syncTouch: false,
      }}
    >
      <ScrollSync />
      <ScrollToTop />
      <Cursor />
      <Navigation />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/story" element={<Story />} />
            <Route path="/visit" element={<Visit />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </ReactLenis>
  );
}
