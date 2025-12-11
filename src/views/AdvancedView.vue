<template>
  <div class="advanced-view">
    <div class="header">
      <h1>Продвинутая генерация</h1>
      <p>Создавайте палитры на основе различных алгоритмов</p>
    </div>

    <div class="generation-section">
      <h2>Тип генерации</h2>
      <div class="generation-options">
        <div class="option-group">
          <label>Базовый цвет:</label>
          <input type="color" v-model="baseColor" />
          <span class="color-value">{{ baseColor }}</span>
        </div>

        <div class="option-group">
          <label>Тип палитры:</label>
          <select v-model="paletteType">
            <option value="analogous">Аналогичная</option>
            <option value="monochromatic">Монохромная</option>
            <option value="triad">Триада</option>
            <option value="complementary">Комплементарная</option>
            <option value="mood">По настроению</option>
          </select>
        </div>

        <div class="option-group" v-if="paletteType === 'mood'">
          <label>Настроение:</label>
          <select v-model="mood">
            <option value="calm">Спокойное</option>
            <option value="energetic">Энергичное</option>
            <option value="professional">Профессиональное</option>
            <option value="warm">Тёплое</option>
            <option value="cool">Холодное</option>
            <option value="vibrant">Яркое</option>
          </select>
        </div>

        <div class="option-group">
          <label>Количество цветов:</label>
          <input type="number" v-model.number="colorCount" min="3" max="10" />
        </div>

        <button class="generate-btn" @click="generateAdvancedPalette">
          Генерировать
        </button>
      </div>
    </div>

    <div class="palette-container">
      <ColorCard
        v-for="(color, index) in currentPalette"
        :key="`${color}-${index}`"
        :color="color"
        :format="displayFormat"
        @copy="handleCopy"
      />
    </div>

    <div class="tools-section">
      <div class="tool-panel">
        <h3>Формат отображения</h3>
        <select v-model="displayFormat">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>

      <div class="tool-panel">
        <h3>Проверка контрастности</h3>
        <ContrastChecker :colors="currentPalette" />
      </div>

      <div class="tool-panel">
        <AccentColors :colors="currentPalette" @copy="handleCopy" />
      </div>

      <div class="tool-panel">
        <h3>Экспорт палитры</h3>
        <div class="export-options">
          <input
            v-model="paletteName"
            placeholder="Название палитры"
            class="name-input"
          />
          <div class="export-buttons">
            <button @click="exportCSS" class="export-btn">CSS Variables</button>
            <button @click="exportSCSS" class="export-btn">SCSS Variables</button>
            <button @click="exportTailwind" class="export-btn">Tailwind Config</button>
            <button @click="exportCSSCode" class="export-btn">CSS Code</button>
          </div>
          <div v-if="exportedCode" class="export-result">
            <textarea v-model="exportedCode" readonly></textarea>
            <button @click="copyExportedCode" class="copy-btn">Копировать</button>
          </div>
        </div>
      </div>

      <div class="tool-panel">
        <h3>Поделиться палитрой</h3>
        <div class="share-options">
          <button @click="createShareLink" class="share-btn">
            🔗 Создать ссылку
          </button>
          <div v-if="shareLink" class="share-link-result">
            <input
              v-model="shareLink"
              readonly
              class="share-link-input"
              @click="$event.target.select()"
            />
            <div class="share-link-actions">
              <button @click="copyShareLink" class="copy-btn">Копировать ссылку</button>
              <button @click="testShareLink" class="test-btn">Открыть в новой вкладке</button>
            </div>
          </div>
        </div>
      </div>

    <ColorWheel @color-selected="baseColor = $event" />

      <div class="tool-panel">
        <h3>Превью</h3>
        <PalettePreview :colors="currentPalette" />
      </div>
    </div>

    <div class="notification" v-if="showNotification">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ColorCard from '../components/ColorCard.vue';
import PalettePreview from '../components/PalettePreview.vue';
import ContrastChecker from '../components/ContrastChecker.vue';
import ColorWheel from '../components/ColorWheel.vue';
import AccentColors from '../components/AccentColors.vue';
import {
  generateAnalogousPalette,
  generateMonochromaticPalette,
  generateTriadPalette,
  generateComplementaryPalette,
  generateMoodPalette,
} from '../utils/colorUtils';
import {
  exportToCSSVariables,
  exportToSCSSVariables,
  exportToTailwindConfig,
  exportToCSSCode,
} from '../utils/exportUtils';
import { createShareableLink, decodeShareableLink } from '../utils/shareUtils';
import { useRoute } from 'vue-router';

