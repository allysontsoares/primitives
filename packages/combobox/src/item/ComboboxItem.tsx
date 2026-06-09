import React, { useRef, useLayoutEffect, useCallback } from "react";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";
import { useComboboxCollection } from "../collection-context";

export interface ItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: string;
  disabled?: boolean | undefined;
  textValue?: string | undefined;
}

Item.displayName = "Combobox.Item";

export function Item({
  value,
  disabled = false,
  textValue,
  children,
  onClick,
  onPointerMove,
  style,
  ...props
}: ItemProps) {
  const { store, ids, config, selectValue } = useComboboxContext();
  const selectedValue = useComboboxStore(store, (s) => s.value);
  const highlightedValue = useComboboxStore(store, (s) => s.highlightedValue);
  const { filteredItems } = useComboboxCollection();
  const liRef = useRef<HTMLLIElement>(null);

  const isVisible = filteredItems.some((item) => item.value === value);
  const isSelected =
    typeof selectedValue === "string" && config.isItemEqualToValue(selectedValue, value);
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
      aria-hidden={!isVisible ? true : undefined}
      data-highlighted={isHighlighted ? "true" : undefined}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-hidden={!isVisible ? "true" : undefined}
      tabIndex={-1}
      style={{
        ...style,
        display: isVisible ? style?.display : "none",
      }}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      {...props}
    >
      {children}
    </li>
  );
}
