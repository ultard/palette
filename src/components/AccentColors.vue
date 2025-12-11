<template>
  <div class="accent-colors">
    <h3>Акцентные цвета</h3>
    <p class="description">Рекомендуемые акцентные цвета для вашей палитры</p>
    <div class="accent-palette">
      <ColorCard
        v-for="(color, index) in accentColors"
        :key="index"
        :color="color"
        :format="'hex'"
        :show-pin-button="false"
        @copy="handleCopy"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ColorCard from './ColorCard.vue';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/colorUtils';

const props = defineProps({
  colors: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['copy']);

const accentColors = computed(() => {
  if (props.colors.length === 0) return [];
  
  // Вычисляем средний цвет палитры
  const avgRgb = { r: 0, g: 0, b: 0 };
  props.colors.forEach((color) => {
    const rgb = hexToRgb(color);
    if (rgb) {
      avgRgb.r += rgb.r;
      avgRgb.g += rgb.g;
      avgRgb.b += rgb.b;
    }
  });
  
  const count = props.colors.length;
  avgRgb.r = Math.round(avgRgb.r / count);
  avgRgb.g = Math.round(avgRgb.g / count);
  avgRgb.b = Math.round(avgRgb.b / count);
  
  const avgHsl = rgbToHsl(avgRgb.r, avgRgb.g, avgRgb.b);
  
  // Генерируем акцентные цвета
  const accents = [];
  
  // Комплементарный цвет
  const compH = (avgHsl.h + 180) % 360;
  const compRgb = hslToRgb(compH, Math.min(80, avgHsl.s + 20), Math.max(40, Math.min(60, avgHsl.l)));
  accents.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
  
  // Триада
  const triad1H = (avgHsl.h + 120) % 360;
  const triad1Rgb = hslToRgb(triad1H, avgHsl.s, avgHsl.l);
  accents.push(rgbToHex(triad1Rgb.r, triad1Rgb.g, triad1Rgb.b));
  
  const triad2H = (avgHsl.h + 240) % 360;
  const triad2Rgb = hslToRgb(triad2H, avgHsl.s, avgHsl.l);
  accents.push(rgbToHex(triad2Rgb.r, triad2Rgb.g, triad2Rgb.b));
  
  // Аналогичные акценты
  const analog1H = (avgHsl.h + 30) % 360;
  const analog1Rgb = hslToRgb(analog1H, Math.min(90, avgHsl.s + 30), Math.max(50, avgHsl.l));
  accents.push(rgbToHex(analog1Rgb.r, analog1Rgb.g, analog1Rgb.b));
  
  const analog2H = (avgHsl.h - 30 + 360) % 360;
  const analog2Rgb = hslToRgb(analog2H, Math.min(90, avgHsl.s + 30), Math.max(50, avgHsl.l));
  accents.push(rgbToHex(analog2Rgb.r, analog2Rgb.g, analog2Rgb.b));
  
  return accents;
});

const handleCopy = (value) => {
  emit('copy', value);
};
</script>

<style scoped>
.accent-colors {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.accent-colors h3 {
  margin-bottom: 8px;
  color: #333;
}

.description {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.accent-palette {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>

