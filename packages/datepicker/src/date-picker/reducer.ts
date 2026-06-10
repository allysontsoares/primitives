import type { DatePickerConfig, ViewMode } from "../types";
import { yearPageStart } from "../utils/calendar";
import {
  isDateDisabled,
  isDateSelectable,
  isSameDay,
  normalizeDateValue,
  rangeSpansUnavailable,
  startOfDay,
} from "../utils/date";
import { formatDate, formatDateTime, parseDate } from "../utils/locale";

export type OpenSource = "trigger" | "input" | null;

export interface DatePickerState {
  open: boolean;
  openSource: OpenSource;
  view: ViewMode;
  focusedMonth: number;
  focusedYear: number;
  focusedDate: Date | null;
  selectedDate: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  selectedDates: Date[];
  inputValue: string;
  yearPageStart: number;
}

export type DatePickerAction =
  | { type: "OPEN"; source?: Exclude<OpenSource, null> }
  | { type: "CLOSE" }
  | { type: "TOGGLE"; source?: Exclude<OpenSource, null> }
  | { type: "SET_VIEW"; view: ViewMode }
  | { type: "NAV_PREV" }
  | { type: "NAV_NEXT" }
  | { type: "NAV_TO_DATE"; date: Date }
  | { type: "FOCUS_DATE"; date: Date; preserveView?: boolean }
  | { type: "SELECT_DATE"; date: Date }
  | { type: "ANCHOR_DATE"; date: Date }
  | { type: "EXTEND_RANGE"; date: Date }
  | { type: "TOGGLE_DATE"; date: Date }
  | { type: "HOVER_DATE"; date: Date | null }
  | { type: "SET_RANGE"; start: Date | null; end: Date | null }
  | { type: "SET_SELECTED_DATE"; date: Date | null }
  | { type: "SET_SELECTED_DATES"; dates: Date[] }
  | { type: "SET_INPUT"; value: string }
  | { type: "COMMIT_INPUT" }
  | { type: "SELECT_MONTH"; month: number }
  | { type: "SELECT_YEAR"; year: number }
  | { type: "YEAR_PAGE_PREV" }
  | { type: "YEAR_PAGE_NEXT" }
  | { type: "CANCEL_RANGE_ANCHOR" };

function shouldCloseOnSelect(
  config: DatePickerConfig,
  mode: DatePickerConfig["mode"],
  rangeComplete = false,
): boolean {
  const c = config.closeOnSelect;
  if (typeof c === "boolean") return c;
  if (mode === "single") return c.single ?? true;
  if (mode === "multiple") return c.multiple ?? false;
  if (mode === "range") {
    const r = c.range ?? false;
    if (r === true || r === "both") return rangeComplete;
    return false;
  }
  return false;
}

function openState(
  state: DatePickerState,
  anchor: Date | null,
  source: Exclude<OpenSource, null> | null = null,
): DatePickerState {
  const ref = anchor ?? startOfDay(new Date());
  return {
    ...state,
    open: true,
    openSource: source,
    view: "day",
    focusedDate: ref,
    focusedMonth: ref.getMonth(),
    focusedYear: ref.getFullYear(),
    yearPageStart: yearPageStart(ref.getFullYear()),
  };
}

function navMonth(state: DatePickerState, delta: number): DatePickerState {
  const d = new Date(state.focusedYear, state.focusedMonth + delta, 1);
  return { ...state, focusedMonth: d.getMonth(), focusedYear: d.getFullYear() };
}

function normalizeSelectionDate(
  date: Date,
  config: DatePickerConfig,
  preserveFrom?: Date | null,
): Date {
  return normalizeDateValue(date, config.granularity, preserveFrom);
}

function formatSelectionValue(date: Date, config: DatePickerConfig): string {
  return config.granularity === "day"
    ? formatDate(date, config.locale)
    : formatDateTime(date, config.locale, config.granularity, config.hourCycle);
}

function canCompleteRange(start: Date, end: Date, config: DatePickerConfig): boolean {
  if (config.allowsNonContiguousRanges) return true;
  return !rangeSpansUnavailable(start, end, config);
}

