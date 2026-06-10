import React, { useState, useRef, useEffect } from "react";
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

  // Always holds the latest focusedMonth so the year-change effect below can
  // read it without listing it as a dep (which would re-run on every month
  // keyboard navigation and interfere with arrow-key focus).
  const focusedMonthRef = useRef(state.focusedMonth);
  focusedMonthRef.current = state.focusedMonth;

  // Sync focused cell when the user navigates to a different year.
  useEffect(() => {
    setFocusedIndex(focusedMonthRef.current);
  }, [state.focusedYear]);

  // Move DOM focus to the focused cell after state change
  useEffect(() => {
    const focused = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && gridRef.current?.contains(document.activeElement)) {
      focused.focus();
    }
  }, [focusedIndex, state.focusedYear]);

  const rtl = config.dir === "rtl";

  function handleKeyDown(e: React.KeyboardEvent) {
    let next = focusedIndex;
    switch (e.key) {
      case "ArrowRight":
        next = rtl ? Math.max(focusedIndex - 1, 0) : Math.min(focusedIndex + 1, 11);
        break;
      case "ArrowLeft":
        next = rtl ? Math.min(focusedIndex + 1, 11) : Math.max(focusedIndex - 1, 0);
        break;
      case "ArrowDown":
        next = Math.min(focusedIndex + 3, 11);
        break;
      case "ArrowUp":
        next = Math.max(focusedIndex - 3, 0);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 11;
        break;
      case "PageDown":
        dispatch({ type: "NAV_NEXT" });
        e.preventDefault();
        return;
      case "PageUp":
        dispatch({ type: "NAV_PREV" });
        e.preventDefault();
        return;
      case "Escape":
        dispatch({ type: "SET_VIEW", view: "day" });
        e.preventDefault();
        return;
      case "Enter":
      case " ":
        dispatch({ type: "SELECT_MONTH", month: focusedIndex });
        e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
    setFocusedIndex(next);
  }

  return (
    <MonthGridFocusContext.Provider value={focusedIndex}>
      <div
        ref={gridRef}
        role="grid"
        aria-label={String(state.focusedYear)}
        className={className}
        onKeyDown={handleKeyDown}
      >
        {children({ months })}
      </div>
    </MonthGridFocusContext.Provider>
  );
}
