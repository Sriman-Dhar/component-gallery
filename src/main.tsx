import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { routerFuture } from './lib/router';
import './index.css';

// The app arrived after the static shell's hero words were shown (index.html): the intro must not replay over them.
if (performance.now() > 1000) document.documentElement.dataset.bootLate = 'true';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter future={routerFuture}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
