import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Trash2,
  Pencil,
  Calendar,
  MoreHorizontal,
  Check,
  X,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PriorityBadge } from '@/components/common/PriorityBadge';
import { useTaskStore } from '@/store/taskStore';
import { TaskForm } from '@/components/tasks/TaskForm';
import type { Task } from '@/types/task';
import { formatDueDate, isDueDateOverdue } from '@/utils/helpers';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = memo(function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dueDateStr = formatDueDate(task.dueDate);
  const isOverdue = isDueDateOverdue(task.dueDate);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = useCallback(() => {
    toggleComplete(task.id);
    toast.success(task.completed ? 'Task reopened' : 'Task completed', {
      description: `"${task.title}" marked as ${task.completed ? 'active' : 'done'}.`,
    });
  }, [task.id, task.completed, task.title, toggleComplete]);

  const handleDelete = useCallback(() => {
    deleteTask(task.id);
    toast.success('Task deleted', {
      description: `"${task.title}" has been removed.`,
    });
  }, [task.id, task.title, deleteTask]);

  const handleEditStart = useCallback(() => {
    setEditValue(task.title);
    setIsEditing(true);
  }, [task.title]);

  const handleEditSave = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      updateTask(task.id, { title: trimmed });
      toast.success('Task updated', {
        description: `Title changed to "${trimmed}".`,
      });
    }
    setIsEditing(false);
  }, [editValue, task.id, task.title, updateTask]);

  const handleEditCancel = useCallback(() => {
    setEditValue(task.title);
    setIsEditing(false);
  }, [task.title]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleEditSave();
      } else if (e.key === 'Escape') {
        handleEditCancel();
      }
    },
    [handleEditSave, handleEditCancel]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4 transition-all duration-200',
        isDragging
          ? 'z-50 shadow-2xl shadow-primary/10 border-primary/30 scale-[1.02]'
          : 'border-border/50 hover:border-border hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20',
        task.completed && 'opacity-60'
      )}
    >
      {/* Drag Handle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab touch-none rounded-md p-1 text-muted-foreground/40 transition-colors hover:text-muted-foreground active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Drag to reorder</p>
        </TooltipContent>
      </Tooltip>

      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="h-5 w-5 rounded-md border-2 transition-all data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSave}
              className="h-8 text-sm"
              aria-label="Edit task title"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEditSave}
              className="h-7 w-7 shrink-0"
              aria-label="Save edit"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleEditCancel}
              className="h-7 w-7 shrink-0"
              aria-label="Cancel edit"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <p
              className={cn(
                'text-sm font-medium leading-snug transition-all duration-300 truncate',
                task.completed
                  ? 'text-muted-foreground line-through decoration-muted-foreground/50'
                  : 'text-foreground'
              )}
              onDoubleClick={handleEditStart}
              title={task.title}
            >
              {task.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              {dueDateStr && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs',
                    isOverdue && !task.completed
                      ? 'text-destructive font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  {dueDateStr}
                  {isOverdue && !task.completed && ' • Overdue'}
                </span>
              )}
              {task.description && (
                <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[200px]">
                  {task.description}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              aria-label="Task actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleEditStart}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <TaskForm
              task={task}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit details
                </DropdownMenuItem>
              }
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
});
