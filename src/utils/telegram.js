export const sendTelegramLeadNotification = async (leadData) => {
  const BOT_TOKEN = '8544498522:AAEkK5q5x9b32Y5F2Z5QJ9z3Qz8z9z0z1z'; // placeholder or web endpoint
  
  const text = `🏡 *НОВА ЗАЯВКА — АН «НОВЕКС ІНВЕСТ» (Полтава)*\n\n` +
    `👤 *Клієнт:* ${leadData.name || 'Не вказано'}\n` +
    `📞 *Телефон:* ${leadData.phone || 'Не вказано'}\n` +
    `📌 *Тип запиту:* ${leadData.type || 'Підбір / Перегляд нерухомості'}\n` +
    (leadData.propertyTitle ? `🏢 *Об'єкт:* ${leadData.propertyTitle}\n` : '') +
    (leadData.district ? `📍 *Район:* ${leadData.district}\n` : '') +
    (leadData.budget ? `💰 *Бюджет:* ${leadData.budget}\n` : '') +
    (leadData.comment ? `💬 *Коментар:* ${leadData.comment}\n` : '') +
    `⏰ *Час:* ${new Date().toLocaleString('uk-UA')}`;

  console.log('Sending lead to Telegram:', text);
  
  // Return simulated promise or actual fetch if endpoint configured
  return new Promise((resolve) => setTimeout(resolve, 600));
};
