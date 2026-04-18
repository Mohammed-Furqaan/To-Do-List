import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { TaskPriority } from '@/types/task';
import { PRIORITY_CONFIG } from '@/utils/constants';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge = memo(function PriorityBadge({
  priority,
  className = '',
}: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} gap-1.5 text-xs font-medium ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
});
