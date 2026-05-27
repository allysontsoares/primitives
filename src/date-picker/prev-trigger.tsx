import React from 'react';
import { useDatePickerContext } from './context';

export type PrevTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

export function PrevTrigger({ children, onClick, ...props }: PrevTriggerProps) {
  const { state, dispatch } = useDatePickerContext();
  const labels: Record<string, string> = {
    day: 'Go to previous month',
    month: 'Go to previous year',
    year: 'Go to previous years',
  };

  return (
    <button
      type="button"
      aria-label={labels[state.view]}
      onClick={(e) => {
        dispatch({ type: 'NAV_PREV' });
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? '‹'}
    </button>
  );
}
