import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";

export interface ItemIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The item value to check — reads from the nearest Item when not provided. */
  value?: string | undefined;
}

/**
 * Renders only when the parent item is selected.
 * Wrap a checkmark or any indicator icon as children.
 */
export function ItemIndicator({ value, children, style, ...props }: ItemIndicatorProps) {
  const { store } = useSelectContext();
  const selectedValue = useSelectStore(store, (s) => s.value);

  const isSelected = value != null ? selectedValue === value : false;

  return (
    <span
      aria-hidden="true"
      data-state={isSelected ? "checked" : "unchecked"}
      style={{ visibility: isSelected ? undefined : "hidden", ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
