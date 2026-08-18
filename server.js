import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security & Header Masking
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Server', 'nginx');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

// ==========================================
// ENCRYPTED MEDIA PROXY & PHYSICAL CROP SHIELD
// ==========================================
const _MEDIA_KEY = 'FavoritGroupPoltava2026MediaKey';
const _imageCache = new Map();
const MAX_CACHE_SIZE = 500;

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

app.get('/api/media/:token', async (req, res) => {
  const token = req.params.token;
  
  // 1. Serve from in-memory cache if available
  if (_imageCache.has(token)) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', 'inline');
    return res.send(_imageCache.get(token));
  }

  try {
    const rawUrl = decryptMediaUrl(token);
    if (!rawUrl || !rawUrl.startsWith('http')) {
      return res.status(404).send('Not found');
    }

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };

    https.get(rawUrl, options, (upstream) => {
      if (upstream.statusCode !== 200) {
        return res.status(upstream.statusCode).send('Media unavailable');
      }

      const chunks = [];
      upstream.on('data', chunk => chunks.push(chunk));
      upstream.on('end', async () => {
        try {
          const rawBuffer = Buffer.concat(chunks);
          const meta = await sharp(rawBuffer).metadata();
          
          // Physically remove top 200px watermark / status banner from image binary
          const cropTop = Math.min(200, meta.height > 600 ? 200 : Math.floor(meta.height * 0.20));
          const targetHeight = Math.max(100, meta.height - cropTop);
          
          const processedBuffer = await sharp(rawBuffer)
            .extract({
              left: 0,
              top: cropTop,
              width: meta.width,
              height: targetHeight
            })
            .jpeg({ quality: 86, progressive: true })
            .toBuffer();

          // Store in LRU cache
          if (_imageCache.size >= MAX_CACHE_SIZE) {
            const firstKey = _imageCache.keys().next().value;
            _imageCache.delete(firstKey);
          }
          _imageCache.set(token, processedBuffer);

          res.setHeader('Content-Type', 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Content-Disposition', 'inline');
          return res.send(processedBuffer);
        } catch (procErr) {
          console.error('[Media Process] Sharp Error:', procErr.message);
          // Fallback to raw buffer if image format is unusual
          const rawBuffer = Buffer.concat(chunks);
          res.setHeader('Content-Type', upstream.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
          return res.send(rawBuffer);
        }
      });
    }).on('error', (err) => {
      console.error('[Media Proxy] Upstream Error:', err.message);
      res.status(502).send('Upstream error');
    });
  } catch (err) {
    console.error('[Media Proxy] Decryption error:', err.message);
    res.status(400).send('Invalid token');
  }
});

// ==========================================
// ENCRYPTED TELEGRAM BOT SECRETS & ENGINE
// ==========================================
const _ENC_KEY = 'FavoritGroupPoltava2026SecureKey';
const _ENC_BLOB = [126, 89, 67, 95, 74, 81, 66, 117, 70, 95, 79, 49, 17, 41, 11, 50, 49, 19, 18, 113, 106, 117, 64, 63, 85, 81, 34, 59, 55, 61, 83, 33, 14, 13, 17, 9, 11, 92, 28, 34, 28, 94, 6, 47, 3, 46];

function getBotToken() {
  if (process.env.TELEGRAM_BOT_TOKEN) {
    return process.env.TELEGRAM_BOT_TOKEN;
  }
  return _ENC_BLOB.map((b, i) => String.fromCharCode(b ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length))).join('');
}

const TELEGRAM_BOT_TOKEN = getBotToken();
const CONFIG_FILE = path.join(__dirname, 'telegram_config.json');

// Persistent Telegram Configuration
let telegramConfig = {
  chatIds: [],
  lastUpdateId: 0,
  leadsCount: 0
};

function loadTelegramConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      telegramConfig = { ...telegramConfig, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('[Telegram] Config load error:', err.message);
  }

  const defaultChatId = process.env.TELEGRAM_CHAT_ID || '8298199477';
  if (defaultChatId && !telegramConfig.chatIds.includes(String(defaultChatId))) {
    telegramConfig.chatIds.push(String(defaultChatId));
  }
}

function saveTelegramConfig() {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(telegramConfig, null, 2), 'utf8');
  } catch (err) {
    console.error('[Telegram] Config save error:', err.message);
  }
}

loadTelegramConfig();

// Helper: Make Telegram API Request
function callTelegramApi(method, payload = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse Telegram response: ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Telegram API request timeout'));
    });

    req.write(data);
    req.end();
  });
}

// Helper: Send HTML Message to all registered chats
async function sendTelegramMessage(htmlText) {
  if (!telegramConfig.chatIds || telegramConfig.chatIds.length === 0) {
    await pollTelegramUpdates();
  }

  if (!telegramConfig.chatIds || telegramConfig.chatIds.length === 0) {
    console.warn('[Telegram] No chat IDs configured.');
    return { success: false, reason: 'No active chat IDs configured' };
  }

  const results = [];
  for (const chatId of telegramConfig.chatIds) {
    try {
      const res = await callTelegramApi('sendMessage', {
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });

      if (res.ok) {
        results.push({ chatId, ok: true });
      } else {
        console.error(`[Telegram] Error sending to chat ${chatId}:`, res.description);
        results.push({ chatId, ok: false, error: res.description });
      }
    } catch (err) {
      console.error(`[Telegram] Exception sending to chat ${chatId}:`, err.message);
      results.push({ chatId, ok: false, error: err.message });
    }
  }

  telegramConfig.leadsCount += 1;
  saveTelegramConfig();

  return { success: true, results };
}

