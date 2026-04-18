import { format, isToday, isTomorrow, isPast, isYesterday } from 'date-fns';

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function isDueDateOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return isPast(date) && !isToday(date);
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
