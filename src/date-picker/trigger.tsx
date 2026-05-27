import React from 'react';
import { useDatePickerContext } from './context';

export type TriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-haspopup' | 'aria-expanded' | 'aria-controls'
>;

export function Trigger({ children, onClick, ...props }: TriggerProps) {
  const { state, dispatch, ids } = useDatePickerContext();

  return (
    <button
      type="button"
      id={ids.trigger}
      aria-haspopup="dialog"
      aria-expanded={state.open}
      aria-controls={ids.content}
      aria-label={children ? undefined : 'Open date picker'}
      onClick={(e) => {
        dispatch({ type: 'TOGGLE', source: 'trigger' });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
