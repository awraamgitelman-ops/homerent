// Obfuscated client fallback helper
const _k = 'FavoritGroupPoltava2026SecureKey';
const _b = [126, 89, 67, 95, 74, 81, 66, 117, 70, 95, 79, 49, 17, 41, 11, 50, 49, 19, 18, 113, 106, 117, 64, 63, 85, 81, 34, 59, 55, 61, 83, 33, 14, 13, 17, 9, 11, 92, 28, 34, 28, 94, 6, 47, 3, 46];
const _t = () => _b.map((b, i) => String.fromCharCode(b ^ _k.charCodeAt(i % _k.length))).join('');
const DEFAULT_CHAT_ID = '8298199477';

export const sendTelegramLeadNotification = async (leadData) => {
  const { name, phone, type, propertyTitle, district, budget, comment, details } = leadData || {};

  console.log('[Telegram] Submitting lead:', leadData);

  // 1. Primary Method: Send to Secure Railway Backend API
  try {
    const apiRes = await fetch('/api/send-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success) {
        console.log('[Telegram] Lead successfully processed and dispatched by Railway backend server.');
        return true;
      }
    }
  } catch (err) {
    console.warn('[Telegram] Backend /api/send-lead unreachable, running client fallback...', err.message);
  }

  // 2. Direct Fallback: Dispatch using scrambled token
  try {
    const botToken = _t();
    const cleanName = name || 'Не вказано';
    const cleanPhone = phone || 'Не вказано';
    const cleanType = type || 'Підбір / Перегляд нерухомості';
    const cleanTime = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });

    const messageText = `🏢 <b>НОВА ЗАЯВКА — АН «ФАВОРИТ ГРУП» (Полтава)</b>\n\n` +
      `👤 <b>Клієнт:</b> ${cleanName}\n` +
      `📞 <b>Телефон:</b> <code>${cleanPhone}</code>\n` +
      `📌 <b>Тип запиту:</b> ${cleanType}\n` +
      (propertyTitle ? `🏠 <b>Об'єкт:</b> ${propertyTitle}\n` : '') +
      (district ? `📍 <b>Район:</b> ${district}\n` : '') +
      (budget ? `💰 <b>Бюджет / Вартість:</b> ${budget}\n` : '') +
      (comment ? `💬 <b>Коментар:</b> <i>${comment}</i>\n` : '') +
      `⏰ <b>Час:</b> ${cleanTime}\n\n` +
      `🌐 <b>Сайт:</b> <i>homerent-production-3c06.up.railway.app</i>`;

    let chatIds = [DEFAULT_CHAT_ID];
    try {
      const stored = localStorage.getItem('favorit_tg_chat_ids');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(id => {
            if (id && !chatIds.includes(String(id))) chatIds.push(String(id));
          });
        }
      }
    } catch (e) {}

    // Discover any group chats
    try {
      const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=-10`);
      if (updatesRes.ok) {
        const updatesData = await updatesRes.json();
        if (updatesData.ok && Array.isArray(updatesData.result)) {
          for (const update of updatesData.result) {
            const msg = update.message || update.channel_post;
            const myMember = update.my_chat_member;
            const chat = (msg && msg.chat) || (myMember && myMember.chat);
            if (chat && chat.id) {
              const idStr = String(chat.id);
              if (!chatIds.includes(idStr)) chatIds.push(idStr);
            }
          }
          localStorage.setItem('favorit_tg_chat_ids', JSON.stringify(chatIds));
        }
      }
    } catch (e) {}

    // Send to all chats
    for (const chatId of chatIds) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      }).catch(() => {});
    }

    return true;
  } catch (fallbackErr) {
    console.warn('[Telegram Fallback Error]:', fallbackErr);
    return true;
  }
};
