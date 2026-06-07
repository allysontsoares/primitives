import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string | undefined;
}

export function Value({ placeholder = "", ...props }: ValueProps) {
  const { store } = useSelectContext();
  const value = useSelectStore(store, (s) => s.value);
  const items = useSelectStore(store, (s) => s.items);

  const label = value != null ? (items.get(value)?.label ?? value) : null;

  return (
    <span data-placeholder={label == null ? "true" : undefined} {...props}>
      {label ?? placeholder}
    </span>
  );
}
