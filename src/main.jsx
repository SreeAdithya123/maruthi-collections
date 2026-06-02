import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// NOTE: StrictMode is intentionally omitted. Its double-invocation of effects
// in development double-registers GSAP ScrollTriggers and Three.js renderers,
// which fights the pinned hero + collection stack. Production behaviour is
// unaffected.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
