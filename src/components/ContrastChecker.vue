<template>
  <div class="contrast-checker">
    <h3>Проверка контрастности (WCAG)</h3>
    <div class="contrast-grid">
      <div
        v-for="(pair, index) in contrastPairs"
        :key="index"
        class="contrast-item"
      >
        <div class="contrast-preview">
          <div
            class="preview-bg"
            :style="{ backgroundColor: pair.color1 }"
          >
            <div
              class="preview-text"
              :style="{ color: pair.color2 }"
            >
              Текст
            </div>
          </div>
        </div>
        <div class="contrast-info">
          <div class="color-codes">
            <span>{{ pair.color1 }}</span>
            <span>на</span>
            <span>{{ pair.color2 }}</span>
          </div>
          <div class="contrast-ratio">
            Контраст: {{ pair.result.contrast }}:1
          </div>
          <div class="wcag-badges">
            <span
              v-if="pair.result.AA"
              class="badge badge-aa"
            >
              AA ✓
            </span>
            <span
              v-else-if="pair.result.AALarge"
              class="badge badge-aa-large"
            >
              AA Large ✓
            </span>
            <span
              v-else
              class="badge badge-fail"
            >
              Недостаточно
            </span>
            <span
              v-if="pair.result.AAA"
              class="badge badge-aaa"
            >
              AAA ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { checkWCAG } from '../utils/colorUtils';

const props = defineProps({
  colors: {
    type: Array,
    required: true,
  },
});

const contrastPairs = computed(() => {
  const pairs = [];
  for (let i = 0; i < props.colors.length; i++) {
    for (let j = i + 1; j < props.colors.length; j++) {
      const result = checkWCAG(props.colors[i], props.colors[j]);
      pairs.push({
        color1: props.colors[i],
        color2: props.colors[j],
        result,
      });
      // Также проверяем обратный порядок
      pairs.push({
        color1: props.colors[j],
        color2: props.colors[i],
        result,
      });
    }
  }
  return pairs;
});
</script>

<style scoped>
.contrast-checker {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contrast-checker h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.contrast-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.contrast-preview {
  height: 100px;
}

.preview-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-text {
  font-size: 24px;
  font-weight: 600;
}

.contrast-info {
  padding: 12px;
  background: #f9f9f9;
}

.color-codes {
  display: flex;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.color-codes span {
  font-family: 'Monaco', 'Courier New', monospace;
}

.contrast-ratio {
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.wcag-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.badge-aa {
  background: #4caf50;
  color: white;
}

.badge-aa-large {
  background: #ff9800;
  color: white;
}

.badge-aaa {
  background: #2196f3;
  color: white;
}

.badge-fail {
  background: #f44336;
  color: white;
}
</style>

