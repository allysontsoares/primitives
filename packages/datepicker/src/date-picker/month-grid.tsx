import React, { useState, useRef, useEffect, useCallback } from "react";
import { focusWithoutScrolling, useGridNavigation } from "@kenos-ui/utils";
import { useDatePickerContext } from "./context";
import { MonthGridFocusContext } from "./context";
import { buildMonthItems } from "../utils/calendar";
import type { MonthItem } from "../types";

export interface MonthGridProps {
  children: (ctx: { months: MonthItem[] }) => React.ReactNode;
  className?: string;
}

export function MonthGrid({ children, className }: MonthGridProps) {
  const { state, config, dispatch } = useDatePickerContext();
  const months = buildMonthItems(
    state.focusedYear,
    config.locale,
    state.focusedMonth,
    config.minDate,
    config.maxDate,
  );

  const [focusedIndex, setFocusedIndex] = useState(state.focusedMonth);
  const gridRef = useRef<HTMLDivElement>(null);

  const focusedMonthRef = useRef(state.focusedMonth);
  focusedMonthRef.current = state.focusedMonth;

  useEffect(() => {
    setFocusedIndex(focusedMonthRef.current);
  }, [state.focusedYear]);

  useEffect(() => {
    const focused = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && gridRef.current?.contains(document.activeElement)) {
      focusWithoutScrolling(focused);
    }
  }, [focusedIndex, state.focusedYear]);

  const { onKeyDown } = useGridNavigation({
    columns: 3,
    itemCount: 12,
    focusedIndex,
    direction: config.dir,
    onFocusedIndexChange: setFocusedIndex,
    isItemDisabled: (index) => months[index]?.isDisabled ?? false,
    onPageUp: () => dispatch({ type: "NAV_PREV" }),
    onPageDown: () => dispatch({ type: "NAV_NEXT" }),
    onEscape: () => dispatch({ type: "SET_VIEW", view: "day" }),
    onSelect: (index) => dispatch({ type: "SELECT_MONTH", month: index }),
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown(e);
    },
    [onKeyDown],
  );

  return (
    <MonthGridFocusContext.Provider value={focusedIndex}>
      <div
        ref={gridRef}
        role="grid"
        aria-label={String(state.focusedYear)}
        className={className}
        onKeyDownCapture={handleKeyDown}
      >
        {children({ months })}
      </div>
    </MonthGridFocusContext.Provider>
  );
}
