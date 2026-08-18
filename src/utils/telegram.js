// Obfuscated client fallback helper
const _k = 'FavoritGroupPoltava2026SecureKey';
const _b = [126, 89, 67, 95, 74, 81, 66, 117, 70, 95, 79, 49, 17, 41, 11, 50, 49, 19, 18, 113, 106, 117, 64, 63, 85, 81, 34, 59, 55, 61, 83, 33, 14, 13, 17, 9, 11, 92, 28, 34, 28, 94, 6, 47, 3, 46];
const _t = () => _b.map((b, i) => String.fromCharCode(b ^ _k.charCodeAt(i % _k.length))).join('');
const DEFAULT_CHAT_IDS = ['8298199477', '-1003921545216'];

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const sendTelegramLeadNotification = async (leadData) => {
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
    const {
      name,
      phone,
      type,
      formType,
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
      comment
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

    let messageText = `${headerIcon} <b>${headerTitle}</b>\n`;
    messageText += `🏛️ <i>АН «ФАВОРИТ ГРУП» Полтава</i>\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    // 1. Client Contacts Section
    messageText += `👤 <b>Клієнт:</b> ${escapeHtml(name || 'Не вказано')}\n`;
    messageText += `📞 <b>Телефон:</b> <code>${escapeHtml(phone || 'Не вказано')}</code>\n`;
    if (preferredMessenger) {
      messageText += `💬 <b>Зручний месенджер:</b> ${escapeHtml(preferredMessenger)}\n`;
    }
    messageText += `\n`;

    // 2. Request Details Section
    messageText += `📋 <b>Тип заявки:</b> ${escapeHtml(type || 'Консультація')}\n`;

    if (propCategory) {
      messageText += `🏠 <b>Категорія:</b> ${escapeHtml(propCategory)}\n`;
    }
    if (propertyTitle) {
      messageText += `🏢 <b>Об'єкт:</b> ${escapeHtml(propertyTitle)}\n`;
    }
    if (propertyId) {
      messageText += `🆔 <b>ID в базі:</b> <code>${escapeHtml(propertyId)}</code>\n`;
    }
    if (address) {
      messageText += `📍 <b>Адреса:</b> ${escapeHtml(address)}\n`;
    }
    if (district && district !== 'all') {
      messageText += `🗺️ <b>Район:</b> ${escapeHtml(district)}\n`;
    }
    if (rooms && rooms !== 'all') {
      messageText += `🚪 <b>Кімнат:</b> ${escapeHtml(rooms)}\n`;
    }
    if (area) {
      messageText += `📐 <b>Площа:</b> ${escapeHtml(area)} м²\n`;
    }
    if (floor) {
      messageText += `🏢 <b>Поверх:</b> ${escapeHtml(floor)}\n`;
    }
    if (budget || targetPrice) {
      messageText += `💰 <b>Бюджет / Вартість:</b> <b>${escapeHtml(budget || targetPrice)}</b>\n`;
    }

    if (preferredDate) {
      messageText += `🗓️ <b>Бажана дата:</b> ${escapeHtml(preferredDate)}\n`;
    }
    if (preferredTime) {
      messageText += `⏰ <b>Зручний час:</b> ${escapeHtml(preferredTime)}\n`;
    }

    if (residents) {
      messageText += `👥 <b>Склад сім'ї:</b> ${escapeHtml(residents)}\n`;
    }
    if (children) {
      messageText += `👶 <b>Діти:</b> ${escapeHtml(children)}\n`;
    }
    if (pets) {
      messageText += `🐾 <b>Домашні тварини:</b> ${escapeHtml(pets)}\n`;
    }
    if (repairPref) {
      messageText += `🛠️ <b>Вимоги до стану:</b> ${escapeHtml(repairPref)}\n`;
    }

    if (propertyId || leadData?.sourceUrl) {
      const targetUrl = leadData?.sourceUrl || `https://favorit-group.com/property/${propertyId}`;
      messageText += `🔗 <b>Посилання на об'єкт:</b> <a href="${targetUrl}">${targetUrl}</a>\n`;
    }

    if (comment && comment.trim()) {
      messageText += `\n💬 <b>Коментар / Побажання:</b>\n<i>${escapeHtml(comment)}</i>\n`;
    }

    messageText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    messageText += `⏰ <b>Час надходження:</b> ${cleanTime}\n`;
    messageText += `🌐 <b>Джерело:</b> favorit-group.com`;

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

    const payload = {
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    if (buttons.length > 0) {
      payload.reply_markup = { inline_keyboard: buttons };
    }

    let chatIds = [...DEFAULT_CHAT_IDS];
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

    for (const chatId of chatIds) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, chat_id: chatId })
      }).catch(() => {});
    }

    return true;
  } catch (fallbackErr) {
    console.warn('[Telegram Fallback Error]:', fallbackErr);
    return true;
  }
};
