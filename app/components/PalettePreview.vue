<template>
  <div class="preview-container">
    <div class="preview-header">
      <h3>👁️ Превью палитры</h3>
      <button class="btn btn-secondary" @click="$emit('toggle-background')">
        {{ isDarkMode ? '☀️ Светлый фон' : '🌙 Тёмный фон' }}
      </button>
    </div>

    <div class="preview-content" :class="{ 'dark-bg': isDarkMode }">
      <div class="mockup-ui">
        <div class="mockup-header" :style="{ backgroundColor: colors[0] || '#4ECDC4' }">
          <h4 class="mockup-title">Заголовок страницы</h4>
          <button
            class="mockup-button"
            :style="{
              backgroundColor: colors[1] || '#FF6B6B',
              color: getContrastColor(colors[1] || '#FF6B6B')
            }">
            Кнопка действия
          </button>
        </div>

        <div class="mockup-body">
          <div
            class="mockup-card"
            :style="{
              backgroundColor: colors[2] || '#FFD166',
              color: getContrastColor(colors[2] || '#FFD166')
            }">
            <h5>Карточка с контентом</h5>
            <p>Пример текста на карточке с использованием цвета палитры</p>
          </div>

          <div class="mockup-sidebar" :style="{ backgroundColor: colors[3] || '#06D6A0' }">
            <div class="sidebar-item">Меню 1</div>
            <div class="sidebar-item">Меню 2</div>
            <div class="sidebar-item">Меню 3</div>
          </div>
        </div>

        <div class="mockup-footer" :style="{ backgroundColor: colors[4] || '#118AB2' }">
          <p>Футер страницы</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  colors: {
    type: Array,
    default: () => []
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-background'])

const getContrastColor = (hex) => {
  if (!hex) return '#000000'

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#000000' : '#FFFFFF'
}
</script>

<style scoped>
.preview-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .preview-container {
  background: rgba(30, 30, 46, 0.9);
  color: white;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.preview-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.dark-bg {
  background: #2c3e50;
}

.mockup-ui {
  border: 2px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.dark-bg .mockup-ui {
  border-color: #495057;
}

.mockup-header {
  padding: 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mockup-title {
  margin: 0;
  font-size: 1.5rem;
}

.mockup-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.mockup-button:hover {
  transform: translateY(-1px);
}

.mockup-body {
  display: flex;
  min-height: 200px;
}

.mockup-card {
  flex: 3;
  padding: 1.5rem;
  border-radius: 6px;
  margin: 1rem;
}

.mockup-card h5 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.mockup-sidebar {
  flex: 1;
  padding: 1rem;
  color: white;
}

.sidebar-item {
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mockup-footer {
  padding: 1rem;
  color: white;
  text-align: center;
}

@media (max-width: 768px) {
  .mockup-body {
    flex-direction: column;
  }

  .preview-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>