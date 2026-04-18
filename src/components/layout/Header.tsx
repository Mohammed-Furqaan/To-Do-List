import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskCounts } from '@/store/taskStore';

export function Header() {
  const counts = useTaskCounts();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/25">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              TaskFlow
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {counts.total === 0
                ? 'Start adding tasks'
                : `${counts.active} active · ${counts.completed} done`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TaskForm />
        </div>
      </div>
    </motion.header>
  );
}
