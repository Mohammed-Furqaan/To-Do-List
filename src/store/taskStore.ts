import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Task, TaskPriority, FilterStatus } from '@/types/task';

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  statusFilter: FilterStatus;
  priorityFilter: TaskPriority | 'all';

  // Actions
  addTask: (task: {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate: string | null;
  }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: FilterStatus) => void;
  setPriorityFilter: (filter: TaskPriority | 'all') => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      searchQuery: '',
      statusFilter: 'all',
      priorityFilter: 'all',

      addTask: (taskData) =>
        set((state) => {
          const now = new Date().toISOString();
          const newTask: Task = {
            id: nanoid(),
            title: taskData.title,
            description: taskData.description || undefined,
            priority: taskData.priority,
            dueDate: taskData.dueDate,
            completed: false,
            createdAt: now,
            updatedAt: now,
            order: state.tasks.length,
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        })),

      reorderTasks: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
          const newIndex = state.tasks.findIndex((t) => t.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;

          const newTasks = [...state.tasks];
          const [removed] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, removed);

          return {
            tasks: newTasks.map((task, index) => ({
              ...task,
              order: index,
            })),
          };
        }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),
      setPriorityFilter: (filter) => set({ priorityFilter: filter }),
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
// Custom hooks for derived data — must be used inside React components
// These use individual primitive selectors to avoid infinite loops

export function useFilteredTasks(): Task[] {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const statusFilter = useTaskStore((s) => s.statusFilter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);

  return useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter, priorityFilter]);
}

export function useTaskCounts() {
  const tasks = useTaskStore((s) => s.tasks);

  return useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );
}

