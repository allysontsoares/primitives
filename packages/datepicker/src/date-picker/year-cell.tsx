import React, { useContext } from "react";
import { useDatePickerContext } from "./context";
import { YearGridFocusContext } from "./context";
import { preventGridScrollOnKeyDown } from "../utils/grid-keyboard";

export interface YearCellProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-selected" | "aria-disabled"
> {
  value: number;
}

export function YearCell({ value, children, onClick, onKeyDown, ...props }: YearCellProps) {
  const { dispatch } = useDatePickerContext();
  const focusedYear = useContext(YearGridFocusContext);
  const isFocused = focusedYear === value;

  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={isFocused}
      tabIndex={isFocused ? 0 : -1}
      data-selected={isFocused || undefined}
      onClick={(e) => {
        dispatch({ type: "SELECT_YEAR", year: value });
        onClick?.(e);
      }}
      onKeyDown={(e) => {
        preventGridScrollOnKeyDown(e);
        onKeyDown?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
