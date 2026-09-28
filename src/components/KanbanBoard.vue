<script setup lang="ts">
import { computed, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  move: [taskId: string, status: TaskStatus]
}>()

const draggedTaskId = ref<string | null>(null)
const activeDropColumn = ref<TaskStatus | null>(null)

const columns: Array<{ key: TaskStatus; title: string; emptyText: string }> = [
  { key: 'todo', title: '待办', emptyText: '暂无待办任务' },
  { key: 'in-progress', title: '进行中', emptyText: '暂无进行中的任务' },
  { key: 'done', title: '已完成', emptyText: '暂无已完成任务' },
]

const groupedTasks = computed(() => ({
  todo: props.tasks.filter((task) => task.status === 'todo'),
  'in-progress': props.tasks.filter((task) => task.status === 'in-progress'),
  done: props.tasks.filter((task) => task.status === 'done'),
}))

function clearDragState() {
  draggedTaskId.value = null
  activeDropColumn.value = null
}

function resolveDropStatusFromPoint(x: number, y: number): TaskStatus | null {
  const target = document.elementFromPoint(x, y)?.closest('[data-status-column]') as HTMLElement | null
  const status = target?.dataset.statusColumn as TaskStatus | undefined
  return status ?? null
}

function onDragStart(taskId: string, event: DragEvent) {
  draggedTaskId.value = taskId
  event.dataTransfer?.setData('text/plain', taskId)
  event.dataTransfer?.setData('application/x-task-id', taskId)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function onDragOver(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  activeDropColumn.value = status
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDragEnter(event: DragEvent, status: TaskStatus) {
  event.preventDefault()
  activeDropColumn.value = status
}

function onDrop(status: TaskStatus, event: DragEvent) {
  event.preventDefault()
  const sourceId = draggedTaskId.value ?? event.dataTransfer?.getData('application/x-task-id') ?? event.dataTransfer?.getData('text/plain')
  if (!sourceId) return

  emit('move', sourceId, status)
  clearDragState()
}

function onDragEnd() {
  clearDragState()
}

function onPointerDown(taskId: string, event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (event.pointerType === 'mouse') return

  draggedTaskId.value = taskId
  activeDropColumn.value = resolveDropStatusFromPoint(event.clientX, event.clientY)
  event.preventDefault()
}

function onPointerMove(event: PointerEvent) {
  if (!draggedTaskId.value || event.pointerType === 'mouse') return

  activeDropColumn.value = resolveDropStatusFromPoint(event.clientX, event.clientY)
  event.preventDefault()
}

function onPointerUp(event: PointerEvent) {
  if (!draggedTaskId.value) return

  const nextStatus = resolveDropStatusFromPoint(event.clientX, event.clientY)
  if (nextStatus) {
    emit('move', draggedTaskId.value, nextStatus)
  }

  clearDragState()
  event.preventDefault()
}

function onPointerCancel() {
  clearDragState()
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
    <section
      v-for="column in columns"
      :key="column.key"
      :data-status-column="column.key"
      class="min-h-[280px] rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200 sm:min-h-[300px] dark:border-slate-700 dark:bg-slate-900"
      :class="{
        'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100 shadow-inner dark:border-indigo-500 dark:bg-indigo-500/5 dark:ring-indigo-400/30': activeDropColumn === column.key,
        'scale-[1.01]': activeDropColumn === column.key,
      }"
      @dragover="onDragOver($event, column.key)"
      @dragenter="onDragEnter($event, column.key)"
      @drop="onDrop(column.key, $event)"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ column.title }}</h3>
        <span class="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {{ groupedTasks[column.key].length }}
        </span>
      </div>

      <div
        v-if="groupedTasks[column.key].length === 0"
        class="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 transition-colors duration-200 dark:border-slate-700 dark:text-slate-500"
        :class="{ 'border-indigo-300 bg-indigo-50 text-indigo-500 dark:border-indigo-500 dark:bg-indigo-500/5 dark:text-indigo-300': activeDropColumn === column.key }"
      >
        {{ column.emptyText }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="task in groupedTasks[column.key]"
          :key="task.id"
          draggable="true"
          class="cursor-grab touch-none transition-all duration-200 active:cursor-grabbing"
          :class="{ 'scale-[0.98] opacity-60 shadow-lg': draggedTaskId === task.id }"
          @dragstart="onDragStart(task.id, $event)"
          @dragend="onDragEnd()"
          @pointerdown="onPointerDown(task.id, $event)"
          @pointermove="onPointerMove($event)"
          @pointerup="onPointerUp($event)"
          @pointercancel="onPointerCancel()"
        >
          <TaskCard :task="task" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
        </div>
      </div>
    </section>
  </div>
</template>
