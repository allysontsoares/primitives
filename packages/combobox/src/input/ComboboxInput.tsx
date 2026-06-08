import React, { useCallback } from "react";
import { useListNavigation } from "@kenos-ui/utils";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "role" | "aria-expanded" | "aria-controls" | "aria-autocomplete" | "value" | "defaultValue"
>;

export function Input({
  onChange,
  onFocus,
  onKeyDown,
  disabled,
  readOnly,
  ...props
}: InputProps) {
  const { store, ids, refs, config, close, selectValue } = useComboboxContext();
  const open = useComboboxStore(store, (s) => s.open);
  const inputValue = useComboboxStore(store, (s) => s.inputValue);
  const highlightedValue = useComboboxStore(store, (s) => s.highlightedValue);
  const items = useComboboxStore(store, (s) => s.items);

  const isDisabled = disabled ?? config.disabled;
  const isReadOnly = readOnly ?? config.readOnly;

  const filteredItems = Array.from(items.values())
    .filter((item) => config.filter(item, inputValue))
    .map((item) => ({
      value: item.value,
      disabled: item.disabled,
    }));

  const { onKeyDown: onNavKeyDown } = useListNavigation({
    enabled: open && !isDisabled && !isReadOnly,
    items: filteredItems,
    highlightedValue,
    onHighlight: (v) => store.setHighlightedValue(v),
    loop: true,
  });

  const activeDescendantId =
    open && highlightedValue != null ? `${ids.content}-opt-${highlightedValue}` : undefined;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!open) {
          store.setOpen(true, "input");
        }
        onNavKeyDown(e);
        onKeyDown?.(e);
        return;
      }

      if (e.key === "Enter" && open && highlightedValue != null) {
        const item = items.get(highlightedValue);
        if (item && !item.disabled) {
          e.preventDefault();
          selectValue(highlightedValue);
        }
        onKeyDown?.(e);
        return;
      }

      if (e.key === "Escape" && open) {
        e.preventDefault();
        e.stopPropagation();
        close();
        onKeyDown?.(e);
        return;
      }

      onKeyDown?.(e);
    },
    [
      open,
      highlightedValue,
      items,
      store,
      onNavKeyDown,
      selectValue,
      close,
      onKeyDown,
    ],
  );

  return (
    <input
      ref={refs.inputRef}
      type="text"
      id={ids.input}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? ids.content : undefined}
      aria-autocomplete="list"
      aria-labelledby={ids.label ? `${ids.label} ${ids.input}` : undefined}
      aria-activedescendant={activeDescendantId}
      aria-disabled={isDisabled || isReadOnly || undefined}
      autoComplete="off"
      data-disabled={isDisabled || isReadOnly ? "true" : undefined}
      data-open={open ? "true" : undefined}
      data-state={open ? "open" : "closed"}
      disabled={isDisabled}
      readOnly={isReadOnly}
      value={inputValue}
      onChange={(e) => {
        if (isDisabled || isReadOnly) return;
        store.setInputValue(e.target.value);
        store.setOpen(true, "input");
        onChange?.(e);
      }}
      onFocus={(e) => {
        if (!isDisabled && !isReadOnly) {
          store.setOpen(true, "input");
        }
        onFocus?.(e);
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}