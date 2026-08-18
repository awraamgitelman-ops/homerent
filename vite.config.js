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

import jpeg from 'jpeg-js'

const _ENC_KEY = 'FavoritGroupPoltava2026SecureKey';
const _ENC_BLOB = [126, 89, 67, 95, 74, 81, 66, 117, 70, 95, 79, 49, 17, 41, 11, 50, 49, 19, 18, 113, 106, 117, 64, 63, 85, 81, 34, 59, 55, 61, 83, 33, 14, 13, 17, 9, 11, 92, 28, 34, 28, 94, 6, 47, 3, 46];
const _getBotToken = () => _ENC_BLOB.map((b, i) => String.fromCharCode(b ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length))).join('');

const mediaProxyPlugin = () => ({
  name: 'media-proxy-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // 1. Lead Dispatch Endpoint for local dev
      if (req.url && req.url.startsWith('/api/send-lead') && req.method === 'POST') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString());
            const botToken = _getBotToken();
            const chatId = '8298199477';
            
            const text = `🏢 <b>НОВА ЗАЯВКА (DEV/TEST) — АН «ФАВОРИТ ГРУП»</b>\n\n` +
              `👤 <b>Клієнт:</b> ${body.name || 'Не вказано'}\n` +
              `📞 <b>Телефон:</b> <code>${body.phone || 'Не вказано'}</code>\n` +
              `📌 <b>Тип:</b> ${body.type || 'Запит'}\n` +
              (body.propertyTitle ? `🏠 <b>Об'єкт:</b> ${body.propertyTitle}\n` : '') +
              (body.district ? `📍 <b>Район:</b> ${body.district}\n` : '') +
              (body.budget || body.targetPrice ? `💰 <b>Бюджет:</b> ${body.budget || body.targetPrice}\n` : '') +
              (body.comment ? `💬 <b>Коментар:</b> <i>${body.comment}</i>\n` : '') +
              `⏰ <b>Час:</b> ${new Date().toLocaleTimeString('uk-UA')}`;

            const postPayload = JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: 'HTML',
              disable_web_page_preview: true
            });

            const tgReq = https.request({
              hostname: 'api.telegram.org',
              port: 443,
              path: `/bot${botToken}/sendMessage`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postPayload)
              }
            }, (tgRes) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Lead sent in dev mode' }));
            });

            tgReq.on('error', () => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Telegram dispatch failed' }));
            });

            tgReq.write(postPayload);
            tgReq.end();
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }

      // 2. Media Proxy Endpoint
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
            const chunks = [];
            upstream.on('data', chunk => chunks.push(chunk));
            upstream.on('end', () => {
              try {
                const rawBuffer = Buffer.concat(chunks);
                const decoded = jpeg.decode(rawBuffer, { useTArray: true });
                const cropTop = Math.min(280, Math.max(180, Math.floor(decoded.height * 0.18)));
                const newHeight = decoded.height - cropTop;
                const newWidth = decoded.width;
                
                const rowBytes = newWidth * 4;
                const startByte = cropTop * rowBytes;
                const totalBytes = newHeight * rowBytes;
                
                const croppedPixels = decoded.data.subarray(startByte, startByte + totalBytes);
                
                const encoded = jpeg.encode({
                  data: croppedPixels,
                  width: newWidth,
                  height: newHeight
                }, 85);
                
                res.setHeader('Content-Type', 'image/jpeg');
                res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
                res.end(encoded.data);
              } catch {
                res.setHeader('Content-Type', upstream.headers['content-type'] || 'image/jpeg');
                res.end(Buffer.concat(chunks));
              }
            });
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