export function datePickerReducer(
  state: DatePickerState,
  action: DatePickerAction,
  config: DatePickerConfig,
): DatePickerState {
  switch (action.type) {
    case "OPEN":
      if (state.open || config.readOnly) return state;
      return openState(
        state,
        config.placeholderDate ?? state.selectedDate ?? state.rangeStart,
        action.source ?? null,
      );

    case "CLOSE":
      return {
        ...state,
        open: false,
        openSource: null,
        view: "day",
        hoverDate: null,
      };

    case "TOGGLE":
      if (state.open)
        return {
          ...state,
          open: false,
          openSource: null,
          view: "day",
          hoverDate: null,
        };
      if (config.readOnly) return state;
      return openState(
        state,
        config.placeholderDate ?? state.selectedDate ?? state.rangeStart,
        action.source ?? "trigger",
      );

    case "SET_VIEW":
      return { ...state, view: action.view };

    case "NAV_PREV": {
      if (state.view === "day") return navMonth(state, -1);
      if (state.view === "month") return { ...state, focusedYear: state.focusedYear - 1 };
      return { ...state, yearPageStart: state.yearPageStart - 12 };
    }

    case "NAV_NEXT": {
      if (state.view === "day") return navMonth(state, 1);
      if (state.view === "month") return { ...state, focusedYear: state.focusedYear + 1 };
      return { ...state, yearPageStart: state.yearPageStart + 12 };
    }

    case "NAV_TO_DATE": {
      const d = action.date;
      return {
        ...state,
        focusedMonth: d.getMonth(),
        focusedYear: d.getFullYear(),
      };
    }

    case "FOCUS_DATE": {
      const d = action.date;
      if (action.preserveView) {
        return { ...state, focusedDate: d };
      }
      return {
        ...state,
        focusedDate: d,
        focusedMonth: d.getMonth(),
        focusedYear: d.getFullYear(),
      };
    }

    case "SELECT_DATE": {
      const preserveFrom =
        config.mode === "single"
          ? state.selectedDate
          : config.mode === "range"
            ? state.rangeStart
            : null;
      const d = normalizeSelectionDate(action.date, config, preserveFrom);
      if (!isDateSelectable(d, config)) return state;

      if (config.mode === "single") {
        return {
          ...state,
          selectedDate: d,
          inputValue: formatSelectionValue(d, config),
          open: shouldCloseOnSelect(config, "single") ? false : state.open,
          hoverDate: null,
        };
      }

      if (config.mode === "range") {
        if (
          state.rangeEnd &&
          state.rangeStart &&
          (isSameDay(d, state.rangeStart) || isSameDay(d, state.rangeEnd))
        ) {
          return { ...state, rangeStart: d, rangeEnd: null, hoverDate: null };
        }
        if (!state.rangeStart || state.rangeEnd) {
          return { ...state, rangeStart: d, rangeEnd: null, hoverDate: null };
        }
        const [start, end] =
          d.getTime() >= state.rangeStart.getTime() ? [state.rangeStart, d] : [d, state.rangeStart];
        if (!canCompleteRange(start, end, config)) return state;
        return {
          ...state,
          rangeStart: start,
          rangeEnd: end,
          hoverDate: null,
          open: shouldCloseOnSelect(config, "range", true) ? false : state.open,
        };
      }

      if (config.mode === "multiple") {
        const already = state.selectedDates.findIndex((s) => isSameDay(s, d));
        const selectedDates =
          already >= 0
            ? state.selectedDates.filter((_, i) => i !== already)
            : [...state.selectedDates, d];
        return {
          ...state,
          selectedDates,
          open: shouldCloseOnSelect(config, "multiple") ? false : state.open,
        };
      }

      return state;
    }

    case "CANCEL_RANGE_ANCHOR":
      if (!state.rangeStart || state.rangeEnd) return state;
      return { ...state, rangeStart: null, hoverDate: null };

    case "ANCHOR_DATE": {
      const d = normalizeSelectionDate(action.date, config, state.rangeStart);
      if (!isDateSelectable(d, config)) return state;
      return { ...state, rangeStart: d, rangeEnd: null, hoverDate: null };
    }

    case "EXTEND_RANGE": {
      const d = normalizeSelectionDate(action.date, config, state.rangeEnd);
      if (!state.rangeStart || !isDateSelectable(d, config)) return state;
      const [start, end] =
        d.getTime() >= state.rangeStart.getTime() ? [state.rangeStart, d] : [d, state.rangeStart];
      if (!canCompleteRange(start, end, config)) return state;
      return {
        ...state,
        rangeStart: start,
        rangeEnd: end,
        hoverDate: null,
        open: shouldCloseOnSelect(config, "range", true) ? false : state.open,
      };
    }

    case "TOGGLE_DATE": {
      const d = normalizeSelectionDate(action.date, config);
      if (!isDateSelectable(d, config)) return state;
      const already = state.selectedDates.findIndex((s) => isSameDay(s, d));
      const selectedDates =
        already >= 0
          ? state.selectedDates.filter((_, i) => i !== already)
          : [...state.selectedDates, d];
      return { ...state, selectedDates };
    }

    case "HOVER_DATE":
      return {
        ...state,
        hoverDate: action.date ? startOfDay(action.date) : null,
      };

    case "SET_RANGE": {
      const start = action.start ? normalizeSelectionDate(action.start, config) : null;
      const end = action.end ? normalizeSelectionDate(action.end, config, start) : null;
      if (start && end && !canCompleteRange(start, end, config)) return state;
      const anchor = end ?? start;
      return {
        ...state,
        rangeStart: start,
        rangeEnd: end,
        hoverDate: null,
        ...(anchor
          ? {
              focusedDate: anchor,
              focusedMonth: anchor.getMonth(),
              focusedYear: anchor.getFullYear(),
              yearPageStart: yearPageStart(anchor.getFullYear()),
            }
          : {}),
      };
    }

    case "SET_SELECTED_DATES": {
      const selectedDates = action.dates.map((date) => normalizeSelectionDate(date, config));
      const anchor = selectedDates[selectedDates.length - 1];
      return {
        ...state,
        selectedDates,
        ...(anchor
          ? {
              focusedDate: anchor,
              focusedMonth: anchor.getMonth(),
              focusedYear: anchor.getFullYear(),
              yearPageStart: yearPageStart(anchor.getFullYear()),
            }
          : {}),
      };
    }

    case "SET_SELECTED_DATE": {
      const d = action.date
        ? normalizeSelectionDate(action.date, config, state.selectedDate)
        : null;
      return {
        ...state,
        selectedDate: d,
        inputValue: d ? formatSelectionValue(d, config) : "",
        ...(d
          ? {
              focusedDate: d,
              focusedMonth: d.getMonth(),
              focusedYear: d.getFullYear(),
              yearPageStart: yearPageStart(d.getFullYear()),
            }
          : {}),
      };
    }

    case "SET_INPUT":
      return { ...state, inputValue: action.value };

    case "COMMIT_INPUT": {
      const parsed = parseDate(state.inputValue, config.locale);
      if (!parsed || isDateDisabled(parsed, config)) return { ...state, inputValue: "" };
      const d = normalizeSelectionDate(parsed, config, state.selectedDate);
      return {
        ...state,
        selectedDate: d,
        focusedDate: d,
        focusedMonth: d.getMonth(),
        focusedYear: d.getFullYear(),
        open: false,
      };
    }

    case "SELECT_MONTH":
      return { ...state, focusedMonth: action.month, view: "day" };

    case "SELECT_YEAR":
      return {
        ...state,
        focusedYear: action.year,
        yearPageStart: yearPageStart(action.year),
        view: "month",
      };

    case "YEAR_PAGE_PREV":
      return { ...state, yearPageStart: state.yearPageStart - 12 };

    case "YEAR_PAGE_NEXT":
      return { ...state, yearPageStart: state.yearPageStart + 12 };

    default:
      return state;
  }
}

