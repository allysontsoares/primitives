import React, { useCallback } from "react";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";
import type { ComboboxClearProps } from "../types";

export function Clear({ onClick, ...props }: ComboboxClearProps) {
  const { store, config, clearValue, refs } = useComboboxContext();
  const value = useComboboxStore(store, (s) => s.value);
  const inputValue = useComboboxStore(store, (s) => s.inputValue);

  const hasValue = value != null || inputValue.length > 0;

  const handleActivate = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearValue();
      refs.inputRef.current?.focus();
      onClick?.(e as React.MouseEvent<HTMLSpanElement>);
    },
    [clearValue, onClick, refs.inputRef],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        handleActivate(e);
      }
    },
    [handleActivate],
  );

  if (!hasValue || config.disabled || config.readOnly) {
    return null;
  }

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Clear"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
