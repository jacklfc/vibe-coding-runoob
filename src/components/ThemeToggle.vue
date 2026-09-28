<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

function applyTheme(value: boolean) {
  isDark.value = value
  document.documentElement.classList.toggle('dark', value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem(STORAGE_KEY)

  if (savedTheme) {
    applyTheme(savedTheme === 'dark')
    return
  }

  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
})

watch(
  isDark,
  (value) => {
    localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', value)
  },
  { immediate: true },
)
</script>

<template>
  <button
    type="button"
    aria-label="切换深色模式"
    @click="isDark = !isDark"
    class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
  >
    {{ isDark ? '☀️' : '🌙' }}
  </button>
</template>
