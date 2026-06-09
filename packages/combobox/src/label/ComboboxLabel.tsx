import React from "react";
import { useComboboxContext } from "../context";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, ...props }: LabelProps) {
  const { ids } = useComboboxContext();
  return (
    <label id={ids.label} htmlFor={ids.input} {...props}>
      {children}
    </label>
  );
}
