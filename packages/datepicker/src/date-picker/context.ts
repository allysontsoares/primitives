import { createContext, useContext } from "react";
import type { Dispatch, MutableRefObject } from "react";
import type { DatePickerState, DatePickerAction } from "./reducer";
import type { DatePickerConfig, ViewMode } from "../types";

export interface DatePickerContextValue {
  state: DatePickerState;
  dispatch: Dispatch<DatePickerAction>;
  config: DatePickerConfig;
  ids: {
    root: string;
    label: string;
    input: string;
    trigger: string;
    content: string;
  };
}

export const DatePickerContext = createContext<DatePickerContextValue | null>(null);

export function useDatePickerContext(): DatePickerContextValue {
  const ctx = useContext(DatePickerContext);
  if (!ctx) {
    throw new Error("DatePicker compound components must be rendered inside <DatePicker.Root>.");
  }
  return ctx;
}

export interface DatePickerViewContextValue {
  view: ViewMode;
}

export const DatePickerViewContext = createContext<DatePickerViewContextValue | null>(null);

export function useDatePickerViewContext(): DatePickerViewContextValue {
  const ctx = useContext(DatePickerViewContext);
  if (!ctx) {
    throw new Error("DatePicker.View sub-components must be rendered inside <DatePicker.View>.");
  }
  return ctx;
}

// ── Month/Year grid focus contexts ──────────────────────────────────────────

export const MonthGridFocusContext = createContext<number>(-1);
export const YearGridFocusContext = createContext<number>(-1);

// ── Range drag (mouse/pen) ───────────────────────────────────────────────────
// Shared, render-free state so day cells can coordinate a press-and-drag range
// selection across cells (each <Day> is a separate component instance).
export interface RangeDragState {
  /** The cell where the press started, or null when no press is in progress. */
  startDate: Date | null;
  /** Becomes true once the pointer moves onto a different cell (a real drag). */
  active: boolean;
}

export const RangeDragContext = createContext<MutableRefObject<RangeDragState> | null>(null);
