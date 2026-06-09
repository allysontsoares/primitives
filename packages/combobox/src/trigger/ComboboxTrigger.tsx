import React from "react";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";

export type TriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-expanded" | "aria-controls"
>;

export function Trigger({ children, onClick, disabled, ...props }: TriggerProps) {
  const { store, ids, refs, config } = useComboboxContext();
  const open = useComboboxStore(store, (s) => s.open);

  const isDisabled = disabled ?? config.disabled;
  const isReadOnly = config.readOnly;

  return (
    <button
      ref={refs.triggerRef}
      type="button"
      id={ids.trigger}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? ids.content : undefined}
      aria-label="Toggle suggestions"
      aria-disabled={isDisabled || isReadOnly || undefined}
      data-disabled={isDisabled || isReadOnly ? "true" : undefined}
      data-open={open ? "true" : undefined}
      data-state={open ? "open" : "closed"}
      disabled={isDisabled || isReadOnly}
      tabIndex={-1}
      onClick={(e) => {
        if (isDisabled || isReadOnly) return;
        store.setOpen(!open, "trigger");
        refs.inputRef.current?.focus();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
