export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '0';
  if (currency === 'USD') {
    return `$${amount.toLocaleString('uk-UA')}`;
  }
  return `${amount.toLocaleString('uk-UA')} грн`;
};

export const formatPricePerM2 = (amountUSD, currency = 'USD') => {
  if (!amountUSD) return '';
  if (currency === 'USD') {
    return `$${amountUSD}/м²`;
  }
  const uah = Math.round(amountUSD * 41.5);
  return `${uah.toLocaleString('uk-UA')} грн/м²`;
};

export const formatArea = (m2) => {
  if (!m2) return '';
  return `${m2} м²`;
};

export const formatPhoneInput = (val) => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  if (digits.startsWith('380')) {
    normalized = digits.slice(3);
  } else if (digits.startsWith('0')) {
    normalized = digits.slice(1);
  } else if (digits.startsWith('80')) {
    normalized = digits.slice(2);
  }

  normalized = normalized.slice(0, 9);

  let res = '+380';
  if (normalized.length > 0) res += ` (${normalized.slice(0, 2)}`;
  if (normalized.length >= 2) res += `) ${normalized.slice(2, 5)}`;
  if (normalized.length >= 5) res += `-${normalized.slice(5, 7)}`;
  if (normalized.length >= 7) res += `-${normalized.slice(7, 9)}`;

  return res;
};

export const validatePhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length < 10) {
    return 'Введіть коректний номер телефону (наприклад, +380 98 861 29 38)';
  }
  return null;
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Будь ласка, вкажіть ваше ім'я (мінімум 2 літери)";
  }
  return null;
};
