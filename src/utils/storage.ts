import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

function isValidTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>
  const validStatus = record.status === 'todo' || record.status === 'in-progress' || record.status === 'done'
  const validPriority = record.priority === 'low' || record.priority === 'medium' || record.priority === 'high'

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.description === 'string' &&
    validStatus &&
    validPriority &&
    typeof record.dueDate === 'string' &&
    typeof record.createdAt === 'string'
  )
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error)
  }
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isValidTask)
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error)
    return []
  }
}
