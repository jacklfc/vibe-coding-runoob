<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  create: []
}>()

type FilterValue = 'all' | 'todo' | 'in-progress' | 'done'

const activeFilter = ref<FilterValue>('all')

const filterOptions: { label: string; value: FilterValue }[] = [
  { label: '全部', value: 'all' },
  { label: '待办', value: 'todo' },
  { label: '进行中', value: 'in-progress' },
  { label: '完成', value: 'done' },
]

const sortedTasks = computed(() =>
  [...props.tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ),
)

const visibleTasks = computed(() =>
  sortedTasks.value.filter((task) => {
    if (activeFilter.value === 'all') return true
    return task.status === activeFilter.value
  }),
)
</script>

<template>
  <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 sm:p-5">
    <div class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        type="button"
        @click="activeFilter = option.value"
        class="min-h-[44px] rounded-full border px-3 py-1.5 text-sm font-medium transition"
        :class="
          activeFilter === option.value
            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:text-indigo-300'
        "
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="visibleTasks.length === 0" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/80">
      <p class="text-base font-medium text-slate-700 dark:text-slate-200">还没有任务，点击下方按钮创建第一个吧</p>
      <button
        type="button"
        @click="emit('create')"
        class="mt-5 min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
      >
        创建任务
      </button>
    </div>

    <div v-else class="space-y-4">
      <TaskCard
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
