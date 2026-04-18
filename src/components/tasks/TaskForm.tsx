import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Plus, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { taskFormSchema, TASK_PRIORITIES, type TaskFormData } from '@/types/task';
import { PRIORITY_CONFIG } from '@/utils/constants';
import { useTaskStore } from '@/store/taskStore';
import type { Task } from '@/types/task';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  trigger?: React.ReactNode;
  onClose?: () => void;
}

export function TaskForm({ task, trigger, onClose }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    },
  });

  const selectedDate = watch('dueDate');
  const selectedPriority = watch('priority');

  const onSubmit = (data: TaskFormData) => {
    if (isEditing && task) {
      updateTask(task.id, {
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      });
      toast.success('Task updated', {
        description: `"${data.title}" has been updated.`,
      });
    } else {
      addTask({
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      });
      toast.success('Task created', {
        description: `"${data.title}" has been added to your list.`,
      });
    }
    reset();
    setOpen(false);
    onClose?.();
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? new Date(task.dueDate) : null,
      });
    }
  };

  const defaultTrigger = (
    <Button className="gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">Add Task</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Pencil className="h-4 w-4" />
                Edit Task
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create New Task
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              {...register('title')}
              aria-invalid={!!errors.title}
              className={errors.title ? 'border-destructive' : ''}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Add more details (optional)"
              {...register('description')}
              aria-invalid={!!errors.description}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-xs text-destructive" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) =>
                  setValue('priority', value as TaskFormData['priority'])
                }
              >
                <SelectTrigger aria-label="Select priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${PRIORITY_CONFIG[p].dotColor}`}
                        />
                        {PRIORITY_CONFIG[p].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, 'MMM d, yyyy')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => {
                      setValue('dueDate', date || null);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                  {selectedDate && (
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          setValue('dueDate', null);
                          setCalendarOpen(false);
                        }}
                      >
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
