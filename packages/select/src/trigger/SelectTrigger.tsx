import React from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";

export type TriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-haspopup" | "aria-expanded" | "aria-controls"
> & {
  /**
   * When true, focusing the trigger opens the listbox.
   * Overrides `openOnFocus` on `<Select.Root>` when set.
   */
  openOnFocus?: boolean | undefined;
};

export function Trigger({
  children,
  onClick,
  onFocus,
  disabled,
  openOnFocus: openOnFocusProp,
  ...props
}: TriggerProps) {
  const { store, ids, refs, config } = useSelectContext();
  const open = useSelectStore(store, (s) => s.open);
  const highlightedValue = useSelectStore(store, (s) => s.highlightedValue);

  const isDisabled = disabled ?? config.disabled;
  const isReadOnly = config.readOnly;
  const openOnFocus = openOnFocusProp ?? config.openOnFocus;

  const activeDescendantId =
    open && highlightedValue != null ? `${ids.content}-opt-${highlightedValue}` : undefined;

  return (
    <button
      ref={refs.triggerRef}
      type="button"
      id={ids.trigger}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? ids.content : undefined}
      aria-labelledby={ids.label ? `${ids.label} ${ids.trigger}` : undefined}
      aria-activedescendant={activeDescendantId}
      aria-disabled={isDisabled || isReadOnly || undefined}
      data-disabled={isDisabled || isReadOnly ? "true" : undefined}
      data-open={open ? "true" : undefined}
      data-state={open ? "open" : "closed"}
      disabled={isDisabled || isReadOnly}
      onClick={(e) => {
        if (isDisabled || isReadOnly) return;
        store.setOpen(!open, "trigger");
        onClick?.(e);
      }}
      onFocus={(e) => {
        if (openOnFocus && !isDisabled && !isReadOnly && !open) {
          store.setOpen(true, "trigger");
        }
        onFocus?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
