import React from "react";
import { useSelectContext } from "../context";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, ...props }: LabelProps) {
  const { ids } = useSelectContext();
  return (
    <label id={ids.label} htmlFor={ids.trigger} {...props}>
      {children}
    </label>
  );
}
