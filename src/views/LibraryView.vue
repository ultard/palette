<template>
  <div class="library-view">
    <div class="header">
      <h1>Библиотека палитр</h1>
      <p>Сохраняйте и управляйте своими палитрами</p>
    </div>

    <div class="save-section">
      <h2>Сохранить текущую палитру</h2>
      <div class="save-form">
        <input
          v-model="newPaletteName"
          placeholder="Название палитры"
          class="name-input"
        />
        <input
          v-model="newPaletteTags"
          placeholder="Теги (через запятую)"
          class="tags-input"
        />
        <button @click="saveCurrentPalette" class="save-btn">
          💾 Сохранить
        </button>
      </div>
    </div>

    <div class="search-section">
      <input
        v-model="searchQuery"
        placeholder="Поиск по названию или тегам..."
        class="search-input"
      />
      <div class="filter-controls">
        <button
          @click="showOnlyFavorites = !showOnlyFavorites"
          :class="['favorite-filter-btn', { active: showOnlyFavorites }]"
        >
          ⭐ {{ showOnlyFavorites ? 'Все палитры' : 'Только избранные' }}
        </button>
      </div>
      <div class="filter-buttons">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="['tag-btn', { active: selectedTags.includes(tag) }]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <div class="palettes-grid">
      <div
        v-for="palette in filteredPalettes"
        :key="palette.id"
        class="palette-card"
        :class="{ 'favorite-card': palette.favorite }"
      >
        <div class="palette-header">
          <h3>
            <span v-if="palette.favorite" class="favorite-badge">⭐</span>
            {{ palette.name }}
          </h3>
          <div class="palette-actions">
            <button @click="editPalette(palette)" class="action-btn">✏️</button>
            <button @click="deletePalette(palette.id)" class="action-btn">🗑️</button>
            <button
              @click="toggleFavorite(palette.id)"
              class="action-btn"
              :class="{ favorited: palette.favorite }"
            >
              ⭐
            </button>
          </div>
        </div>
        <div class="palette-colors">
          <div
            v-for="(color, index) in palette.colors"
            :key="index"
            class="mini-color"
            :style="{ backgroundColor: color }"
            :title="color"
          ></div>
        </div>
        <div class="palette-tags">
          <span
            v-for="tag in palette.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
        <div class="palette-footer">
          <button @click="loadPalette(palette)" class="load-btn">
            Загрузить
          </button>
          <button @click="exportPalette(palette)" class="export-btn">
            Экспорт
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredPalettes.length === 0" class="empty-state">
      <p>Палитры не найдены</p>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="editingPalette" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h2>Редактировать палитру</h2>
        <input
          v-model="editName"
          placeholder="Название"
          class="name-input"
        />
        <input
          v-model="editTags"
          placeholder="Теги (через запятую)"
          class="tags-input"
        />
        <div class="edit-colors">
          <div
            v-for="(color, index) in editColors"
            :key="index"
            class="edit-color-item"
          >
            <input type="color" v-model="editColors[index]" />
            <input
              type="text"
              v-model="editColors[index]"
              class="color-input"
            />
            <button @click="removeColor(index)" class="remove-btn">×</button>
          </div>
        </div>
        <button @click="addColor" class="add-color-btn">+ Добавить цвет</button>
        <div class="modal-actions">
          <button @click="saveEdit" class="save-btn">Сохранить</button>
          <button @click="closeEditModal" class="cancel-btn">Отмена</button>
        </div>
      </div>
    </div>

    <div class="notification" v-if="showNotification">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storage } from '../utils/storage';
import {
  exportToCSSVariables,
  exportToSCSSVariables,
  exportToTailwindConfig,
  exportToCSSCode,
} from '../utils/exportUtils';

const router = useRouter();

const palettes = ref([]);
const searchQuery = ref('');
const selectedTags = ref([]);
const showOnlyFavorites = ref(false);
const newPaletteName = ref('');
const newPaletteTags = ref('');
const editingPalette = ref(null);
const editName = ref('');
const editTags = ref('');
const editColors = ref([]);
const showNotification = ref(false);
const notificationMessage = ref('');

