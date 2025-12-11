<template>
  <div
    class="color-card"
    :class="{ pinned: isPinned, 'is-copying': isCopying }"
    :style="{ backgroundColor: color }"
    @click="handleClick"
  >
    <div class="color-card-content">
      <div class="color-value" :class="{ 'text-dark': isDark }">
        {{ displayValue }}
      </div>
      <button
        v-if="showPinButton"
        class="pin-button"
        :class="{ pinned: isPinned }"
        @click.stop="togglePin"
        :title="isPinned ? 'Открепить' : 'Закрепить'"
      >
        📌
      </button>
    </div>
    <div v-if="isCopying" class="copy-notification">Скопировано!</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { hexToRgb } from '../utils/colorUtils';

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: 'hex',
  },
  showPinButton: {
    type: Boolean,
    default: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['copy', 'toggle-pin']);

const isCopying = ref(false);

const displayValue = computed(() => {
  if (props.format === 'rgb') {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
  }
  return props.color.toUpperCase();
});

const isDark = computed(() => {
  const rgb = hexToRgb(props.color);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness < 128;
});

const handleClick = () => {
  copyToClipboard();
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(displayValue.value);
    isCopying.value = true;
    emit('copy', displayValue.value);
    setTimeout(() => {
      isCopying.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

const togglePin = () => {
  emit('toggle-pin', props.color);
};
</script>

<style scoped>
.color-card {
  position: relative;
  min-width: 120px;
  height: 150px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-card.pinned {
  border: 3px solid #333;
  box-shadow: 0 0 0 2px #fff, 0 4px 12px rgba(0, 0, 0, 0.3);
}

.color-card-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-value {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.color-value.text-dark {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.pin-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.pin-button:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
}

.pin-button.pinned {
  background: rgba(255, 200, 0, 0.9);
}

.copy-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  animation: fadeInOut 2s;
  pointer-events: none;
  z-index: 10;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  20%, 80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>

