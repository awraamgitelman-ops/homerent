import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RouterProvider } from './context/RouterContext';
import './index.css';

// Media Shield: Disable context menu and drag-to-download on images
if (typeof document !== 'undefined') {
  document.addEventListener('contextmenu', (e) => {
    if (e.target && (e.target.tagName === 'IMG' || e.target.closest?.('.pc-img-wrap, .pm-main-img-box, .pm-lb-content, .mls-card-img-wrap'))) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('dragstart', (e) => {
    if (e.target && (e.target.tagName === 'IMG' || e.target.closest?.('.pc-img-wrap, .pm-main-img-box, .pm-lb-content, .mls-card-img-wrap'))) {
      e.preventDefault();
    }
  }, { passive: false });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>
);

