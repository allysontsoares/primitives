import { describe, it, expect } from "vitest";
import {
  buildCalendarGrid,
  buildWeekDays,
  buildMonthItems,
  buildYearItems,
  yearPageStart,
} from "../src/utils/calendar";

describe("buildCalendarGrid", () => {
  // Jan 2024: 1st is Monday. weekStartDay=0 (Sunday)
  // offset = (1 - 0 + 7) % 7 = 1 → first cell is Dec 31
  it("generates correct grid for January 2024 (Sunday start)", () => {
    const grid = buildCalendarGrid(2024, 0, 0);
    expect(grid[0]![0]).toEqual(new Date(2023, 11, 31)); // Dec 31
    expect(grid[0]![1]).toEqual(new Date(2024, 0, 1)); // Jan 1
    expect(grid[grid.length - 1]![6]).toEqual(new Date(2024, 1, 3)); // Feb 3
  });

  // Jan 2024: 1st is Monday. weekStartDay=1 (Monday)
  // offset = (1 - 1 + 7) % 7 = 0 → first cell is Jan 1
  it("generates correct grid for January 2024 (Monday start)", () => {
    const grid = buildCalendarGrid(2024, 0, 1);
    expect(grid[0]![0]).toEqual(new Date(2024, 0, 1)); // Jan 1 on Monday
  });

  it("always has 7 columns", () => {
    const grid = buildCalendarGrid(2024, 5, 0);
    for (const week of grid) {
      expect(week).toHaveLength(7);
    }
  });

  it("has 5 rows when month fits (Feb 2021)", () => {
    // Feb 2021: 1st is Monday, weekStart=1 → offset=0, 28 days, 28 <= 35 → 5 rows
    const grid = buildCalendarGrid(2021, 1, 1);
    expect(grid).toHaveLength(5);
  });

  it("has 6 rows when month needs extra row", () => {
    // Oct 2023: 1st is Sunday, weekStart=0 → offset=0, 31 days, 31 > 35? no
    // Mar 2024: 1st is Friday, weekStart=0 → offset=5, 31 days, 36 > 35 → 6 rows
    const grid = buildCalendarGrid(2024, 2, 0);
    expect(grid).toHaveLength(6);
  });

  it("generates consecutive dates with no gaps", () => {
    const grid = buildCalendarGrid(2024, 5, 1);
    const flat = grid.flat();
    for (let i = 1; i < flat.length; i++) {
      const diff = flat[i]!.getTime() - flat[i - 1]!.getTime();
      expect(diff).toBe(86_400_000); // exactly 1 day
    }
  });
});

describe("buildWeekDays", () => {
  it("returns 7 items", () => {
    expect(buildWeekDays("en-US", 0)).toHaveLength(7);
  });

  it("first item is Sunday when weekStartDay=0", () => {
    const days = buildWeekDays("en-US", 0, "long");
    expect(days[0]!.ariaLabel).toBe("Sunday");
  });

  it("first item is Monday when weekStartDay=1", () => {
    const days = buildWeekDays("en-US", 1, "long");
    expect(days[0]!.ariaLabel).toBe("Monday");
  });

  it("each item has label and ariaLabel", () => {
    const days = buildWeekDays("en-US", 0);
    for (const day of days) {
      expect(day.label).toBeTruthy();
      expect(day.ariaLabel).toBeTruthy();
    }
  });
});

describe("buildMonthItems", () => {
  it("returns 12 months", () => {
    expect(buildMonthItems(2024, "en-US")).toHaveLength(12);
  });

  it("marks the selected month", () => {
    const items = buildMonthItems(2024, "en-US", 5);
    expect(items[5]!.isSelected).toBe(true);
    expect(items[0]!.isSelected).toBe(false);
  });

  it("disables months before minDate", () => {
    const items = buildMonthItems(2024, "en-US", undefined, new Date(2024, 5, 1));
    expect(items[4]!.isDisabled).toBe(true); // May
    expect(items[5]!.isDisabled).toBe(false); // June (min month)
  });

  it("disables months after maxDate", () => {
    const items = buildMonthItems(2024, "en-US", undefined, undefined, new Date(2024, 5, 30));
    expect(items[6]!.isDisabled).toBe(true); // July
    expect(items[5]!.isDisabled).toBe(false); // June (max month)
  });
});

describe("buildYearItems", () => {
  it("returns the requested count", () => {
    expect(buildYearItems(2024, 12)).toHaveLength(12);
  });

  it("starts from pageStart", () => {
    const items = buildYearItems(2024, 12);
    expect(items[0]!.value).toBe(2024);
    expect(items[11]!.value).toBe(2035);
  });

  it("marks the selected year", () => {
    const items = buildYearItems(2024, 12, 2026);
    expect(items[2]!.isSelected).toBe(true);
    expect(items[0]!.isSelected).toBe(false);
  });

  it("disables years before minDate", () => {
    const items = buildYearItems(2020, 12, undefined, new Date(2023, 0, 1));
    expect(items[0]!.isDisabled).toBe(true); // 2020
    expect(items[3]!.isDisabled).toBe(false); // 2023
  });

  it("disables years after maxDate", () => {
    const items = buildYearItems(2020, 12, undefined, undefined, new Date(2023, 11, 31));
    expect(items[4]!.isDisabled).toBe(true); // 2024
    expect(items[3]!.isDisabled).toBe(false); // 2023
  });
});

describe("yearPageStart", () => {
  it("returns the floor multiple-of-12 anchor for a given year", () => {
    // 2024 / 12 = 168.6 → 168 * 12 = 2016
    expect(yearPageStart(2024)).toBe(2016);
    expect(yearPageStart(2016)).toBe(2016);
    expect(yearPageStart(2027)).toBe(2016);
    // 2028 / 12 = 169 → 169 * 12 = 2028
    expect(yearPageStart(2028)).toBe(2028);
    expect(yearPageStart(2039)).toBe(2028);
    expect(yearPageStart(2040)).toBe(2040);
  });
});
