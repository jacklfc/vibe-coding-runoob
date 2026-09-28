import { reactive, watch } from 'vue'
import type { Task, TaskPriority, TaskStatus } from '../types/task'
import { loadTasks, saveTasks } from '../utils/storage'

const initialTasks: Task[] = [
  {
    id: '1',
    title: '设计落地页',
    description: '为即将到来的产品发布制定一套精致的落地页方案。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-10-02',
    createdAt: '2026-09-20',
  },
  {
    id: '2',
    title: '准备冲刺评审',
    description: '汇总已完成的工作内容，并与团队同步当前进度。',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-10-05',
    createdAt: '2026-09-22',
  },
  {
    id: '3',
    title: '优化新用户引导',
    description: '梳理首次使用流程并减少不必要的步骤。',
    status: 'done',
    priority: 'low',
    dueDate: '2026-09-28',
    createdAt: '2026-09-18',
  },
]

export type TaskInput = {
  title: string
  description: string
  priority: TaskPriority
}

const tasks = reactive<Task[]>(loadTasks())

function normalizeTaskInput(input: TaskInput): TaskInput {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    priority: ['low', 'medium', 'high'].includes(input.priority) ? input.priority : 'medium',
  }
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === 'todo' || value === 'in-progress' || value === 'done'
}

function isTaskPriority(value: unknown): value is TaskPriority {
  return value === 'low' || value === 'medium' || value === 'high'
}

if (tasks.length === 0) {
  tasks.push(...initialTasks)
}

watch(
  () => tasks.slice(),
  (value) => {
    saveTasks(value)
  },
  { deep: true },
)

export function addTask(input: TaskInput) {
  const today = new Date().toISOString().slice(0, 10)
  const normalized = normalizeTaskInput(input)

  if (!normalized.title) {
    return
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    title: normalized.title,
    description: normalized.description,
    status: 'todo',
    priority: normalized.priority,
    dueDate: today,
    createdAt: today,
  })
}

export function updateTask(taskId: string, updates: Partial<Task>) {
  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  const nextTask: Partial<Task> = {}

  if (updates.title !== undefined) nextTask.title = updates.title.trim()
  if (updates.description !== undefined) nextTask.description = updates.description.trim()
  if (updates.status !== undefined && isTaskStatus(updates.status)) nextTask.status = updates.status
  if (updates.priority !== undefined && isTaskPriority(updates.priority)) nextTask.priority = updates.priority
  if (updates.dueDate !== undefined) nextTask.dueDate = updates.dueDate
  if (updates.createdAt !== undefined) nextTask.createdAt = updates.createdAt

  Object.assign(target, nextTask)
}

export function deleteTask(taskId: string) {
  const index = tasks.findIndex((task) => task.id === taskId)
  if (index >= 0) {
    tasks.splice(index, 1)
  }
}

export function toggleTask(taskId: string) {
  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  target.status = target.status === 'done' ? 'todo' : 'done'
}

export function getTasks() {
  return tasks
}

export function getTaskById(taskId: string) {
  return tasks.find((task) => task.id === taskId)
}

export function setTaskStatus(taskId: string, status: TaskStatus) {
  if (!isTaskStatus(status)) return

  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  target.status = status
}

export { tasks }
