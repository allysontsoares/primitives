import { describe, it, expect } from "vitest";
import {
  isSameDay,
  isSameMonth,
  isSameYear,
  isAfter,
  isBefore,
  isInRange,
  addDays,
  addMonths,
  addYears,
  daysInMonth,
  clampDate,
  isDateDisabled,
  startOfDay,
} from "../src/utils/date";

describe("isSameDay", () => {
  it("returns true for same date", () => {
    expect(isSameDay(new Date(2024, 0, 15), new Date(2024, 0, 15))).toBe(true);
  });
  it("returns false for different dates", () => {
    expect(isSameDay(new Date(2024, 0, 15), new Date(2024, 0, 16))).toBe(false);
  });
  it("ignores time component", () => {
    expect(isSameDay(new Date(2024, 0, 15, 8), new Date(2024, 0, 15, 22))).toBe(true);
  });
  it("returns false when either is null", () => {
    expect(isSameDay(null, new Date())).toBe(false);
    expect(isSameDay(new Date(), null)).toBe(false);
    expect(isSameDay(null, null)).toBe(false);
  });
});

describe("isSameMonth", () => {
  it("returns true for same month/year", () => {
    expect(isSameMonth(new Date(2024, 5, 1), new Date(2024, 5, 30))).toBe(true);
  });
  it("returns false for different months", () => {
    expect(isSameMonth(new Date(2024, 5, 1), new Date(2024, 6, 1))).toBe(false);
  });
});

describe("isSameYear", () => {
  it("returns true for same year", () => {
    expect(isSameYear(new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(true);
  });
  it("returns false for different years", () => {
    expect(isSameYear(new Date(2024, 0, 1), new Date(2025, 0, 1))).toBe(false);
  });
});

describe("isAfter / isBefore", () => {
  const a = new Date(2024, 0, 10);
  const b = new Date(2024, 0, 20);
  it("isAfter", () => {
    expect(isAfter(b, a)).toBe(true);
    expect(isAfter(a, b)).toBe(false);
  });
  it("isBefore", () => {
    expect(isBefore(a, b)).toBe(true);
    expect(isBefore(b, a)).toBe(false);
  });
});

describe("isInRange", () => {
  const start = new Date(2024, 0, 10);
  const end = new Date(2024, 0, 20);
  it("returns true for dates strictly between start and end", () => {
    expect(isInRange(new Date(2024, 0, 15), start, end)).toBe(true);
  });
  it("returns false for start and end themselves (exclusive)", () => {
    expect(isInRange(start, start, end)).toBe(false);
    expect(isInRange(end, start, end)).toBe(false);
  });
  it("returns false when outside range", () => {
    expect(isInRange(new Date(2024, 0, 5), start, end)).toBe(false);
    expect(isInRange(new Date(2024, 0, 25), start, end)).toBe(false);
  });
  it("handles reversed start/end", () => {
    expect(isInRange(new Date(2024, 0, 15), end, start)).toBe(true);
  });
  it("returns false when start or end is null", () => {
    expect(isInRange(new Date(), null, end)).toBe(false);
    expect(isInRange(new Date(), start, null)).toBe(false);
  });
});

describe("addDays", () => {
  it("adds positive days", () => {
    const result = addDays(new Date(2024, 0, 30), 3);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(2);
  });
  it("subtracts when negative", () => {
    const result = addDays(new Date(2024, 1, 1), -1);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(31);
  });
});

describe("addMonths", () => {
  it("adds months correctly", () => {
    const result = addMonths(new Date(2024, 0, 15), 2);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(15);
  });
  it("clamps to last day when target month is shorter", () => {
    const result = addMonths(new Date(2024, 0, 31), 1);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(29); // 2024 is a leap year
  });
  it("handles year rollover", () => {
    const result = addMonths(new Date(2024, 11, 15), 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(0);
  });
});

describe("addYears", () => {
  it("adds years correctly", () => {
    const result = addYears(new Date(2024, 5, 15), 2);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });
});

describe("daysInMonth", () => {
  it("returns correct days for each month", () => {
    expect(daysInMonth(2024, 0)).toBe(31); // Jan
    expect(daysInMonth(2024, 1)).toBe(29); // Feb (leap year)
    expect(daysInMonth(2023, 1)).toBe(28); // Feb (non-leap)
    expect(daysInMonth(2024, 3)).toBe(30); // Apr
  });
});

describe("clampDate", () => {
  const min = new Date(2024, 0, 1);
  const max = new Date(2024, 11, 31);
  it("returns date when within range", () => {
    const d = new Date(2024, 5, 15);
    expect(clampDate(d, min, max)).toBe(d);
  });
  it("clamps to min", () => {
    expect(clampDate(new Date(2023, 11, 31), min, max)).toBe(min);
  });
  it("clamps to max", () => {
    expect(clampDate(new Date(2025, 0, 1), min, max)).toBe(max);
  });
});

describe("isDateDisabled", () => {
  it("returns true when disabled is true", () => {
    expect(isDateDisabled(new Date(), { disabled: true })).toBe(true);
  });
  it("returns true when disabled function returns true", () => {
    const weekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    expect(isDateDisabled(new Date(2024, 0, 6), { disabled: weekend })).toBe(true); // Saturday
    expect(isDateDisabled(new Date(2024, 0, 8), { disabled: weekend })).toBe(false); // Monday
  });
  it("returns true when before minDate", () => {
    const minDate = new Date(2024, 5, 1);
    expect(isDateDisabled(new Date(2024, 4, 31), { minDate })).toBe(true);
    expect(isDateDisabled(new Date(2024, 5, 1), { minDate })).toBe(false);
  });
  it("returns true when after maxDate", () => {
    const maxDate = new Date(2024, 5, 30);
    expect(isDateDisabled(new Date(2024, 6, 1), { maxDate })).toBe(true);
    expect(isDateDisabled(new Date(2024, 5, 30), { maxDate })).toBe(false);
  });
  it("returns false with no restrictions", () => {
    expect(isDateDisabled(new Date(), {})).toBe(false);
  });
});

describe("startOfDay", () => {
  it("strips time from date", () => {
    const d = new Date(2024, 5, 15, 14, 30, 59, 999);
    const s = startOfDay(d);
    expect(s.getHours()).toBe(0);
    expect(s.getMinutes()).toBe(0);
    expect(s.getSeconds()).toBe(0);
    expect(s.getMilliseconds()).toBe(0);
    expect(s.getDate()).toBe(15);
  });
});
