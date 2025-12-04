export interface RGBColor {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')}`
}

export function formatColor(hex: string, format: 'hex' | 'rgb'): string {
  if (format === 'rgb') {
    const rgb = hexToRgb(hex)
    return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex
  }
  return hex.toUpperCase()
}