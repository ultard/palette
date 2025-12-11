<template>
  <div class="generator-view">
    <div class="header">
      <h1>Генератор палитр</h1>
      <p>Создавайте гармоничные цветовые палитры</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" @change="generatePalette">
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="7">7</option>
        </select>
      </div>

      <div class="control-group">
        <label>Формат отображения:</label>
        <select v-model="displayFormat">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>

      <button class="generate-btn" @click="generatePalette">
        🎨 Случайная палитра
      </button>
      <button class="share-btn" @click="createShareLink" v-if="currentPalette.length > 0">
        🔗 Поделиться
      </button>
    </div>

    <div class="palette-container">
      <ColorCard
        v-for="(color, index) in currentPalette"
        :key="`${color}-${index}`"
        :color="color"
        :format="displayFormat"
        :is-pinned="pinnedColors.includes(color)"
        @toggle-pin="togglePinColor"
        @copy="handleCopy"
      />
    </div>

    <PalettePreview :colors="currentPalette" />

    <div class="notification" v-if="showNotification">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ColorCard from '../components/ColorCard.vue';
import PalettePreview from '../components/PalettePreview.vue';
import { generateRandomHarmoniousPalette } from '../utils/colorUtils';
import { storage } from '../utils/storage';
import { decodeShareableLink, createShareableLink } from '../utils/shareUtils';
import { useRoute } from 'vue-router';

const route = useRoute();
const colorCount = ref(5);
const displayFormat = ref('hex');
const currentPalette = ref([]);
const pinnedColors = ref([]);
const paletteName = ref('');
const showNotification = ref(false);
const notificationMessage = ref('');

const generatePalette = () => {
  const newColors = generateRandomHarmoniousPalette(colorCount.value);
  
  // Сохраняем закреплённые цвета
  const pinned = pinnedColors.value;
  const unpinnedCount = colorCount.value - pinned.length;
  
  if (unpinnedCount > 0) {
    const unpinnedColors = generateRandomHarmoniousPalette(unpinnedCount);
    currentPalette.value = [...pinned, ...unpinnedColors].slice(0, colorCount.value);
  } else {
    currentPalette.value = pinned.slice(0, colorCount.value);
  }
  
  savePalette();
};

const togglePinColor = (color) => {
  const index = pinnedColors.value.indexOf(color);
  if (index > -1) {
    pinnedColors.value.splice(index, 1);
  } else {
    pinnedColors.value.push(color);
  }
  savePalette();
};

const handleCopy = (value) => {
  notificationMessage.value = `Скопировано: ${value}`;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
};

const createShareLink = async () => {
  if (!currentPalette.value || currentPalette.value.length === 0) {
    notificationMessage.value = 'Сначала создайте палитру!';
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
    return;
  }
  
  const currentPath = route.path;
  const link = createShareableLink(currentPalette.value, paletteName.value || 'palette', currentPath);
  if (link) {
    try {
      await navigator.clipboard.writeText(link);
      notificationMessage.value = 'Ссылка скопирована в буфер обмена!';
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      notificationMessage.value = 'Ссылка создана, но не скопирована';
      showNotification.value = true;
      setTimeout(() => {
        showNotification.value = false;
      }, 2000);
    }
  }
};

const savePalette = () => {
  storage.save('currentPalette', currentPalette.value);
  storage.save('pinnedColors', pinnedColors.value);
  storage.save('colorCount', colorCount.value);
  storage.save('displayFormat', displayFormat.value);
};

const loadPalette = () => {
  // Проверяем наличие шаринговой ссылки
  const sharedPalette = decodeShareableLink();
  if (sharedPalette && sharedPalette.colors) {
    currentPalette.value = sharedPalette.colors;
    if (sharedPalette.name) {
      paletteName.value = sharedPalette.name;
    }
    // Очищаем URL от query параметров, но сохраняем путь
    const currentPath = route.path;
    const basePath = import.meta.env.BASE_URL || '/';
    const cleanPath = currentPath.startsWith(basePath) 
      ? currentPath 
      : basePath + currentPath.replace(/^\//, '');
    window.history.replaceState({}, document.title, cleanPath);
  } else {
    currentPalette.value = storage.load('currentPalette', []);
    pinnedColors.value = storage.load('pinnedColors', []);
    colorCount.value = storage.load('colorCount', 5);
    displayFormat.value = storage.load('displayFormat', 'hex');
    
    if (currentPalette.value.length === 0) {
      generatePalette();
    }
  }
};

onMounted(() => {
  loadPalette();
});
</script>

<style scoped>
.generator-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 36px;
  margin-bottom: 8px;
  color: #333;
}

.header p {
  font-size: 18px;
  color: #666;
}

.controls {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.control-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.generate-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  align-self: flex-end;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.share-btn {
  padding: 12px 24px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  align-self: flex-end;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.palette-container {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>

