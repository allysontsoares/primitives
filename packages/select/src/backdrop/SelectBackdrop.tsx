import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import type { SelectBackdropProps } from "../types";

export function Backdrop({ style, ...props }: SelectBackdropProps) {
  const { store, config } = useSelectContext();
  const open = useSelectStore(store, (s) => s.open);

  if (!config.modal) {
    return null;
  }

  return (
    <div
      role="presentation"
      aria-hidden="true"
      data-state={open ? "open" : "closed"}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: open ? undefined : "none",
        ...style,
      }}
      {...props}
    />
  );
}
