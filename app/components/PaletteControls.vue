<template>
  <div class="controls-container">
    <div class="controls-row">
      <button class="btn btn-primary" @click="$emit('generate-random')">
        🎲 Случайная палитра
      </button>

      <div class="control-item">
        <label>Количество цветов:</label>
        <select v-model="localColorCount" class="select-control">
          <option value="3">3 цвета</option>
          <option value="5">5 цветов</option>
          <option value="7">7 цветов</option>
        </select>
      </div>

      <div class="control-item">
        <label>Формат цвета:</label>
        <div class="format-toggle">
          <button
              :class="['format-btn', { active: localColorFormat === 'hex' }]"
              @click="localColorFormat = 'hex'"
          >
            HEX
          </button>
          <button
              :class="['format-btn', { active: localColorFormat === 'rgb' }]"
              @click="localColorFormat = 'rgb'"
          >
            RGB
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  colorCount: number
  colorFormat: 'hex' | 'rgb'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:colorCount': [value: number]
  'update:colorFormat': [value: 'hex' | 'rgb']
  'generate-random': []
  'toggle-pin': [index: number]
}>()

const localColorCount = ref(props.colorCount)
const localColorFormat = ref(props.colorFormat)

watch(localColorCount, (value) => {
  emit('update:colorCount', parseInt(value.toString()))
})

watch(localColorFormat, (value) => {
  emit('update:colorFormat', value)
})
</script>

<style scoped>
.controls-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark-mode .controls-container {
  background: rgba(30, 30, 46, 0.9);
  color: white;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 107, 107, 0.3);
}

.controls-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-item label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
}

.dark-mode .control-item label {
  color: #ccc;
}

.select-control {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.dark-mode .select-control {
  background: #2a2a3e;
  border-color: #444;
  color: white;
}

.select-control:focus {
  outline: none;
  border-color: #4ECDC4;
}

.format-toggle {
  display: flex;
  gap: 0.5rem;
}

.format-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.dark-mode .format-btn {
  background: #2a2a3e;
  border-color: #444;
  color: white;
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }
}
</style>