import React, { useRef, useLayoutEffect, useCallback } from "react";
import { useSelectContext } from "../context";
import { useSelectStore } from "../store";

export interface ItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: string;
  disabled?: boolean | undefined;
  textValue?: string | undefined;
}

Item.displayName = "Select.Item";

export function Item({
  value,
  disabled = false,
  textValue,
  children,
  onClick,
  onPointerMove,
  ...props
}: ItemProps) {
  const { store, ids, config, selectValue } = useSelectContext();
  const selectedValue = useSelectStore(store, (s) => s.value);
  const highlightedValue = useSelectStore(store, (s) => s.highlightedValue);
  const liRef = useRef<HTMLLIElement>(null);

  const isSelected = config.multiple
    ? Array.isArray(selectedValue) &&
      selectedValue.some((item) => config.isItemEqualToValue(item, value))
    : typeof selectedValue === "string" && config.isItemEqualToValue(selectedValue, value);
  const isHighlighted = highlightedValue === value;
  const isDisabled = disabled || config.disabled || config.readOnly;

  useLayoutEffect(() => {
    const el = liRef.current;
    const label = textValue ?? el?.textContent ?? value;

    store.registerItem({
      value,
      label,
      textValue: textValue ?? label,
      disabled: isDisabled,
      ref: el,
      groupId: null,
    });

    return () => store.unregisterItem(value);
  }, [value, isDisabled, store, textValue, children]);

  useLayoutEffect(() => {
    store.updateItemRef(value, liRef.current);
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      if (isDisabled) return;
      selectValue(value);
      onClick?.(e);
    },
    [isDisabled, selectValue, value, onClick],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLLIElement>) => {
      if (!isDisabled) store.setHighlightedValue(value);
      onPointerMove?.(e);
    },
    [isDisabled, store, value, onPointerMove],
  );

  return (
    <li
      ref={liRef}
      id={`${ids.content}-opt-${value}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      data-highlighted={isHighlighted ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      tabIndex={-1}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </li>
  );
}
