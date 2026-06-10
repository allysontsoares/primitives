import { isSameDay } from "./date";

export function formatDayAriaLabel(
  date: Date,
  locale: string,
  options: {
    isSelected?: boolean;
    isToday?: boolean;
    isUnavailable?: boolean;
    isOutsideMonth?: boolean;
  } = {},
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  let label = formatter.format(date);

  if (options.isToday) {
    label = options.isSelected ? `Today, ${label}, selected` : `Today, ${label}`;
  } else if (options.isSelected) {
    label = `${label}, selected`;
  }

  if (options.isUnavailable) {
    label = `${label}, unavailable`;
  }

  if (options.isOutsideMonth) {
    label = `${label}, outside current month`;
  }

  return label;
}

export function formatSelectedDateDescription(date: Date | null, locale: string): string {
  if (!date) return "";
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
}

export function isSameDayOrNull(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return isSameDay(a, b);
}
