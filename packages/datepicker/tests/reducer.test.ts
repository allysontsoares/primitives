import { describe, it, expect } from "vitest";
import {
  datePickerReducer,
  createInitialState,
  type DatePickerState,
} from "../src/date-picker/reducer";
import type { DatePickerConfig } from "../src/types";

import { DEFAULT_MESSAGES } from "../src/utils/messages";

const config: DatePickerConfig = {
  mode: "single",
  locale: "en-US",
  dir: "ltr",
  readOnly: false,
  closeOnSelect: true,
  messages: DEFAULT_MESSAGES,
  modal: false,
};

function state(overrides?: Partial<DatePickerState>): DatePickerState {
  return {
    ...createInitialState({ locale: "en-US" }),
    ...overrides,
  };
}

function reduce(
  s: DatePickerState,
  action: Parameters<typeof datePickerReducer>[1],
  cfg: DatePickerConfig = config,
) {
  return datePickerReducer(s, action, cfg);
}

// ─── OPEN / CLOSE / TOGGLE ───────────────────────────────────────────────────

describe("OPEN", () => {
  it("opens when closed", () => {
    const next = reduce(state({ open: false }), { type: "OPEN" });
    expect(next.open).toBe(true);
    expect(next.view).toBe("day");
  });
  it("is a no-op when already open", () => {
    const s = state({ open: true });
    expect(reduce(s, { type: "OPEN" })).toBe(s);
  });
  it("focuses selectedDate when present", () => {
    const selected = new Date(2024, 5, 15);
    const next = reduce(state({ open: false, selectedDate: selected }), { type: "OPEN" });
    expect(next.focusedMonth).toBe(5);
    expect(next.focusedYear).toBe(2024);
  });
});

describe("CLOSE", () => {
  it("closes when open", () => {
    const next = reduce(state({ open: true }), { type: "CLOSE" });
    expect(next.open).toBe(false);
    expect(next.view).toBe("day");
    expect(next.hoverDate).toBeNull();
  });
});

describe("TOGGLE", () => {
  it("opens when closed", () => {
    expect(reduce(state({ open: false }), { type: "TOGGLE" }).open).toBe(true);
  });
  it("closes when open", () => {
    expect(reduce(state({ open: true }), { type: "TOGGLE" }).open).toBe(false);
  });
});

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

describe("NAV_PREV / NAV_NEXT (day view)", () => {
  it("NAV_PREV decrements month", () => {
    const next = reduce(state({ view: "day", focusedMonth: 5, focusedYear: 2024 }), {
      type: "NAV_PREV",
    });
    expect(next.focusedMonth).toBe(4);
    expect(next.focusedYear).toBe(2024);
  });
  it("NAV_PREV wraps December → January of previous year", () => {
    const next = reduce(state({ view: "day", focusedMonth: 0, focusedYear: 2024 }), {
      type: "NAV_PREV",
    });
    expect(next.focusedMonth).toBe(11);
    expect(next.focusedYear).toBe(2023);
  });
  it("NAV_NEXT increments month", () => {
    const next = reduce(state({ view: "day", focusedMonth: 5, focusedYear: 2024 }), {
      type: "NAV_NEXT",
    });
    expect(next.focusedMonth).toBe(6);
  });
  it("NAV_NEXT wraps December → January of next year", () => {
    const next = reduce(state({ view: "day", focusedMonth: 11, focusedYear: 2024 }), {
      type: "NAV_NEXT",
    });
    expect(next.focusedMonth).toBe(0);
    expect(next.focusedYear).toBe(2025);
  });
});

describe("NAV_PREV / NAV_NEXT (month view)", () => {
  it("decrements/increments year", () => {
    const s = state({ view: "month", focusedYear: 2024 });
    expect(reduce(s, { type: "NAV_PREV" }).focusedYear).toBe(2023);
    expect(reduce(s, { type: "NAV_NEXT" }).focusedYear).toBe(2025);
  });
});

