import React, { useState, useRef, useEffect, useCallback } from "react";
import { focusWithoutScrolling, useGridNavigation } from "@kenos-ui/utils";
import { useDatePickerContext } from "./context";
import { YearGridFocusContext } from "./context";
import { buildYearItems } from "../utils/calendar";

export interface YearItem {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface YearGridProps {
  children: (ctx: { years: YearItem[] }) => React.ReactNode;
  className?: string;
}

export function YearGrid({ children, className }: YearGridProps) {
  const { state, config, dispatch } = useDatePickerContext();
  const years = buildYearItems(
    state.yearPageStart,
    12,
    state.focusedYear,
    config.minDate,
    config.maxDate,
  );

  const pageStart = state.yearPageStart;
  const [focusedIndex, setFocusedIndex] = useState(state.focusedYear - pageStart);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inPage =
      state.focusedYear >= state.yearPageStart && state.focusedYear < state.yearPageStart + 12;
    if (inPage) {
      setFocusedIndex(state.focusedYear - state.yearPageStart);
    } else {
      setFocusedIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-check when page changes
  }, [state.yearPageStart]);

  useEffect(() => {
    const focused = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && gridRef.current?.contains(document.activeElement)) {
      focusWithoutScrolling(focused);
    }
  }, [focusedIndex, state.yearPageStart]);

  const { onKeyDown } = useGridNavigation({
    columns: 4,
    itemCount: 12,
    focusedIndex,
    direction: config.dir,
    onFocusedIndexChange: setFocusedIndex,
    isItemDisabled: (index) => years[index]?.isDisabled ?? false,
    onPageUp: () => dispatch({ type: "YEAR_PAGE_PREV" }),
    onPageDown: () => dispatch({ type: "YEAR_PAGE_NEXT" }),
    onEscape: () => dispatch({ type: "SET_VIEW", view: "month" }),
    onSelect: (index) => dispatch({ type: "SELECT_YEAR", year: pageStart + index }),
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown(e);
    },
    [onKeyDown],
  );

  return (
    <YearGridFocusContext.Provider value={pageStart + focusedIndex}>
      <div
        ref={gridRef}
        role="grid"
        aria-label={`${state.yearPageStart}–${state.yearPageStart + 11}`}
        className={className}
        onKeyDownCapture={handleKeyDown}
      >
        {children({ years })}
      </div>
    </YearGridFocusContext.Provider>
  );
}
