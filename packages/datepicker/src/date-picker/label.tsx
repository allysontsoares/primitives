import React, { useCallback } from "react";
import { createFocusManager } from "@kenos-ui/utils";
import { useDatePickerContext } from "./context";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, onClick, ...props }: LabelProps) {
  const { ids } = useDatePickerContext();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLabelElement>) => {
      onClick?.(event);
      const group = document.getElementById(ids.input) ?? document.getElementById(`${ids.input}-0`);
      if (group) {
        createFocusManager(() => group).focusFirst();
      }
    },
    [ids.input, onClick],
  );

  return (
    <label id={ids.label} htmlFor={ids.input} onClick={handleClick} {...props}>
      {children}
    </label>
  );
}
