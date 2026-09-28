<script setup lang="ts">
import { computed, ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, tasks, toggleTask, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

const isModalOpen = ref(false)
const activeTab = ref<'list' | 'kanban'>('list')
const isMenuOpen = ref(false)

const completedCount = computed(() => tasks.filter((task) => task.status === 'done').length)

function openCreateModal() {
  isModalOpen.value = true
}

function handleMoveTask(taskId: string, status: TaskStatus) {
  updateTask(taskId, { status })
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-700 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="打开菜单"
            @click="isMenuOpen = !isMenuOpen"
          >
            ☰
          </button>

          <div>
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-600">Workspace</p>
            <h1 class="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">Vibe Coding Runoob</h1>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            class="min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            @click="openCreateModal"
          >
            + 新建任务
          </button>
        </div>
      </div>

      <div v-if="isMenuOpen" class="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
        <div class="flex flex-col gap-2">
          <button
            type="button"
            @click="activeTab = 'list'; isMenuOpen = false"
            class="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-medium transition"
            :class="activeTab === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'"
          >
            列表
          </button>
          <button
            type="button"
            @click="activeTab = 'kanban'; isMenuOpen = false"
            class="min-h-[44px] rounded-lg px-3 py-2 text-left text-sm font-medium transition"
            :class="activeTab === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'"
          >
            看板
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">总览</p>
          <h2 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">任务列表</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <span class="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300">
            {{ tasks.length }} 项任务
          </span>
          <span class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
            已完成 {{ completedCount }}
          </span>
        </div>
      </section>

      <div class="mb-6 hidden w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm md:flex dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          @click="activeTab = 'list'"
          class="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="activeTab === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300'"
        >
          列表
        </button>
        <button
          type="button"
          @click="activeTab = 'kanban'"
          class="min-h-[44px] rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="activeTab === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300'"
        >
          看板
        </button>
      </div>

      <div v-if="activeTab === 'list'">
        <TaskList :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" @create="openCreateModal" />
      </div>

      <div v-else>
        <KanbanBoard :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" @move="handleMoveTask" />
      </div>
    </main>

    <TaskModal v-model="isModalOpen" @submit="addTask" />
  </div>
</template>
