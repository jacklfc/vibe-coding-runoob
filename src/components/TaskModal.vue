<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { TaskPriority } from '../types/task'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [task: { title: string; description: string; priority: TaskPriority }]
}>()

const form = ref({
  title: '',
  description: '',
  priority: 'medium' as TaskPriority,
})

const titleError = ref('')
const isOpen = computed(() => props.modelValue)

function closeModal() {
  emit('update:modelValue', false)
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function handleSubmit() {
  if (!form.value.title.trim()) {
    titleError.value = '标题不能为空'
    return
  }

  titleError.value = ''
  emit('submit', {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    priority: form.value.priority,
  })

  form.value = {
    title: '',
    description: '',
    priority: 'medium',
  }
  closeModal()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    closeModal()
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      titleError.value = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 px-0 sm:items-center sm:px-4"
      @click="handleBackdropClick"
    >
      <div
        class="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl transition-all duration-200 sm:rounded-2xl sm:p-6 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div class="mb-5 flex items-center justify-between">
          <h3 id="task-modal-title" class="text-xl font-semibold text-slate-900 dark:text-slate-100">新建任务</h3>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            @click="closeModal"
            aria-label="关闭弹窗"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="task-title" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">标题</label>
            <input
              id="task-title"
              v-model="form.title"
              type="text"
              placeholder="输入任务标题"
              class="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-100': titleError }"
            />
            <p v-if="titleError" class="mt-1 text-xs font-medium text-red-500">{{ titleError }}</p>
          </div>

          <div>
            <label for="task-description" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">描述</label>
            <textarea
              id="task-description"
              v-model="form.description"
              rows="4"
              placeholder="可选：补充任务说明"
              class="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>

          <div>
            <label for="task-priority" class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">优先级</label>
            <select
              id="task-priority"
              v-model="form.priority"
              class="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              取消
            </button>
            <button
              type="submit"
              class="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
