<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../types/task'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()

const priorityStyles: Record<Task['priority'], { label: string; border: string; badge: string }> = {
  low: {
    label: '低',
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  medium: {
    label: '中',
    border: 'border-l-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  high: {
    label: '高',
    border: 'border-l-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  },
}

const isCompleted = computed(() => props.task.status === 'done')

function toggleTask() {
  emit('toggle', props.task.id)
}

function deleteTask() {
  emit('delete', props.task.id)
}

function formatDate(date: string) {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) {
    return '未设置'
  }

  return value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    :class="{
      'opacity-90': task.status === 'done',
      'opacity-100': task.status !== 'done',
      'border-l-4': true,
      [priorityStyles[task.priority].border]: true,
    }"
  >
    <div class="flex items-start gap-4">
      <button
        type="button"
        :aria-label="isCompleted ? '标记未完成' : '标记已完成'"
        @click="toggleTask"
        class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white transition hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-400 dark:hover:ring-indigo-500/30"
      >
        <span v-if="isCompleted" class="h-2.5 w-2.5 rounded-sm bg-indigo-600"></span>
      </button>

      <div class="min-w-0 flex-1">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <h3
            class="text-lg font-semibold text-slate-800 transition-all dark:text-slate-100"
            :class="{ 'text-slate-400 line-through dark:text-slate-500': isCompleted }"
          >
            {{ task.title }}
          </h3>
          <span
            class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
            :class="priorityStyles[task.priority].badge"
          >
            {{ priorityStyles[task.priority].label }}优先级
          </span>
        </div>

        <p class="text-sm leading-6 text-slate-600 dark:text-slate-300" :class="{ 'text-slate-400 line-through dark:text-slate-500': isCompleted }">
          {{ task.description }}
        </p>

        <div class="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>截止：{{ formatDate(task.dueDate) }}</span>
          <span>创建：{{ formatDate(task.createdAt) }}</span>
        </div>
      </div>

      <button
        type="button"
        aria-label="删除任务"
        @click="deleteTask"
        class="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-300"
      >
        ×
      </button>
    </div>
  </article>
</template>
