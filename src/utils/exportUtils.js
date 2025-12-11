// Утилиты для экспорта палитр

/**
 * Экспорт в CSS переменные
 */
export function exportToCSSVariables(colors, paletteName = 'palette') {
  let css = `/* ${paletteName} */\n:root {\n`;
  colors.forEach((color, index) => {
    css += `  --color-${paletteName}-${index + 1}: ${color};\n`;
  });
  css += '}\n';
  return css;
}

/**
 * Экспорт в SCSS переменные
 */
export function exportToSCSSVariables(colors, paletteName = 'palette') {
  let scss = `// ${paletteName}\n`;
  colors.forEach((color, index) => {
    scss += `$color-${paletteName}-${index + 1}: ${color};\n`;
  });
  return scss;
}

/**
 * Экспорт в Tailwind config
 */
export function exportToTailwindConfig(colors, paletteName = 'palette') {
  let config = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${paletteName}': {\n`;
  colors.forEach((color, index) => {
    config += `          ${index + 1}: '${color}',\n`;
  });
  config += `        },\n      },\n    },\n  },\n};\n`;
  return config;
}

/**
 * Экспорт готового CSS кода
 */
export function exportToCSSCode(colors, paletteName = 'palette') {
  let css = `/* ${paletteName} Color Palette */\n\n`;
  colors.forEach((color, index) => {
    css += `.${paletteName}-color-${index + 1} {\n  color: ${color};\n}\n\n`;
    css += `.${paletteName}-bg-${index + 1} {\n  background-color: ${color};\n}\n\n`;
  });
  return css;
}

