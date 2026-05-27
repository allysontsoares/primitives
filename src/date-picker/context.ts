import { createContext, useContext } from 'react';
import type { Dispatch } from 'react';
import type { DatePickerState, DatePickerAction } from './reducer';
import type { DatePickerConfig, ViewMode } from '../types';

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
    throw new Error(
      'DatePicker compound components must be rendered inside <DatePicker.Root>.'
    );
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
    throw new Error(
      'DatePicker.View sub-components must be rendered inside <DatePicker.View>.'
    );
  }
  return ctx;
}

// ── Month/Year grid focus contexts ──────────────────────────────────────────

export const MonthGridFocusContext = createContext<number>(-1);
export const YearGridFocusContext = createContext<number>(-1);
