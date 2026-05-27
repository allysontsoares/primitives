import React from 'react';
import { useDatePickerContext } from './context';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, ...props }: LabelProps) {
  const { ids } = useDatePickerContext();
  return (
    <label id={ids.label} htmlFor={ids.input} {...props}>
      {children}
    </label>
  );
}