export function createInitialState(config: {
  selectedDate?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  selectedDates?: Date[];
  open?: boolean;
  locale: string;
  granularity?: DatePickerConfig["granularity"];
  hourCycle?: DatePickerConfig["hourCycle"];
  placeholderDate?: Date;
}): DatePickerState {
  const granularity = config.granularity ?? "day";
  const hourCycle = config.hourCycle ?? 24;
  const ref =
    config.selectedDate ??
    config.rangeStart ??
    config.selectedDates?.[0] ??
    config.placeholderDate ??
    new Date();
  return {
    open: config.open ?? false,
    openSource: null,
    view: "day",
    focusedMonth: ref.getMonth(),
    focusedYear: ref.getFullYear(),
    focusedDate: config.open ? startOfDay(ref) : null,
    selectedDate: config.selectedDate ?? null,
    rangeStart: config.rangeStart ?? null,
    rangeEnd: config.rangeEnd ?? null,
    hoverDate: null,
    selectedDates: config.selectedDates ?? [],
    inputValue: config.selectedDate
      ? granularity === "day"
        ? formatDate(config.selectedDate, config.locale)
        : formatDateTime(config.selectedDate, config.locale, granularity, hourCycle)
      : "",
    yearPageStart: yearPageStart(ref.getFullYear()),
  };
}
