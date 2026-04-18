import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { useFilteredTasks, useTaskStore } from '@/store/taskStore';
import { TaskItem } from './TaskItem';
import { TaskEmptyState } from './TaskEmptyState';
import { TaskSkeleton } from './TaskSkeleton';

interface TaskListProps {
  onAddTask: () => void;
}

export function TaskList({ onAddTask }: TaskListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const filteredTasks = useFilteredTasks();
  const reorderTasks = useTaskStore((s) => s.reorderTasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const statusFilter = useTaskStore((s) => s.statusFilter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);
  const totalTasks = useTaskStore((s) => s.tasks.length);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Simulate initial load for skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        reorderTasks(active.id as string, over.id as string);
      }
    },
    [reorderTasks]
  );

  if (isLoading) {
    return <TaskSkeleton />;
  }

  if (filteredTasks.length === 0) {
    return (
      <TaskEmptyState
        hasFilters={hasActiveFilters && totalTasks > 0}
        onAddTask={onAddTask}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
