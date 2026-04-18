import { motion } from 'framer-motion';
import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskEmptyStateProps {
  hasFilters: boolean;
  onAddTask: () => void;
}

export function TaskEmptyState({ hasFilters, onAddTask }: TaskEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ y: -10 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
      >
        <ClipboardList className="h-10 w-10 text-primary/60" />
      </motion.div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {hasFilters ? 'No matching tasks' : 'No tasks yet'}
      </h3>
      <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your filters or search query to find what you\'re looking for.'
          : 'Start organizing your day by creating your first task. Stay productive and on track!'}
      </p>

      {!hasFilters && (
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Create your first task
        </Button>
      )}
    </motion.div>
  );
}
