import type { DatePickerConfig, ViewMode } from "../types";
import { yearPageStart } from "../utils/calendar";
import { isDateDisabled, isSameDay, startOfDay } from "../utils/date";
import { formatDate, parseDate } from "../utils/locale";

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
  | { type: "FOCUS_DATE"; date: Date }
  | { type: "SELECT_DATE"; date: Date }
  | { type: "ANCHOR_DATE"; date: Date }
  | { type: "EXTEND_RANGE"; date: Date }
  | { type: "TOGGLE_DATE"; date: Date }
  | { type: "HOVER_DATE"; date: Date | null }
  | { type: "SET_RANGE"; start: Date | null; end: Date | null }
  | { type: "SET_INPUT"; value: string }
  | { type: "COMMIT_INPUT" }
  | { type: "SELECT_MONTH"; month: number }
  | { type: "SELECT_YEAR"; year: number }
  | { type: "YEAR_PAGE_PREV" }
  | { type: "YEAR_PAGE_NEXT" };

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

export function datePickerReducer(
  state: DatePickerState,
  action: DatePickerAction,
  config: DatePickerConfig,
): DatePickerState {
  switch (action.type) {
    case "OPEN":
      if (state.open || config.readOnly) return state;
      return openState(state, state.selectedDate ?? state.rangeStart, action.source ?? null);

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
      return openState(state, state.selectedDate ?? state.rangeStart, action.source ?? "trigger");

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
      return {
        ...state,
        focusedDate: d,
        focusedMonth: d.getMonth(),
        focusedYear: d.getFullYear(),
      };
    }

    case "SELECT_DATE": {
      const d = startOfDay(action.date);
      if (isDateDisabled(d, config)) return state;

      if (config.mode === "single") {
        return {
          ...state,
          selectedDate: d,
          inputValue: formatDate(d, config.locale),
          open: config.closeOnSelect ? false : state.open,
          hoverDate: null,
        };
      }

      if (config.mode === "range") {
        // First click: anchor. Second click: complete range.
        if (!state.rangeStart || state.rangeEnd) {
          return { ...state, rangeStart: d, rangeEnd: null, hoverDate: null };
        }
        const [start, end] =
          d.getTime() >= state.rangeStart.getTime() ? [state.rangeStart, d] : [d, state.rangeStart];
        return {
          ...state,
          rangeStart: start,
          rangeEnd: end,
          hoverDate: null,
          open: config.closeOnSelect ? false : state.open,
        };
      }

      if (config.mode === "multiple") {
        const already = state.selectedDates.findIndex((s) => isSameDay(s, d));
        const selectedDates =
          already >= 0
            ? state.selectedDates.filter((_, i) => i !== already)
            : [...state.selectedDates, d];
        return { ...state, selectedDates };
      }

      return state;
    }

    case "ANCHOR_DATE": {
      const d = startOfDay(action.date);
      if (isDateDisabled(d, config)) return state;
      return { ...state, rangeStart: d, rangeEnd: null, hoverDate: null };
    }

    case "EXTEND_RANGE": {
      const d = startOfDay(action.date);
      if (!state.rangeStart || isDateDisabled(d, config)) return state;
      const [start, end] =
        d.getTime() >= state.rangeStart.getTime() ? [state.rangeStart, d] : [d, state.rangeStart];
      return {
        ...state,
        rangeStart: start,
        rangeEnd: end,
        hoverDate: null,
        open: config.closeOnSelect ? false : state.open,
      };
    }

    case "TOGGLE_DATE": {
      const d = startOfDay(action.date);
      if (isDateDisabled(d, config)) return state;
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
      const start = action.start ? startOfDay(action.start) : null;
      const end = action.end ? startOfDay(action.end) : null;
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

    case "SET_INPUT":
      return { ...state, inputValue: action.value };

    case "COMMIT_INPUT": {
      const parsed = parseDate(state.inputValue, config.locale);
      if (!parsed || isDateDisabled(parsed, config)) return { ...state, inputValue: "" };
      const d = startOfDay(parsed);
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
}): DatePickerState {
  const ref = config.selectedDate ?? config.rangeStart ?? new Date();
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
    inputValue: config.selectedDate ? formatDate(config.selectedDate, config.locale) : "",
    yearPageStart: yearPageStart(ref.getFullYear()),
  };
}
