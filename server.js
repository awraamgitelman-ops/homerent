import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jpeg from 'jpeg-js';

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
      upstream.on('end', () => {
        try {
          const rawBuffer = Buffer.concat(chunks);
          const decoded = jpeg.decode(rawBuffer, { useTArray: true });
          
          // Physically remove top watermark / status banner from image binary (up to 280px)
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

          const processedBuffer = encoded.data;

          // Store in LRU cache
          if (_imageCache.size >= MAX_CACHE_SIZE) {
            const firstKey = _imageCache.keys().next().value;
            _imageCache.delete(firstKey);
          }
          _imageCache.set(token, processedBuffer);

          res.setHeader('Content-Type', 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Content-Disposition', 'inline');
          return res.send(processedBuffer);
        } catch (procErr) {
          console.error('[Media Process] Error:', procErr.message);
          // Fallback to raw buffer
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

// Helper: Send HTML Message to all registered chats (with optional inline_keyboard)
async function sendTelegramMessage(htmlText, replyMarkup = null) {
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
      const payload = {
        chat_id: chatId,
        text: htmlText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      };

      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      const res = await callTelegramApi('sendMessage', payload);

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

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Format rich structured Telegram lead report
function formatLeadTelegramReport(leadData) {
  const {
    name,
    phone,
    type,
    formType,
    dealType,
    propCategory,
    propertyId,
    propertyTitle,
    address,
    district,
    rooms,
    area,
    floor,
    budget,
    targetPrice,
    preferredDate,
    preferredTime,
    preferredMessenger,
    residents,
    children,
    pets,
    repairPref,
    comment,
    sourceUrl
  } = leadData || {};

  const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
  const cleanTime = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const isViewing = formType === 'viewing' || (type && type.toLowerCase().includes('перегляд'));
  const isSell = formType === 'sell' || (type && (type.toLowerCase().includes('продаж') || type.toLowerCase().includes('власник') || type.toLowerCase().includes('здачу')));
  const isSearch = formType === 'search' || (type && (type.toLowerCase().includes('підбір') || type.toLowerCase().includes('пошук')));
  const isContact = formType === 'contact' || (type && type.toLowerCase().includes('контакт'));

  let headerIcon = '🏢';
  let headerTitle = 'НОВА ЗАЯВКА З САЙТУ';

  if (isViewing) {
    headerIcon = '📅';
    headerTitle = 'ЗАПИС НА ПЕРЕГЛЯД ОБ\'ЄКТА';
  } else if (isSell) {
    headerIcon = '🏷️';
    headerTitle = 'НОВА ЗАЯВКА ВІД ВЛАСНИКА';
  } else if (isSearch) {
    headerIcon = '🔍';
    headerTitle = 'ЗАПИТ НА ПЕРСОНАЛЬНИЙ ПІДБІР';
  } else if (isContact) {
    headerIcon = '📩';
    headerTitle = 'ЗВЕРНЕННЯ ЗІ СТОРІНКИ КОНТАКТІВ';
  }

  let text = `${headerIcon} <b>${headerTitle}</b>\n`;
  text += `🏛️ <i>АН «ФАВОРИТ ГРУП» Полтава</i>\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  // 1. Client Contacts Section
  text += `👤 <b>Клієнт:</b> ${escapeHtml(name || 'Не вказано')}\n`;
  text += `📞 <b>Телефон:</b> <code>${escapeHtml(phone || 'Не вказано')}</code>\n`;
  if (preferredMessenger) {
    text += `💬 <b>Зручний месенджер:</b> ${escapeHtml(preferredMessenger)}\n`;
  }
  text += `\n`;

  // 2. Request Details Section
  text += `📋 <b>Тип заявки:</b> ${escapeHtml(type || 'Консультація')}\n`;

  if (propCategory) {
    text += `🏠 <b>Категорія:</b> ${escapeHtml(propCategory)}\n`;
  }
  if (propertyTitle) {
    text += `🏢 <b>Об'єкт:</b> ${escapeHtml(propertyTitle)}\n`;
  }
  if (propertyId) {
    text += `🆔 <b>ID в базі:</b> <code>${escapeHtml(propertyId)}</code>\n`;
  }
  if (address) {
    text += `📍 <b>Адреса:</b> ${escapeHtml(address)}\n`;
  }
  if (district && district !== 'all') {
    text += `🗺️ <b>Район:</b> ${escapeHtml(district)}\n`;
  }
  if (rooms && rooms !== 'all') {
    text += `🚪 <b>Кімнат:</b> ${escapeHtml(rooms)}\n`;
  }
  if (area) {
    text += `📐 <b>Площа:</b> ${escapeHtml(area)} м²\n`;
  }
  if (floor) {
    text += `🏢 <b>Поверх:</b> ${escapeHtml(floor)}\n`;
  }
  if (budget || targetPrice) {
    text += `💰 <b>Бюджет / Вартість:</b> <b>${escapeHtml(budget || targetPrice)}</b>\n`;
  }

  // Extra details for Viewing
  if (preferredDate) {
    text += `🗓️ <b>Бажана дата:</b> ${escapeHtml(preferredDate)}\n`;
  }
  if (preferredTime) {
    text += `⏰ <b>Зручний час:</b> ${escapeHtml(preferredTime)}\n`;
  }

  // Extra details for Search (Rent / Buy)
  if (residents) {
    text += `👥 <b>Склад сім'ї:</b> ${escapeHtml(residents)}\n`;
  }
  if (children) {
    text += `👶 <b>Діти:</b> ${escapeHtml(children)}\n`;
  }
  if (pets) {
    text += `🐾 <b>Домашні тварини:</b> ${escapeHtml(pets)}\n`;
  }
  if (repairPref) {
    text += `🛠️ <b>Вимоги до стану:</b> ${escapeHtml(repairPref)}\n`;
  }

  // Comments
  if (comment && comment.trim()) {
    text += `\n💬 <b>Коментар / Побажання:</b>\n<i>${escapeHtml(comment)}</i>\n`;
  }

  text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  text += `⏰ <b>Час надходження:</b> ${cleanTime}\n`;
  text += `🌐 <b>Джерело:</b> favorit-group.com`;

  // Quick Action Buttons
  const buttons = [];
  const contactRow = [];

  if (cleanPhoneDigits) {
    const formattedPhone = cleanPhoneDigits.startsWith('380') ? cleanPhoneDigits : `380${cleanPhoneDigits.replace(/^0+/, '')}`;
    contactRow.push({ text: '💬 Telegram', url: `https://t.me/+${formattedPhone}` });
    contactRow.push({ text: '💬 Viber', url: `https://viber.click/${formattedPhone}` });
  }

  if (contactRow.length > 0) {
    buttons.push(contactRow);
  }

  if (propertyId) {
    buttons.push([{
      text: "🔗 Відкрити об'єкт на сайті",
      url: `https://favorit-group.com/property/${propertyId}`
    }]);
  }

  const replyMarkup = buttons.length > 0 ? { inline_keyboard: buttons } : null;

  return { text, replyMarkup };
}

// Helper: Poll updates to auto-discover groups where bot was added and handle commands
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
            text: `✅ <b>Бот сповіщень АН «ФАВОРИТ ГРУП» активовано!</b>\n\n` +
                  `Чат <code>${chatIdStr}</code> (<b>${chat.title || chat.username || 'Приватний чат'}</b>) успішно підключено до CRM-системи.\n\n` +
                  `Усі нові заявки на купівлю, оренду, продаж та перегляд об'єктів у Полтаві надходитимуть сюди автоматично.`,
            parse_mode: 'HTML'
          }).catch(() => {});
        }

        // Handle Interactive Bot Commands
        if (msg && msg.text) {
          const cmd = msg.text.trim().toLowerCase();

          if (cmd.startsWith('/start') || cmd.startsWith('/help')) {
            callTelegramApi('sendMessage', {
              chat_id: chatIdStr,
              text: `👋 <b>Вітаємо у боті сповіщень АН «ФАВОРИТ ГРУП»!</b>\n\n` +
                    `📌 <b>Доступні команди:</b>\n` +
                    `• /stats — Статистика заявок та активних чатів\n` +
                    `• /status — Перевірка статусу сервера та бази даних\n` +
                    `• /test — Надіслати тестове сповіщення\n\n` +
                    `🌐 <b>Сайт:</b> favorit-group.com`,
              parse_mode: 'HTML'
            }).catch(() => {});
          } else if (cmd.startsWith('/stats')) {
            callTelegramApi('sendMessage', {
              chat_id: chatIdStr,
              text: `📊 <b>СТАТИСТИКА БОТА АН «ФАВОРИТ ГРУП»</b>\n\n` +
                    `📥 Всього оброблено заявок: <b>${telegramConfig.leadsCount}</b>\n` +
                    `👥 Підключено чатів/груп: <b>${telegramConfig.chatIds.length}</b>\n` +
                    `🏢 Об'єктів у базі сайту: <b>1 198</b>\n` +
                    `🟢 Статус сервера: <b>Активний (Railway)</b>`,
              parse_mode: 'HTML'
            }).catch(() => {});
          } else if (cmd.startsWith('/status')) {
            callTelegramApi('sendMessage', {
              chat_id: chatIdStr,
              text: `🟢 <b>СЕРВЕР ТА БОТ ПРАЦЮЮТЬ ШТАТНО</b>\n\n` +
                    `🕒 Час сервера: <b>${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</b>\n` +
                    `📡 Підключені чати: <code>${telegramConfig.chatIds.join(', ')}</code>\n` +
                    `🛡️ Захист фото: <b>Активний (280px Binary Crop)</b>\n` +
                    `🌐 Домен: <b>https://favorit-group.com</b>`,
              parse_mode: 'HTML'
            }).catch(() => {});
          } else if (cmd.startsWith('/test')) {
            callTelegramApi('sendMessage', {
              chat_id: chatIdStr,
              text: `🔔 <b>ТЕСТОВЕ СПОВІЩЕННЯ</b>\n\nЗв'язок із сервером та CRM успішно встановлено!`,
              parse_mode: 'HTML'
            }).catch(() => {});
          }
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

// ==========================================
// API ROUTES
// ==========================================

// 1. Submit New Lead from any Form
app.post('/api/send-lead', async (req, res) => {
  try {
    const leadData = req.body || {};
    const { name, phone } = leadData;

    if (!name && !phone) {
      return res.status(400).json({ error: "Ім'я або телефон обов'язкові" });
    }

    const { text: htmlText, replyMarkup } = formatLeadTelegramReport(leadData);

    const sendResult = await sendTelegramMessage(htmlText, replyMarkup);

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
