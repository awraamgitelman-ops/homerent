import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

const _MEDIA_KEY = 'FavoritGroupPoltava2026MediaKey';

function decryptMediaUrl(token) {
  if (!token || typeof token !== 'string') return '';
  const clean = token.replace(/^\/api\/media\//, '');
  if (!clean.startsWith('FG_')) return clean;
  
  const b64 = clean.slice(3).replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const binary = Buffer.from(b64 + pad, 'base64').toString('binary');
  
  let url = '';
  for (let i = 0; i < binary.length; i++) {
    url += String.fromCharCode(binary.charCodeAt(i) ^ _MEDIA_KEY.charCodeAt(i % _MEDIA_KEY.length));
  }
  return url;
}

const mediaProxyPlugin = () => ({
  name: 'media-proxy-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/api/media/')) {
        const token = req.url.split('/api/media/')[1]?.split('?')[0];
        const rawUrl = decryptMediaUrl(token);
        if (rawUrl && rawUrl.startsWith('http')) {
          const options = {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
          };
          https.get(rawUrl, options, (upstream) => {
            res.setHeader('Content-Type', upstream.headers['content-type'] || 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
            upstream.pipe(res);
          }).on('error', () => {
            res.statusCode = 502;
            res.end('Upstream error');
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mediaProxyPlugin()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  }
})

