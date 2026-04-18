import type { TaskPriority, FilterStatus } from '@/types/task';

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  low: {
    label: 'Low',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    dotColor: 'bg-blue-500',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800',
    dotColor: 'bg-orange-500',
  },
  urgent: {
    label: 'Urgent',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
    dotColor: 'bg-red-500',
  },
};

export const FILTER_STATUS_CONFIG: Record<FilterStatus, { label: string }> = {
  all: { label: 'All Tasks' },
  active: { label: 'Active' },
  completed: { label: 'Completed' },
};
