import type { DateGranularity, HourCycle } from "../types";
import { getCLDRWeekStartDay } from "./week-start-data";

export function getWeekStartDay(locale: string, override?: 0 | 1 | 2 | 3 | 4 | 5 | 6): number {
  if (override !== undefined) return override;
  // Intl.Locale.weekInfo differs between Node ICU and browser ICU (SSR hydration mismatch).
  // CLDR region data is deterministic across environments.
  return getCLDRWeekStartDay(locale);
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDateTime(
  date: Date,
  locale: string,
  granularity: DateGranularity,
  hourCycle?: HourCycle,
): string {
  if (granularity === "day") return formatDate(date, locale);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  };
  if (granularity === "minute" || granularity === "second") {
    options.minute = "2-digit";
  }
  if (granularity === "second") {
    options.second = "2-digit";
  }
  if (hourCycle === 12) options.hour12 = true;
  if (hourCycle === 24) options.hour12 = false;

  return new Intl.DateTimeFormat(locale, options).format(date);
}

export type TimeSegment = "hour" | "minute" | "second" | "ampm";

export function getTimeSegments(granularity: DateGranularity, hourCycle: HourCycle): TimeSegment[] {
  if (granularity === "day") return [];
  const segments: TimeSegment[] = ["hour"];
  if (granularity === "minute" || granularity === "second") segments.push("minute");
  if (granularity === "second") segments.push("second");
  if (hourCycle === 12) segments.push("ampm");
  return segments;
}

export function resolveHourCycle(hourCycle: HourCycle | undefined, locale: string): HourCycle {
  if (hourCycle) return hourCycle;
  const formatted = new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(
    new Date(2024, 0, 1, 13),
  );
  return formatted.includes("13") ? 24 : 12;
}

export function formatMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatYear(year: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(new Date(year, 0, 1));
}

export function getMonthNames(
  locale: string,
  format: "long" | "short" | "narrow" = "long",
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: format });
  return Array.from({ length: 12 }, (_, i) => formatter.format(new Date(2024, i, 1)));
}

export function getWeekDayNames(
  locale: string,
  weekStartDay: number,
  format: "long" | "short" | "narrow" = "short",
): Array<{ label: string; ariaLabel: string }> {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const longFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });
  // Jan 5 2025 is a Sunday (getDay() === 0), use as anchor
  const anchor = new Date(2025, 0, 5);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(anchor);
    day.setDate(anchor.getDate() + ((weekStartDay + i) % 7));
    return { label: formatter.format(day), ariaLabel: longFormatter.format(day) };
  });
}

type DateField = "year" | "month" | "day";

function getDateFieldOrder(locale: string): DateField[] {
  const parts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(2024, 0, 15));

  const order: DateField[] = [];
  for (const part of parts) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      order.push(part.type as DateField);
    }
  }
  return order;
}

export interface SegmentInfo {
  order: DateField[];
  separator: string;
}

export function getSegmentInfo(locale: string): SegmentInfo {
  const parts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(2024, 0, 15));

  const order: DateField[] = [];
  let separator = "/";
  for (const part of parts) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      order.push(part.type);
    } else if (part.type === "literal" && part.value.trim()) {
      separator = part.value.trim();
    }
  }
  return { order, separator };
}

export function parseDate(value: string, locale: string): Date | null {
  if (!value.trim()) return null;

  // Parse YYYY-MM-DD as local date (Date.parse treats it as UTC, causing timezone shift)
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoMatch) {
    const d = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    return isNaN(d.getTime()) ? null : d;
  }

  // Locale-aware parsing: detect field order from Intl
  const order = getDateFieldOrder(locale);
  const parts = value.split(/[-/.\s]+/).map(Number);

  if (parts.length < 3 || parts.some(isNaN)) return null;

  const fields: Record<DateField, number> = { year: 0, month: 0, day: 0 };
  order.forEach((field, i) => {
    fields[field] = parts[i] ?? 0;
  });

  const { year, month, day } = fields;
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return null;
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null; // overflow guard (e.g. Feb 30)
  }

  return date;
}
