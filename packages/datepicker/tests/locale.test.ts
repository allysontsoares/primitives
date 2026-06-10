import { describe, it, expect } from "vitest";
import { getWeekStartDay, getWeekDayNames } from "../src/utils/locale";

describe("getWeekStartDay", () => {
  it("returns override when provided", () => {
    expect(getWeekStartDay("ar-EG", 0)).toBe(0);
    expect(getWeekStartDay("en-US", 1)).toBe(1);
  });

  it("uses CLDR region data for ar-EG (Saturday)", () => {
    expect(getWeekStartDay("ar-EG")).toBe(6);
  });

  it("uses CLDR region data for en-US (Sunday)", () => {
    expect(getWeekStartDay("en-US")).toBe(0);
  });

  it("uses CLDR region data for en-GB (Monday)", () => {
    expect(getWeekStartDay("en-GB")).toBe(1);
  });

  it("uses CLDR region data for ar-SA (Sunday)", () => {
    expect(getWeekStartDay("ar-SA")).toBe(0);
  });
});

describe("getWeekDayNames SSR consistency", () => {
  it("produces identical first weekday label for ar-EG across calls", () => {
    const first = getWeekDayNames("ar-EG", getWeekStartDay("ar-EG"))[0];
    const second = getWeekDayNames("ar-EG", getWeekStartDay("ar-EG"))[0];
    expect(first?.label).toBe(second?.label);
    expect(first?.ariaLabel).toBe(second?.ariaLabel);
  });
});
