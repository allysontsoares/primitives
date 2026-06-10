import { getWeekDayNames, getMonthNames } from "./locale";
import type { MonthItem, WeekDayItem } from "../types";

export function buildCalendarGrid(year: number, month: number, weekStartDay: number): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() - weekStartDay + 7) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const rows = offset + totalDays <= 35 ? 5 : 6;

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => new Date(year, month, 1 - offset + row * 7 + col)),
  );
}

export function buildWeekDays(
  locale: string,
  weekStartDay: number,
  format: "long" | "short" | "narrow" = "short",
): WeekDayItem[] {
  return getWeekDayNames(locale, weekStartDay, format);
}

export function buildMonthItems(
  year: number,
  locale: string,
  selectedMonth?: number,
  minDate?: Date,
  maxDate?: Date,
): MonthItem[] {
  const names = getMonthNames(locale, "long");
  const shortNames = getMonthNames(locale, "short");
  return names.map((label, i) => {
    const isDisabled =
      (minDate !== undefined && year < minDate.getFullYear()) ||
      (minDate !== undefined && year === minDate.getFullYear() && i < minDate.getMonth()) ||
      (maxDate !== undefined && year > maxDate.getFullYear()) ||
      (maxDate !== undefined && year === maxDate.getFullYear() && i > maxDate.getMonth());

    return {
      value: i,
      label,
      shortLabel: shortNames[i] ?? label,
      isSelected: selectedMonth === i,
      isDisabled,
    };
  });
}

export function buildYearItems(
  pageStart: number,
  count = 12,
  selectedYear?: number,
  minDate?: Date,
  maxDate?: Date,
): Array<{ value: number; isSelected: boolean; isDisabled: boolean }> {
  return Array.from({ length: count }, (_, i) => {
    const year = pageStart + i;
    const isDisabled =
      (minDate !== undefined && year < minDate.getFullYear()) ||
      (maxDate !== undefined && year > maxDate.getFullYear());
    return { value: year, isSelected: selectedYear === year, isDisabled };
  });
}

export function yearPageStart(year: number): number {
  return Math.floor(year / 12) * 12;
}
