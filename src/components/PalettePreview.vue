<template>
  <div class="palette-preview" :class="{ 'dark-bg': isDarkBackground }">
    <div class="preview-controls">
      <button @click="toggleBackground" class="toggle-btn">
        {{ isDarkBackground ? '☀️ Светлый фон' : '🌙 Тёмный фон' }}
      </button>
    </div>
    <div class="preview-content">
      <div class="preview-card" :style="{ backgroundColor: colors[0] || '#fff' }">
        <h2 class="preview-heading" :style="{ color: colors[1] || '#000' }">
          Заголовок
        </h2>
        <p class="preview-text" :style="{ color: colors[2] || '#333' }">
          Пример текста для демонстрации палитры
        </p>
        <button class="preview-button" :style="{ 
          backgroundColor: colors[3] || '#007bff',
          color: getContrastColor(colors[3] || '#007bff')
        }">
          Кнопка
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { hexToRgb } from '../utils/colorUtils';

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
});

const isDarkBackground = ref(false);

const toggleBackground = () => {
  isDarkBackground.value = !isDarkBackground.value;
};

const getContrastColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000';
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000' : '#fff';
};
</script>

<style scoped>
.palette-preview {
  padding: 24px;
  border-radius: 12px;
  background: #f5f5f5;
  transition: background 0.3s;
}

.palette-preview.dark-bg {
  background: #1a1a1a;
}

.preview-controls {
  margin-bottom: 16px;
}

.toggle-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #f0f0f0;
}

.preview-content {
  display: flex;
  justify-content: center;
}

.preview-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-heading {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}

.preview-text {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.preview-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.preview-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>

