<template>
  <div class="palette-display">
    <div class="palette-container">
      <div
        v-for="(color, index) in colors"
        :key="index"
        :style="{ backgroundColor: color }"
        class="color-card"
        @click="$emit('copy-color', formattedColors[index])"
      >
          <div class="color-info">
            <div class="color-value">{{ formattedColors[index] }}</div>
            <button
                class="pin-btn"
                :class="{ pinned: isPinned(index) }"
                :title="isPinned(index) ? 'Открепить цвет' : 'Закрепить цвет'"
                @click.stop="$emit('toggle-pin', index)"
            >
              {{ isPinned(index) ? '📌' : '📍' }}
            </button>
          </div>
        </div>
    </div>

    <div v-if="pinnedColors.length > 0" class="pinned-colors-info">
      <span>📌 Закреплено: {{ pinnedColors.length }} цветов</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatColor } from '~/composables/colorConvertion'

interface Props {
  colors: string[]
  colorFormat: 'hex' | 'rgb'
  pinnedColors: number[]
}

const props = defineProps<Props>()

defineEmits<{
  'copy-color': [value: string]
  'toggle-pin': [index: number]
}>()

const formattedColors = computed(() => {
  return props.colors.map(color => formatColor(color, props.colorFormat))
})

const isPinned = (index: number) => {
  return props.pinnedColors.includes(index)
}
</script>

<style scoped>
.palette-display {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .palette-display {
  background: rgba(30, 30, 46, 0.9);
}

.palette-container {
  display: flex;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.color-card {
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.color-card:hover::after {
  content: 'Кликните для копирования';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.color-info {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.75rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(5px);
}

.dark-mode .color-info {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.color-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  user-select: all;
}

.pin-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.3s;
}

.pin-btn:hover {
  transform: scale(1.2);
}

.pin-btn.pinned {
  animation: pulse 1s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.pinned-colors-info {
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
}

.dark-mode .pinned-colors-info {
  background: rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .palette-container {
    flex-direction: column;
    height: auto;
  }

  .color-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>