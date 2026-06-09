import React, { useCallback } from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import type { SelectClearTriggerProps } from "../types";

export function ClearTrigger({ onClick, ...props }: SelectClearTriggerProps) {
  const { store, config, clearValue } = useSelectContext();
  const value = useSelectStore(store, (s) => s.value);

  const hasValue = config.multiple ? Array.isArray(value) && value.length > 0 : value != null;

  const handleActivate = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      clearValue();
      onClick?.(e as React.MouseEvent<HTMLSpanElement>);
    },
    [clearValue, onClick],
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
      aria-label="Clear selection"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}
