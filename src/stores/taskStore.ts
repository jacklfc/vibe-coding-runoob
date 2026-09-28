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

const tasks = reactive<Task[]>(loadTasks())

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

export function addTask(task: { title: string; description: string; priority: TaskPriority }) {
  const today = new Date().toISOString().slice(0, 10)

  tasks.unshift({
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    status: 'todo',
    priority: task.priority,
    dueDate: today,
    createdAt: today,
  })
}

export function updateTask(taskId: string, updates: Partial<Task>) {
  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  Object.assign(target, updates)
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
  const target = tasks.find((task) => task.id === taskId)
  if (!target) return

  target.status = status
}

export { tasks }