// Helper: Poll updates to auto-discover groups where bot was added as admin or received /start
async function pollTelegramUpdates() {
  try {
    const res = await callTelegramApi('getUpdates', {
      offset: telegramConfig.lastUpdateId + 1,
      timeout: 0,
      allowed_updates: ['message', 'my_chat_member', 'channel_post']
    });

    if (!res.ok || !Array.isArray(res.result)) {
      return;
    }

    let hasNewChats = false;

    for (const update of res.result) {
      if (update.update_id > telegramConfig.lastUpdateId) {
        telegramConfig.lastUpdateId = update.update_id;
      }

      const msg = update.message || update.channel_post;
      const myMember = update.my_chat_member;
      const chat = (msg && msg.chat) || (myMember && myMember.chat);

      if (chat && chat.id) {
        const chatIdStr = String(chat.id);
        if (!telegramConfig.chatIds.includes(chatIdStr)) {
          telegramConfig.chatIds.push(chatIdStr);
          hasNewChats = true;

          console.log(`[Telegram] New chat discovered! Title: "${chat.title || chat.username || 'Private'}" (ID: ${chatIdStr})`);

          // Send welcome activation notice
          callTelegramApi('sendMessage', {
            chat_id: chatIdStr,
            text: `✅ <b>Бот сповіщень АН «ФАВОРИТ ГРУП» активовано!</b>\n\nЧат <code>${chatIdStr}</code> (<b>${chat.title || chat.username || 'Приватний чат'}</b>) підключено. Усі нові заявки з сайту надходитимуть сюди автоматично.`,
            parse_mode: 'HTML'
          }).catch(() => {});
        }
      }
    }

    if (hasNewChats) {
      saveTelegramConfig();
    }
  } catch (err) {
    // Ignore polling errors silently
  }
}

// Poll Telegram updates periodically every 10 seconds
setInterval(pollTelegramUpdates, 10000);
pollTelegramUpdates();

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Submit New Lead
app.post('/api/send-lead', async (req, res) => {
  try {
    const { name, phone, type, propertyTitle, district, budget, comment, details, source } = req.body || {};

    if (!name && !phone) {
      return res.status(400).json({ error: "Ім'я або телефон обов'язкові" });
    }

    const kyivTimeStr = new Date().toLocaleString('uk-UA', {
      timeZone: 'Europe/Kyiv',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const htmlText = `🏢 <b>НОВА ЗАЯВКА — АН «ФАВОРИТ ГРУП» (Полтава)</b>\n\n` +
      `👤 <b>Клієнт:</b> ${escapeHtml(name || 'Не вказано')}\n` +
      `📞 <b>Телефон:</b> <code>${escapeHtml(phone || 'Не вказано')}</code>\n` +
      `📌 <b>Тип запиту:</b> ${escapeHtml(type || 'Запит консультації / перегляду')}\n` +
      (propertyTitle ? `🏠 <b>Об'єкт:</b> ${escapeHtml(propertyTitle)}\n` : '') +
      (district ? `📍 <b>Район:</b> ${escapeHtml(district)}\n` : '') +
      (budget ? `💰 <b>Бюджет / Вартість:</b> ${escapeHtml(budget)}\n` : '') +
      (comment ? `💬 <b>Коментар:</b> <i>${escapeHtml(comment)}</i>\n` : '') +
      `⏰ <b>Час заявки:</b> ${kyivTimeStr}\n\n` +
      `🌐 <b>Сайт:</b> <i>favorit-group.com</i>`;

    const sendResult = await sendTelegramMessage(htmlText);

    return res.json({
      success: true,
      message: 'Заявку успішно прийнято та надіслано в Telegram',
      telegram: sendResult
    });
  } catch (err) {
    console.error('[API /api/send-lead] Error:', err);
    return res.status(500).json({ error: 'Помилка відправки заявки', details: err.message });
  }
});

// 2. Telegram Status Endpoint
app.get('/api/telegram-status', (req, res) => {
  res.json({
    active: true,
    botName: 'alertWEB_bot',
    chatIds: telegramConfig.chatIds,
    chatCount: telegramConfig.chatIds.length,
    leadsCount: telegramConfig.leadsCount,
    lastUpdateId: telegramConfig.lastUpdateId
  });
});

// 3. Test Message Endpoint
app.post('/api/telegram-test', async (req, res) => {
  const testMsg = `🔔 <b>ТЕСТОВЕ СПОВІЩЕННЯ ВІД БОТА АН «ФАВОРИТ ГРУП»</b>\n\nСервер та бот успішно працюють на Railway.\nЧас: ${new Date().toLocaleTimeString('uk-UA')}`;
  const result = await sendTelegramMessage(testMsg);
  res.json(result);
});

// Serve static compiled assets
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '7d',
  setHeaders: (res) => {
    res.setHeader('Server', 'nginx');
  }
}));

// SPA Catch-all routing (Express 5 compatible)
app.use((req, res) => {
  res.setHeader('Server', 'nginx');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Corporate portal server listening on port ${PORT}`);
  console.log(`Telegram Bot engine initialized with encrypted token.`);
});