describe("NAV_PREV / NAV_NEXT (year view)", () => {
  it("shifts year page by 12", () => {
    const s = state({ view: "year", yearPageStart: 2024 });
    expect(reduce(s, { type: "NAV_PREV" }).yearPageStart).toBe(2012);
    expect(reduce(s, { type: "NAV_NEXT" }).yearPageStart).toBe(2036);
  });
});

describe("SET_VIEW", () => {
  it("switches to month view", () => {
    expect(reduce(state(), { type: "SET_VIEW", view: "month" }).view).toBe("month");
  });
  it("switches to year view", () => {
    expect(reduce(state(), { type: "SET_VIEW", view: "year" }).view).toBe("year");
  });
});

describe("FOCUS_DATE", () => {
  it("updates focusedDate and navigates the visible month", () => {
    const next = reduce(state(), { type: "FOCUS_DATE", date: new Date(2025, 3, 10) });
    expect(next.focusedMonth).toBe(3);
    expect(next.focusedYear).toBe(2025);
  });
});

// ─── SINGLE SELECTION ────────────────────────────────────────────────────────

describe("SELECT_DATE (single mode)", () => {
  it("sets selectedDate", () => {
    const d = new Date(2024, 5, 15);
    const next = reduce(state({ open: true }), { type: "SELECT_DATE", date: d });
    expect(next.selectedDate?.getDate()).toBe(15);
  });
  it("closes when closeOnSelect=true", () => {
    const next = reduce(state({ open: true }), {
      type: "SELECT_DATE",
      date: new Date(2024, 5, 15),
    });
    expect(next.open).toBe(false);
  });
  it("stays open when closeOnSelect=false", () => {
    const cfg: DatePickerConfig = { ...config, closeOnSelect: false };
    const next = reduce(
      state({ open: true }),
      { type: "SELECT_DATE", date: new Date(2024, 5, 15) },
      cfg,
    );
    expect(next.open).toBe(true);
  });
  it("ignores disabled dates", () => {
    const cfg: DatePickerConfig = { ...config, minDate: new Date(2025, 0, 1) };
    const s = state({ open: true });
    const next = reduce(s, { type: "SELECT_DATE", date: new Date(2024, 5, 15) }, cfg);
    expect(next.selectedDate).toBeNull();
  });
});

// ─── RANGE SELECTION ─────────────────────────────────────────────────────────

describe("SELECT_DATE (range mode)", () => {
  const rangeCfg: DatePickerConfig = { ...config, mode: "range", closeOnSelect: false };

  it("sets rangeStart on first click", () => {
    const next = reduce(
      state({ open: true }),
      {
        type: "SELECT_DATE",
        date: new Date(2024, 5, 10),
      },
      rangeCfg,
    );
    expect(next.rangeStart?.getDate()).toBe(10);
    expect(next.rangeEnd).toBeNull();
  });

  it("sets rangeEnd on second click (date after start)", () => {
    const s = state({ open: true, rangeStart: new Date(2024, 5, 10), rangeEnd: null });
    const next = reduce(s, { type: "SELECT_DATE", date: new Date(2024, 5, 20) }, rangeCfg);
    expect(next.rangeStart?.getDate()).toBe(10);
    expect(next.rangeEnd?.getDate()).toBe(20);
  });

  it("normalizes reversed range (end before start)", () => {
    const s = state({ open: true, rangeStart: new Date(2024, 5, 20), rangeEnd: null });
    const next = reduce(s, { type: "SELECT_DATE", date: new Date(2024, 5, 10) }, rangeCfg);
    expect(next.rangeStart?.getDate()).toBe(10);
    expect(next.rangeEnd?.getDate()).toBe(20);
  });

  it("resets and restarts when a range is already complete", () => {
    const s = state({
      open: true,
      rangeStart: new Date(2024, 5, 10),
      rangeEnd: new Date(2024, 5, 20),
    });
    const next = reduce(s, { type: "SELECT_DATE", date: new Date(2024, 5, 5) }, rangeCfg);
    expect(next.rangeStart?.getDate()).toBe(5);
    expect(next.rangeEnd).toBeNull();
  });
});

