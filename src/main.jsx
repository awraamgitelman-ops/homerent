import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RouterProvider } from './context/RouterContext';
import './index.css';

// Media Shield: Prevent drag-to-download on media wrappers
if (typeof document !== 'undefined') {
  document.addEventListener('dragstart', (e) => {
    if (e.target && (e.target.tagName === 'IMG' || e.target.closest?.('.pc-image-wrapper, .pm-main-img-box, .pm-lb-content, .mls-card-img-wrap, .pm-thumb-item'))) {
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

