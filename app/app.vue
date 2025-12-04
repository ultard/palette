<script setup lang="ts">
import { useLocalStorage } from "~/composables/localStorage";

const isDarkMode = useLocalStorage<false>('darkMode', false)
const palette = useLocalStorage<string[]>('savedPalette', [])
const pinnedColors = useLocalStorage<number[]>('pinnedColors', [])

const colorFormat = ref<'hex' | 'rgb'>('hex')
const colorCount = ref(5)
const showNotification = ref(false)

const initializePalette = () => {
  if (!palette.value || palette.value.length === 0) {
    generateRandomPalette()
  }
}

const generateRandomPalette = () => {
  const activePins = pinnedColors.value.filter(i => i < colorCount.value);
  const colorsNeeded = colorCount.value - activePins.length;
  const newColorsPool = generateRandomColors(colorsNeeded);

  let poolIndex = 0;
  palette.value = Array.from({length: colorCount.value}, (_, index) => {
    if (pinnedColors.value.includes(index) && palette.value[index]) {
      return palette.value[index];
    } else {
      return newColorsPool[poolIndex++];
    }
  });
}

const copyToClipboard = async (colorValue: string) => {
  try {
    await navigator.clipboard.writeText(colorValue)
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 2000)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

const togglePinColor = (index: number) => {
  if (pinnedColors.value.includes(index)) {
    pinnedColors.value = pinnedColors.value.filter(i => i !== index)
  } else {
    pinnedColors.value.push(index)
  }
}

const toggleBackground = () => {
  isDarkMode.value = !isDarkMode.value
}

onMounted(() => {
  initializePalette()
})
</script>

<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <h1>🎨 Генератор цветовых палитр</h1>
      <p>Инструмент для дизайнеров и разработчиков</p>
    </header>

    <main class="app-container">
      <div class="main-content">
        <PaletteControls
            v-model:colors="palette"
            v-model:color-format="colorFormat"
            v-model:color-count="colorCount"
            @generate-random="generateRandomPalette"
            @toggle-pin="togglePinColor"
        />

        <PaletteDisplay
            :colors="palette"
            :color-format="colorFormat"
            :pinned-colors="pinnedColors"
            @copy-color="copyToClipboard"
            @toggle-pin="togglePinColor"
        />

        <PalettePreview
            :colors="palette"
            :is-dark-mode="isDarkMode"
            @toggle-background="toggleBackground"
        />
      </div>
    </main>

    <transition name="fade">
      <div v-if="showNotification" class="notification">
        Цвет скопирован в буфер обмена!
      </div>
    </transition>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app.dark-mode {
  background: #2c3e50;
  color: #ffffff;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem;
  backdrop-filter: blur(10px);
  background: #f1f1f1;
}

.dark-mode .app-header {
  background: rgba(30, 30, 46, 0.9);
  color: #ffffff;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4ECDC4;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }
}
</style>