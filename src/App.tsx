import { useCallback, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/Header';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <Header />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8"
        >
          <div className="space-y-6">
            <TaskFilters />
            <TaskListWithEmptyStateForm />
          </div>
        </motion.main>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </div>
    </TooltipProvider>
  );
}

/**
 * Wraps TaskList and provides a hidden TaskForm for programmatic opening
 * from the empty state CTA button.
 */
function TaskListWithEmptyStateForm() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleAddTask = useCallback(() => {
    triggerRef.current?.click();
  }, []);

  return (
    <>
      <TaskList onAddTask={handleAddTask} />
      {/* Hidden trigger for the empty state form dialog */}
      <TaskForm
        trigger={
          <Button ref={triggerRef} className="hidden" aria-hidden="true">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
    </>
  );
}
