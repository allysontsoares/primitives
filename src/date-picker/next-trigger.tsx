import React from 'react';
import { useDatePickerContext } from './context';

export type NextTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

export function NextTrigger({ children, onClick, ...props }: NextTriggerProps) {
  const { state, dispatch } = useDatePickerContext();
  const labels: Record<string, string> = {
    day: 'Go to next month',
    month: 'Go to next year',
    year: 'Go to next years',
  };

  return (
    <button
      type="button"
      aria-label={labels[state.view]}
      onClick={(e) => {
        dispatch({ type: 'NAV_NEXT' });
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? '›'}
    </button>
  );
}
