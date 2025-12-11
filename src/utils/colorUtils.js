// Утилиты для работы с цветами

/**
 * Конвертация HEX в RGB
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Конвертация RGB в HEX
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Конвертация RGB в HSL
 */
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Конвертация HSL в RGB
 */
export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Генерация случайного цвета
 */
export function generateRandomColor() {
  return rgbToHex(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  );
}

/**
 * Генерация гармоничной палитры (аналогичная)
 */
export function generateAnalogousPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  const step = 30; // шаг в градусах для аналогичных цветов
  
  for (let i = 0; i < count; i++) {
    const newH = (hsl.h + (i - Math.floor(count / 2)) * step + 360) % 360;
    const newRgb = hslToRgb(newH, hsl.s, hsl.l);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерация монохромной палитры
 */
export function generateMonochromaticPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  const lightnessStep = 80 / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const newL = Math.max(10, Math.min(90, 20 + i * lightnessStep));
    const newRgb = hslToRgb(hsl.h, hsl.s, newL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors;
}

/**
 * Генерация триады
 */
export function generateTriadPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [baseColor];
  
  // Три основных цвета триады
  const h1 = (hsl.h + 120) % 360;
  const h2 = (hsl.h + 240) % 360;
  
  const rgb1 = hslToRgb(h1, hsl.s, hsl.l);
  const rgb2 = hslToRgb(h2, hsl.s, hsl.l);
  
  colors.push(rgbToHex(rgb1.r, rgb1.g, rgb1.b));
  colors.push(rgbToHex(rgb2.r, rgb2.g, rgb2.b));
  
  // Добавляем вариации
  while (colors.length < count) {
    const randomH = (hsl.h + Math.random() * 360) % 360;
    const randomS = Math.max(30, Math.min(80, hsl.s + (Math.random() - 0.5) * 20));
    const randomL = Math.max(30, Math.min(70, hsl.l + (Math.random() - 0.5) * 20));
    const newRgb = hslToRgb(randomH, randomS, randomL);
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors.slice(0, count);
}

/**
 * Генерация комплементарной палитры
 */
export function generateComplementaryPalette(baseColor, count = 5) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [baseColor];
  
  // Комплементарный цвет
  const compH = (hsl.h + 180) % 360;
  const compRgb = hslToRgb(compH, hsl.s, hsl.l);
  colors.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
  
  // Добавляем промежуточные цвета
  while (colors.length < count) {
    const offset = (colors.length - 1) * (180 / (count - 1));
    const newH = (hsl.h + offset) % 360;
    const newRgb = hslToRgb(newH, Math.max(40, hsl.s), Math.max(40, Math.min(60, hsl.l)));
    colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }
  
  return colors.slice(0, count);
}

/**
 * Генерация палитры по настроению
 */
export function generateMoodPalette(mood, count = 5) {
  const moods = {
    calm: { h: 200, s: 40, l: 50 },
    energetic: { h: 10, s: 80, l: 55 },
    professional: { h: 220, s: 30, l: 45 },
    warm: { h: 30, s: 60, l: 55 },
    cool: { h: 200, s: 50, l: 50 },
    vibrant: { h: 300, s: 90, l: 50 },
  };
  
  const base = moods[mood] || moods.calm;
  const colors = [];
  
  for (let i = 0; i < count; i++) {
    const h = (base.h + i * 30) % 360;
    const s = Math.max(20, Math.min(90, base.s + (Math.random() - 0.5) * 20));
    const l = Math.max(30, Math.min(70, base.l + (Math.random() - 0.5) * 20));
    const rgb = hslToRgb(h, s, l);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

/**
 * Вычисление относительной яркости (для WCAG)
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Вычисление контрастности между двумя цветами
 */
export function getContrast(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Проверка соответствия WCAG
 */
export function checkWCAG(color1, color2) {
  const contrast = getContrast(color1, color2);
  return {
    contrast: Math.round(contrast * 100) / 100,
    AA: contrast >= 4.5,
    AALarge: contrast >= 3,
    AAA: contrast >= 7,
    AAALarge: contrast >= 4.5,
  };
}

/**
 * Генерация случайной гармоничной палитры
 */
export function generateRandomHarmoniousPalette(count = 5) {
  const baseHue = Math.floor(Math.random() * 360);
  const baseSaturation = 40 + Math.random() * 40;
  const baseLightness = 40 + Math.random() * 30;
  
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * 30 + Math.random() * 20 - 10) % 360;
    const saturation = Math.max(30, Math.min(80, baseSaturation + (Math.random() - 0.5) * 20));
    const lightness = Math.max(30, Math.min(70, baseLightness + (Math.random() - 0.5) * 20));
    const rgb = hslToRgb(hue, saturation, lightness);
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b));
  }
  
  return colors;
}