const route = useRoute();
const baseColor = ref('#667eea');
const paletteType = ref('analogous');
const mood = ref('calm');
const colorCount = ref(5);
const displayFormat = ref('hex');
const currentPalette = ref([]);
const paletteName = ref('my-palette');
const exportedCode = ref('');
const shareLink = ref('');
const showNotification = ref(false);
const notificationMessage = ref('');

const generateAdvancedPalette = () => {
  let colors = [];
  
  switch (paletteType.value) {
    case 'analogous':
      colors = generateAnalogousPalette(baseColor.value, colorCount.value);
      break;
    case 'monochromatic':
      colors = generateMonochromaticPalette(baseColor.value, colorCount.value);
      break;
    case 'triad':
      colors = generateTriadPalette(baseColor.value, colorCount.value);
      break;
    case 'complementary':
      colors = generateComplementaryPalette(baseColor.value, colorCount.value);
      break;
    case 'mood':
      colors = generateMoodPalette(mood.value, colorCount.value);
      break;
    default:
      colors = generateAnalogousPalette(baseColor.value, colorCount.value);
  }
  
  currentPalette.value = colors;
};

const exportCSS = () => {
  exportedCode.value = exportToCSSVariables(currentPalette.value, paletteName.value);
};

const exportSCSS = () => {
  exportedCode.value = exportToSCSSVariables(currentPalette.value, paletteName.value);
};

const exportTailwind = () => {
  exportedCode.value = exportToTailwindConfig(currentPalette.value, paletteName.value);
};

const exportCSSCode = () => {
  exportedCode.value = exportToCSSCode(currentPalette.value, paletteName.value);
};

const copyExportedCode = async () => {
  try {
    await navigator.clipboard.writeText(exportedCode.value);
    showNotification.value = true;
    notificationMessage.value = 'Код скопирован в буфер обмена!';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

const createShareLink = () => {
  if (!currentPalette.value || currentPalette.value.length === 0) {
    showNotification.value = true;
    notificationMessage.value = 'Сначала создайте палитру!';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
    return;
  }
  
  // Получаем текущий путь роутера
  const currentPath = route.path;
  const link = createShareableLink(currentPalette.value, paletteName.value, currentPath);
  if (link) {
    shareLink.value = link;
    showNotification.value = true;
    notificationMessage.value = 'Ссылка создана!';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  } else {
    showNotification.value = true;
    notificationMessage.value = 'Ошибка при создании ссылки';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  }
};

const copyShareLink = async () => {
  if (!shareLink.value) return;
  
  try {
    await navigator.clipboard.writeText(shareLink.value);
    showNotification.value = true;
    notificationMessage.value = 'Ссылка скопирована в буфер обмена!';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
    showNotification.value = true;
    notificationMessage.value = 'Ошибка при копировании';
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  }
};

const testShareLink = () => {
  if (shareLink.value) {
    window.open(shareLink.value, '_blank');
  }
};

const handleCopy = (value) => {
  notificationMessage.value = `Скопировано: ${value}`;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
};

// Загружаем палитру из шаринговой ссылки или генерируем новую
const loadInitialPalette = () => {
  const sharedPalette = decodeShareableLink();
  if (sharedPalette && sharedPalette.colors) {
    currentPalette.value = sharedPalette.colors;
    if (sharedPalette.name) {
      paletteName.value = sharedPalette.name;
    }
    // Очищаем URL от query параметров, но сохраняем путь
    const currentPath = route.path;
    const newUrl = window.location.origin + (import.meta.env.BASE_URL || '/') + currentPath.replace(/^\//, '');
    window.history.replaceState({}, document.title, newUrl);
  } else {
    generateAdvancedPalette();
  }
};

loadInitialPalette();
</script>

<style scoped>
.advanced-view {
  max-width: 1400px;
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

.generation-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.generation-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.generation-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.option-group input[type="color"] {
  width: 60px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.option-group input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 80px;
}

.option-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.color-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #666;
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
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.palette-container {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.tools-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.tool-panel {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tool-panel h3 {
  margin-bottom: 16px;
  color: #333;
}

.tool-panel select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.export-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.export-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.export-btn:hover {
  background: #5568d3;
}

.export-result {
  margin-top: 12px;
}

.export-result textarea {
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  resize: vertical;
}

.copy-btn {
  margin-top: 8px;
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #45a049;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-btn {
  padding: 10px 20px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.share-btn:hover {
  background: #1976d2;
}

.share-link-result {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.share-link-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Courier New', monospace;
  word-break: break-all;
  cursor: text;
  background: #f9f9f9;
}

.share-link-actions {
  display: flex;
  gap: 8px;
}

.test-btn {
  padding: 8px 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.test-btn:hover {
  background: #1976d2;
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