const allTags = computed(() => {
  const tags = new Set();
  palettes.value.forEach((palette) => {
    palette.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

const filteredPalettes = computed(() => {
  let filtered = palettes.value;

  // Фильтр по избранным
  if (showOnlyFavorites.value) {
    filtered = filtered.filter((palette) => palette.favorite);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (palette) =>
        palette.name.toLowerCase().includes(query) ||
        palette.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((palette) =>
      selectedTags.value.some((tag) => palette.tags.includes(tag))
    );
  }

  return filtered.sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

const saveCurrentPalette = () => {
  const currentPalette = storage.load('currentPalette', []);
  
  if (currentPalette.length === 0) {
    showNotificationMessage('Сначала создайте палитру на главной странице');
    return;
  }

  if (!newPaletteName.value.trim()) {
    showNotificationMessage('Введите название палитры');
    return;
  }

  const palette = {
    id: Date.now().toString(),
    name: newPaletteName.value.trim(),
    colors: [...currentPalette],
    tags: newPaletteTags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag),
    favorite: false,
    createdAt: new Date().toISOString(),
  };

  palettes.value.push(palette);
  savePalettes();
  newPaletteName.value = '';
  newPaletteTags.value = '';
  showNotificationMessage('Палитра сохранена!');
};

const deletePalette = (id) => {
  if (confirm('Удалить эту палитру?')) {
    palettes.value = palettes.value.filter((p) => p.id !== id);
    savePalettes();
    showNotificationMessage('Палитра удалена');
  }
};

const toggleFavorite = (id) => {
  const palette = palettes.value.find((p) => p.id === id);
  if (palette) {
    palette.favorite = !palette.favorite;
    savePalettes();
  }
};

const editPalette = (palette) => {
  editingPalette.value = palette;
  editName.value = palette.name;
  editTags.value = palette.tags.join(', ');
  editColors.value = [...palette.colors];
};

const closeEditModal = () => {
  editingPalette.value = null;
  editName.value = '';
  editTags.value = '';
  editColors.value = [];
};

const saveEdit = () => {
  if (!editName.value.trim()) {
    showNotificationMessage('Введите название палитры');
    return;
  }

  const palette = palettes.value.find((p) => p.id === editingPalette.value.id);
  if (palette) {
    palette.name = editName.value.trim();
    palette.colors = [...editColors.value];
    palette.tags = editTags.value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    savePalettes();
    closeEditModal();
    showNotificationMessage('Палитра обновлена!');
  }
};

const addColor = () => {
  editColors.value.push('#000000');
};

const removeColor = (index) => {
  editColors.value.splice(index, 1);
};

const loadPalette = (palette) => {
  storage.save('currentPalette', palette.colors);
  router.push('/');
  showNotificationMessage('Палитра загружена!');
};

const exportPalette = async (palette) => {
  const name = prompt('Выберите формат экспорта:\n1 - CSS Variables\n2 - SCSS Variables\n3 - Tailwind Config\n4 - CSS Code');
  
  let code = '';
  switch (name) {
    case '1':
      code = exportToCSSVariables(palette.colors, palette.name);
      break;
    case '2':
      code = exportToSCSSVariables(palette.colors, palette.name);
      break;
    case '3':
      code = exportToTailwindConfig(palette.colors, palette.name);
      break;
    case '4':
      code = exportToCSSCode(palette.colors, palette.name);
      break;
    default:
      return;
  }

  try {
    await navigator.clipboard.writeText(code);
    showNotificationMessage('Код скопирован в буфер обмена!');
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const savePalettes = () => {
  storage.save('savedPalettes', palettes.value);
};

const loadPalettes = () => {
  palettes.value = storage.load('savedPalettes', []);
};

const showNotificationMessage = (message) => {
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
};

onMounted(() => {
  loadPalettes();
});
</script>

<style scoped>
.library-view {
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

.save-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.save-section h2 {
  margin-bottom: 16px;
  color: #333;
}

.save-form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.name-input,
.tags-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.save-btn {
  padding: 10px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #45a049;
}

.search-section {
  margin-bottom: 32px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
}

.filter-controls {
  margin-bottom: 12px;
}

.favorite-filter-btn {
  padding: 8px 16px;
  border: 2px solid #ffd700;
  border-radius: 20px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.favorite-filter-btn:hover {
  background: #fff9e6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.favorite-filter-btn.active {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tag-btn:hover {
  background: #f0f0f0;
}

.tag-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.palettes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.palette-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
  position: relative;
}

.palette-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.palette-card.favorite-card {
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border: 2px solid #ffd700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
  position: relative;
}

.palette-card.favorite-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
  z-index: -1;
  opacity: 0.3;
}

.palette-card.favorite-card:hover {
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
  transform: translateY(-6px);
}

.palette-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.palette-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-badge {
  font-size: 20px;
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.8));
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.palette-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.2);
}

.action-btn.favorited {
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
  transform: scale(1.1);
  animation: starGlow 1.5s ease-in-out infinite;
}

@keyframes starGlow {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 1));
  }
}

.palette-colors {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  height: 60px;
}

.mini-color {
  flex: 1;
  border-radius: 4px;
  cursor: pointer;
}

.palette-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tag {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.palette-footer {
  display: flex;
  gap: 8px;
}

.load-btn,
.export-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.load-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.export-btn:hover {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #999;
  font-size: 18px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.edit-colors {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.edit-color-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.edit-color-item input[type="color"] {
  width: 50px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
}

.color-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

.remove-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f44336;
  color: white;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}

.add-color-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 10px 24px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
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
  z-index: 1001;
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

