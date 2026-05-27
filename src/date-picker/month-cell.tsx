import React, { useContext } from 'react';
import { useDatePickerContext } from './context';
import { MonthGridFocusContext } from './context';

export interface MonthCellProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-selected' | 'aria-disabled'> {
  value: number;
}

export function MonthCell({ value, children, onClick, ...props }: MonthCellProps) {
  const { dispatch } = useDatePickerContext();
  const focusedIndex = useContext(MonthGridFocusContext);
  const isFocused = focusedIndex === value;

  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={isFocused}
      tabIndex={isFocused ? 0 : -1}
      data-selected={isFocused || undefined}
      onClick={(e) => {
        dispatch({ type: 'SELECT_MONTH', month: value });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
