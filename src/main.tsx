import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { routerFuture } from './lib/router';
import { ScrollTrigger } from './lib/motion';
import './index.css';

// The app arrived after the static shell's hero words were shown (index.html): the intro must not replay over them.
if (performance.now() > 1000) document.documentElement.dataset.bootLate = 'true';

// The routed view restores each history entry's scroll itself (RouteTransition), after its page has rendered.
// Set through ScrollTrigger: every refresh writes back the value it captured at registration, so a plain
// assignment here would be undone and the browser would restore the destination's scroll under the fade.
if ('scrollRestoration' in window.history) ScrollTrigger.clearScrollMemory('manual');

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter future={routerFuture}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
