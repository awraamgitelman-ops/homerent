/**
 * Corporate Media Protection & Obfuscation Module
 * АН «ФАВОРИТ ГРУП» Полтава
 */

const _ENC_KEY = 'FavoritGroupPoltava2026MediaKey';

export function encryptMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('/api/media/')) return url;
  
  let xored = '';
  for (let i = 0; i < url.length; i++) {
    xored += String.fromCharCode(url.charCodeAt(i) ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length));
  }
  
  // Safe base64url encoding
  const b64 = typeof window !== 'undefined'
    ? btoa(xored).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : Buffer.from(xored, 'binary').toString('base64url');
    
  return `/api/media/FG_${b64}`;
}

export function decryptMediaUrl(token) {
  if (!token || typeof token !== 'string') return '';
  const clean = token.replace(/^\/api\/media\//, '');
  if (!clean.startsWith('FG_')) return clean;
  
  const b64 = clean.slice(3).replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  
  let binary = '';
  if (typeof window !== 'undefined') {
    try {
      binary = atob(b64 + pad);
    } catch {
      return '';
    }
  } else {
    binary = Buffer.from(b64 + pad, 'base64').toString('binary');
  }
  
  let url = '';
  for (let i = 0; i < binary.length; i++) {
    url += String.fromCharCode(binary.charCodeAt(i) ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length));
  }
  return url;
}