// ─── MULTIPLE SELECTION ──────────────────────────────────────────────────────

describe("SELECT_DATE (multiple mode)", () => {
  const multiCfg: DatePickerConfig = { ...config, mode: "multiple" };

  it("adds date to selection", () => {
    const next = reduce(state(), { type: "SELECT_DATE", date: new Date(2024, 5, 15) }, multiCfg);
    expect(next.selectedDates).toHaveLength(1);
  });
  it("removes date when already selected", () => {
    const s = state({ selectedDates: [new Date(2024, 5, 15)] });
    const next = reduce(s, { type: "SELECT_DATE", date: new Date(2024, 5, 15) }, multiCfg);
    expect(next.selectedDates).toHaveLength(0);
  });
});

// ─── HOVER ───────────────────────────────────────────────────────────────────

describe("HOVER_DATE", () => {
  it("sets hoverDate", () => {
    const d = new Date(2024, 5, 15);
    expect(reduce(state(), { type: "HOVER_DATE", date: d }).hoverDate?.getDate()).toBe(15);
  });
  it("clears hoverDate when null", () => {
    const s = state({ hoverDate: new Date(2024, 5, 15) });
    expect(reduce(s, { type: "HOVER_DATE", date: null }).hoverDate).toBeNull();
  });
});

// ─── INPUT ───────────────────────────────────────────────────────────────────

describe("SET_INPUT", () => {
  it("updates inputValue", () => {
    expect(reduce(state(), { type: "SET_INPUT", value: "06/15/2024" }).inputValue).toBe(
      "06/15/2024",
    );
  });
});

describe("COMMIT_INPUT", () => {
  it("parses and selects ISO date from input", () => {
    const s = state({ inputValue: "2024-06-15" });
    const next = reduce(s, { type: "COMMIT_INPUT" });
    expect(next.selectedDate?.getMonth()).toBe(5);
    expect(next.selectedDate?.getDate()).toBe(15);
    expect(next.open).toBe(false);
  });
  it("clears inputValue on invalid input", () => {
    const s = state({ inputValue: "not-a-date" });
    const next = reduce(s, { type: "COMMIT_INPUT" });
    expect(next.selectedDate).toBeNull();
    expect(next.inputValue).toBe("");
  });
});

// ─── MONTH / YEAR VIEWS ──────────────────────────────────────────────────────

describe("SELECT_MONTH", () => {
  it("sets focusedMonth and returns to day view", () => {
    const next = reduce(state({ view: "month" }), { type: "SELECT_MONTH", month: 8 });
    expect(next.focusedMonth).toBe(8);
    expect(next.view).toBe("day");
  });
});

describe("SELECT_YEAR", () => {
  it("sets focusedYear and goes to month view", () => {
    const next = reduce(state({ view: "year" }), { type: "SELECT_YEAR", year: 2030 });
    expect(next.focusedYear).toBe(2030);
    expect(next.view).toBe("month");
  });
});

describe("YEAR_PAGE_PREV / YEAR_PAGE_NEXT", () => {
  it("shifts page by 12", () => {
    const s = state({ yearPageStart: 2024 });
    expect(reduce(s, { type: "YEAR_PAGE_PREV" }).yearPageStart).toBe(2012);
    expect(reduce(s, { type: "YEAR_PAGE_NEXT" }).yearPageStart).toBe(2036);
  });
});

// ─── createInitialState ───────────────────────────────────────────────────────

describe("createInitialState", () => {
  it("starts closed", () => {
    expect(createInitialState({ locale: "en-US" }).open).toBe(false);
  });
  it("formats inputValue when selectedDate is given", () => {
    const s = createInitialState({ locale: "en-US", selectedDate: new Date(2024, 0, 15) });
    expect(s.inputValue).toContain("2024");
  });
  it("uses selectedDate for initial focused month/year", () => {
    const s = createInitialState({ locale: "en-US", selectedDate: new Date(2024, 5, 1) });
    expect(s.focusedMonth).toBe(5);
    expect(s.focusedYear).toBe(2024);
  });
});
