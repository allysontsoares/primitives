import React, { useMemo } from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";
import { resolveItemLabel } from "../utils/labels";

export interface ValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string | undefined;
}

export function Value({ placeholder = "", ...props }: ValueProps) {
  const { store, config } = useSelectContext();
  const value = useSelectStore(store, (s) => s.value);
  const registry = useSelectStore(store, (s) => s.items);

  const label = useMemo(() => {
    if (config.multiple) {
      const values = Array.isArray(value) ? value : [];
      if (values.length === 0) return null;
      return values
        .map((itemValue) => resolveItemLabel(itemValue, registry, config.items))
        .join(", ");
    }

    if (typeof value !== "string") return null;
    return resolveItemLabel(value, registry, config.items);
  }, [config.multiple, config.items, registry, value]);

  return (
    <span data-placeholder={label == null ? "true" : undefined} {...props}>
      {label ?? placeholder}
    </span>
  );
}