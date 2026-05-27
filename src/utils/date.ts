export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear();
}

export function isAfter(date: Date, reference: Date): boolean {
  return date.getTime() > reference.getTime();
}

export function isBefore(date: Date, reference: Date): boolean {
  return date.getTime() < reference.getTime();
}

export function isInRange(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start || !end) return false;
  const [from, to] =
    start.getTime() <= end.getTime() ? [start, end] : [end, start];
  return date.getTime() > from.getTime() && date.getTime() < to.getTime();
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function today(): Date {
  return startOfDay(new Date());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(date.getDate(), maxDay));
  return d;
}

export function addYears(date: Date, years: number): Date {
  return new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date.getTime() < min.getTime()) return min;
  if (max && date.getTime() > max.getTime()) return max;
  return date;
}

export function isDateDisabled(
  date: Date,
  config: { minDate?: Date; maxDate?: Date; disabled?: boolean | ((d: Date) => boolean) }
): boolean {
  if (config.disabled === true) return true;
  if (typeof config.disabled === 'function' && config.disabled(date)) return true;
  if (config.minDate && date.getTime() < startOfDay(config.minDate).getTime()) return true;
  if (config.maxDate && date.getTime() > startOfDay(config.maxDate).getTime()) return true;
  return false;
}
