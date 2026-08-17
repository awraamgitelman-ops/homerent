// Telegram Bot Notification Dispatcher for Favorit Group Real Estate Leads
const BOT_TOKENS = [
  '8986924734:AAE5TIbbb7BFEgWfyaHFov2aoKDA52UIBo8',
  '8855934222:AAE7urD82jvaYIf8cJddxnesQwuKVRyw4lY'
];
const DEFAULT_CHAT_ID = '8298199477';

export const sendTelegramLeadNotification = async (leadData) => {
  const { name, phone, type, propertyTitle, district, budget, comment, details } = leadData || {};

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
    (budget ? `💰 <b>Бюджет:</b> ${budget}\n` : '') +
    (comment ? `💬 <b>Коментар:</b> <i>${comment}</i>\n` : '') +
    `⏰ <b>Час:</b> ${cleanTime}\n\n` +
    `🌐 <b>Сайт:</b> <i>homerent-production-3c06.up.railway.app</i>`;

  console.log('[Telegram] Dispatching lead:', leadData);

  for (const botToken of BOT_TOKENS) {
    if (!botToken) continue;

    try {
      // 1. Get stored chat IDs or fallback
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

      // 2. Poll getUpdates to discover any newly joined group chats, channels, or admin chats
      try {
        const updatesRes = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=-20&limit=50`);
        if (updatesRes.ok) {
          const updatesData = await updatesRes.json();
          if (updatesData.ok && Array.isArray(updatesData.result)) {
            for (const update of updatesData.result) {
              const msg = update.message || update.channel_post || update.edited_message || update.edited_channel_post;
              const myMember = update.my_chat_member || update.chat_member;
              const chat = (msg && msg.chat) || (myMember && myMember.chat);
              if (chat && chat.id) {
                const idStr = String(chat.id);
                if (!chatIds.includes(idStr)) chatIds.push(idStr);
              }
            }
            try {
              localStorage.setItem('favorit_tg_chat_ids', JSON.stringify(chatIds));
            } catch (e) {}
          }
        }
      } catch (e) {}

      // 3. Send message to all discovered chat IDs
      let successCount = 0;
      for (const chatId of chatIds) {
        try {
          const sendRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: messageText,
              parse_mode: 'HTML',
              disable_web_page_preview: true
            })
          });

          if (sendRes.ok) {
            successCount++;
          }
        } catch (sendErr) {
          console.warn(`[Telegram] Failed to send to chat ${chatId}:`, sendErr);
        }
      }

      if (successCount > 0) {
        console.log(`[Telegram] Notification successfully delivered to ${successCount} chat(s) via bot token ${botToken.substring(0, 10)}...`);
        return true;
      }
    } catch (botErr) {
      console.warn(`[Telegram] Error with token ${botToken.substring(0, 10)}...:`, botErr);
    }
  }

  return true;
};
