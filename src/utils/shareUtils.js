// Утилиты для создания шаринговых ссылок

/**
 * Безопасное кодирование строки в base64 для URL
 */
function encodeBase64Url(str) {
  try {
    // Используем encodeURIComponent для безопасной передачи в URL
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Encoding error:', error);
    return btoa(str);
  }
}

/**
 * Безопасное декодирование base64 из URL
 */
function decodeBase64Url(encoded) {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch (error) {
    console.error('Decoding error:', error);
    return atob(encoded);
  }
}

/**
 * Создание шаринговой ссылки на палитру
 */
export function createShareableLink(colors, name = '') {
  if (!colors || colors.length === 0) {
    console.error('Cannot create shareable link: colors array is empty');
    return '';
  }
  
  try {
    const data = JSON.stringify({ colors, name });
    const encoded = encodeBase64Url(data);
    // Получаем base path из env или используем текущий путь
    const basePath = import.meta.env.BASE_URL || '/';
    // Убираем trailing slash если он есть, кроме корня
    const cleanBasePath = basePath === '/' ? '/' : basePath.replace(/\/$/, '');
    const baseUrl = window.location.origin + cleanBasePath;
    return `${baseUrl}?palette=${encodeURIComponent(encoded)}`;
  } catch (error) {
    console.error('Failed to create shareable link:', error);
    return '';
  }
}

/**
 * Декодирование палитры из URL
 */
export function decodeShareableLink() {
  try {
    const params = new URLSearchParams(window.location.search);
    const encodedParam = params.get('palette');
    
    if (!encodedParam) return null;
    
    // Декодируем из URL
    const encoded = decodeURIComponent(encodedParam);
    
    // Декодируем base64
    const decoded = decodeBase64Url(encoded);
    
    // Парсим JSON
    const palette = JSON.parse(decoded);
    
    // Валидация данных
    if (!palette || !Array.isArray(palette.colors) || palette.colors.length === 0) {
      console.error('Invalid palette data');
      return null;
    }
    
    return palette;
  } catch (error) {
    console.error('Failed to decode palette:', error);
    return null;
  }
}

