import { z } from 'zod';

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const FILTER_STATUSES = ['all', 'active', 'completed'] as const;
export type FilterStatus = (typeof FILTER_STATUSES)[number];

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Title must be under 200 characters'),
  description: z
    .string()
    .max(500, 'Description must be under 500 characters')
    .optional()
    .or(z.literal('')),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.date().nullable().optional(),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  order: number;
}
