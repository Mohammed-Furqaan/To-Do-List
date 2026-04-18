import { useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTaskStore, useTaskCounts } from '@/store/taskStore';
import { TASK_PRIORITIES, type FilterStatus } from '@/types/task';
import { FILTER_STATUS_CONFIG, PRIORITY_CONFIG } from '@/utils/constants';
import { FILTER_STATUSES } from '@/types/task';
import { motion } from 'framer-motion';

export function TaskFilters() {
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const statusFilter = useTaskStore((s) => s.statusFilter);
  const priorityFilter = useTaskStore((s) => s.priorityFilter);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const setStatusFilter = useTaskStore((s) => s.setStatusFilter);
  const setPriorityFilter = useTaskStore((s) => s.setPriorityFilter);
  const counts = useTaskCounts();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  const statusCountMap = useMemo(
    () => ({
      all: counts.total,
      active: counts.active,
      completed: counts.completed,
    }),
    [counts]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-10 h-10 bg-background"
          aria-label="Search tasks"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
          {FILTER_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as FilterStatus)}
              className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={`Filter ${FILTER_STATUS_CONFIG[status].label}`}
              aria-pressed={statusFilter === status}
            >
              {statusFilter === status && (
                <motion.div
                  layoutId="activeStatusFilter"
                  className="absolute inset-0 rounded-md bg-background shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {FILTER_STATUS_CONFIG[status].label}
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {statusCountMap[status]}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <Select
          value={priorityFilter}
          onValueChange={(value) =>
            setPriorityFilter(value as typeof priorityFilter)
          }
        >
          <SelectTrigger
            className="h-8 w-[140px] text-xs"
            aria-label="Filter by priority"
          >
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {TASK_PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${PRIORITY_CONFIG[priority].dotColor}`}
                  />
                  {PRIORITY_CONFIG[priority].label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}
