<template>
  <div class="color-wheel-container">
    <h3>Цветовой круг</h3>
    <div class="color-wheel-wrapper">
      <canvas
        ref="canvasRef"
        :width="size"
        :height="size"
        class="color-wheel"
        @click="handleClick"
        @mousemove="handleMouseMove"
      ></canvas>
      <div
        v-if="selectedPoint"
        class="selected-point"
        :style="{
          left: selectedPoint.x + 'px',
          top: selectedPoint.y + 'px',
        }"
      ></div>
    </div>
    <div v-if="selectedColor" class="selected-color-info">
      <div
        class="color-preview"
        :style="{ backgroundColor: selectedColor }"
      ></div>
      <div class="color-details">
        <div>HEX: {{ selectedColor }}</div>
        <div v-if="selectedHsl">
          HSL: {{ selectedHsl.h }}°, {{ selectedHsl.s }}%, {{ selectedHsl.l }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { rgbToHex, hslToRgb, rgbToHsl } from '../utils/colorUtils';

const props = defineProps({
  size: {
    type: Number,
    default: 300,
  },
});

const emit = defineEmits(['color-selected']);

const canvasRef = ref(null);
const selectedPoint = ref(null);
const selectedColor = ref(null);
const selectedHsl = ref(null);

const drawColorWheel = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = props.size / 2;
  const centerY = props.size / 2;
  const radius = props.size / 2 - 10;

  // Очищаем canvas
  ctx.clearRect(0, 0, props.size, props.size);

  // Рисуем цветовой круг
  const imageData = ctx.createImageData(props.size, props.size);
  const data = imageData.data;

  for (let y = 0; y < props.size; y++) {
    for (let x = 0; x < props.size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const index = (y * props.size + x) * 4;

      if (distance <= radius) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
        const hue = angle;
        const saturation = (distance / radius) * 100;
        const lightness = 50;

        const rgb = hslToRgb(hue, saturation, lightness);
        data[index] = rgb.r;
        data[index + 1] = rgb.g;
        data[index + 2] = rgb.b;
        data[index + 3] = 255;
      } else {
        data[index + 3] = 0; // Прозрачный
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const getColorAtPoint = (x, y) => {
  const canvas = canvasRef.value;
  if (!canvas) return null;

  const centerX = props.size / 2;
  const centerY = props.size / 2;
  const radius = props.size / 2 - 10;

  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius) return null;

  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
  const hue = angle;
  const saturation = (distance / radius) * 100;
  const lightness = 50;

  const rgb = hslToRgb(hue, saturation, lightness);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    hsl: { h: Math.round(hue), s: Math.round(saturation), l: Math.round(lightness) },
  };
};

const handleClick = (event) => {
  const rect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const color = getColorAtPoint(x, y);
  if (color) {
    selectedPoint.value = { x: x - 5, y: y - 5 };
    selectedColor.value = color.hex;
    selectedHsl.value = color.hsl;
    emit('color-selected', color.hex);
  }
};

const handleMouseMove = (event) => {
  const rect = canvasRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const color = getColorAtPoint(x, y);
  if (color) {
    selectedPoint.value = { x: x - 5, y: y - 5 };
    selectedColor.value = color.hex;
    selectedHsl.value = color.hsl;
  }
};

onMounted(() => {
  drawColorWheel();
});

watch(() => props.size, () => {
  drawColorWheel();
});
</script>

<style scoped>
.color-wheel-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-wheel-container h3 {
  margin-bottom: 20px;
  color: #333;
}

.color-wheel-wrapper {
  position: relative;
  display: inline-block;
}

.color-wheel {
  border-radius: 50%;
  cursor: crosshair;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.selected-point {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.selected-color-info {
  margin-top: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-details {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  color: #333;
}

.color-details div {
  margin-bottom: 4px;
}
</style>

