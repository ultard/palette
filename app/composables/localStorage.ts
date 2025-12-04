import type { Ref } from 'vue';
import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, initialValue: T): Ref<T> {
  const data = ref<T>(initialValue) as Ref<T>

  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key)
    if (storedValue) {
      try {
        data.value = JSON.parse(storedValue)
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e)
      }
    }
  }

  watch(data, (newValue) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  return data
}