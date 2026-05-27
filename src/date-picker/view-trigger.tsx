import React from 'react';
import { useDatePickerContext } from './context';
import { formatMonthYear, formatYear } from '../utils/locale';
import type { ViewMode } from '../types';

export type ViewTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

const nextView: Record<ViewMode, ViewMode> = {
  day: 'month',
  month: 'year',
  year: 'day',
};

const ariaLabel: Record<ViewMode, string> = {
  day: 'Switch to month view',
  month: 'Switch to year view',
  year: 'Switch to day view',
};

export function ViewTrigger({ children, onClick, ...props }: ViewTriggerProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const label = formatMonthYear(
    new Date(state.focusedYear, state.focusedMonth, 1),
    config.locale
  );
  const yearRange = `${state.yearPageStart}–${state.yearPageStart + 11}`;

  const displayLabel =
    state.view === 'year' ? yearRange : state.view === 'month' ? String(state.focusedYear) : label;

  return (
    <button
      type="button"
      aria-label={ariaLabel[state.view]}
      aria-live="polite"
      onClick={(e) => {
        dispatch({ type: 'SET_VIEW', view: nextView[state.view] });
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? displayLabel}
    </button>
  );
}
