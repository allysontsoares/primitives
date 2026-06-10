import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { focusWithoutScrolling, useGridNavigation } from "@kenos-ui/utils";
import type { GridNavigationKey } from "@kenos-ui/utils";
import { useDatePickerContext, RangeDragContext, type RangeDragState } from "./context";
import { buildCalendarGrid } from "../utils/calendar";
import { getWeekStartDay, formatMonthYear } from "../utils/locale";
import { addMonths, findNextFocusableDate, isSameDay, isSameMonth } from "../utils/date";
import { preventGridScrollOnKeyDown } from "../utils/grid-keyboard";
import { Day } from "./day";

export interface GridProps {
  children?: (ctx: { weeks: Date[][] }) => React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

function defaultRender(ws: Date[][]) {
  return ws.map((week, wi) => (
    <tr key={wi}>
      {week.map((day, di) => (
        <Day key={di} date={day} />
      ))}
    </tr>
  ));
}

export function Grid({ children, header, className }: GridProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const gridRef = useRef<HTMLTableElement>(null);
  const rangeDragRef = useRef<RangeDragState>({ startDate: null, active: false });

  const weekStartDay = getWeekStartDay(config.locale, config.weekStartsOn);
  const weeks = buildCalendarGrid(state.focusedYear, state.focusedMonth, weekStartDay);
  const flatDates = useMemo(() => weeks.flat(), [weeks]);
  const label = formatMonthYear(new Date(state.focusedYear, state.focusedMonth, 1), config.locale);
  const rtl = config.dir === "rtl";

  const focusedIndex = useMemo(() => {
    if (!state.focusedDate) return 0;
    const idx = flatDates.findIndex((d) => isSameDay(d, state.focusedDate));
    return idx >= 0 ? idx : 0;
  }, [flatDates, state.focusedDate]);

  const onFocusedIndexChange = useCallback(
    (index: number) => {
      const date = flatDates[index];
      if (date) dispatch({ type: "FOCUS_DATE", date });
    },
    [flatDates, dispatch],
  );

  const getNextIndex = useCallback(
    (current: number, key: GridNavigationKey): number | null => {
      const date = flatDates[current] ?? state.focusedDate;
      if (!date) return null;

      let nextDate: Date;
      switch (key) {
        case "ArrowRight":
          nextDate = findNextFocusableDate(date, rtl ? -1 : 1, config);
          break;
        case "ArrowLeft":
          nextDate = findNextFocusableDate(date, rtl ? 1 : -1, config);
          break;
        case "ArrowDown":
          nextDate = findNextFocusableDate(date, 7, config);
          break;
        case "ArrowUp":
          nextDate = findNextFocusableDate(date, -7, config);
          break;
        case "Home": {
          const d = new Date(date);
          const diff = (d.getDay() - weekStartDay + 7) % 7;
          nextDate = findNextFocusableDate(d, -diff || 0, config);
          break;
        }
        case "End": {
          const d = new Date(date);
          const diff = (weekStartDay + 6 - d.getDay() + 7) % 7;
          nextDate = findNextFocusableDate(d, diff || 0, config);
          break;
        }
        default:
          return null;
      }

      const idx = flatDates.findIndex((d) => isSameDay(d, nextDate));
      if (idx >= 0) return idx;

      // Target falls outside the visible grid (crossing a month boundary).
      // Navigate directly to the date — FOCUS_DATE recomputes focusedMonth/Year,
      // re-rendering the grid on the new month, and the focus effect moves DOM
      // focus to the new cell. Return null so the hook treats it as handled.
      dispatch({ type: "FOCUS_DATE", date: nextDate });
      return null;
    },
    [flatDates, state.focusedDate, rtl, config, weekStartDay, dispatch],
  );

  const focusDateByPage = useCallback(
    (deltaMonths: number) => {
      if (!state.focusedDate) return;
      const next = addMonths(state.focusedDate, deltaMonths);
      const visibleMonth = new Date(state.focusedYear, state.focusedMonth, 1);
      const inVisibleGrid = flatDates.some((d) => isSameDay(d, next));

      if (config.pageBehavior === "single" && inVisibleGrid) {
        dispatch({ type: "FOCUS_DATE", date: next, preserveView: true });
        return;
      }

      if (!isSameMonth(next, visibleMonth)) {
        dispatch({ type: deltaMonths < 0 ? "NAV_PREV" : "NAV_NEXT" });
      }
      dispatch({ type: "FOCUS_DATE", date: next });
    },
    [
      state.focusedDate,
      state.focusedYear,
      state.focusedMonth,
      flatDates,
      config.pageBehavior,
      dispatch,
    ],
  );

  const { onKeyDown } = useGridNavigation({
    columns: 7,
    itemCount: flatDates.length,
    focusedIndex,
    direction: config.dir,
    onFocusedIndexChange,
    getNextIndex: (current, key) => getNextIndex(current, key),
    onPageUp: (event) => {
      if (!state.focusedDate) return;
      if (event?.shiftKey) {
        dispatch({ type: "FOCUS_DATE", date: addMonths(state.focusedDate, -12) });
      } else {
        focusDateByPage(-1);
      }
    },
    onPageDown: (event) => {
      if (!state.focusedDate) return;
      if (event?.shiftKey) {
        dispatch({ type: "FOCUS_DATE", date: addMonths(state.focusedDate, 12) });
      } else {
        focusDateByPage(1);
      }
    },
    onSelect: () => {
      if (state.focusedDate) dispatch({ type: "SELECT_DATE", date: state.focusedDate });
    },
    enabled: Boolean(state.focusedDate),
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableElement>) => {
      preventGridScrollOnKeyDown(e);
      if (!state.focusedDate) return;
      if (e.key === "Escape") {
        if (config.mode === "range" && state.rangeStart && !state.rangeEnd) {
          e.preventDefault();
          e.stopPropagation();
          dispatch({ type: "CANCEL_RANGE_ANCHOR" });
        }
        return;
      }
      onKeyDown(e);
    },
    [state.focusedDate, config.mode, state.rangeStart, state.rangeEnd, dispatch, onKeyDown],
  );

  const focusedDateStr = state.focusedDate?.toDateString();
  useEffect(() => {
    if (!gridRef.current || !focusedDateStr) return;
    if (document.activeElement?.getAttribute("role") === "spinbutton") return;
    if (state.openSource === "input" && !gridRef.current.contains(document.activeElement)) {
      return;
    }
    const focused = gridRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && document.activeElement !== focused) {
      focusWithoutScrolling(focused);
    }
  }, [focusedDateStr, state.openSource]);

  const ariaMulti = config.mode === "range" || config.mode === "multiple" ? true : undefined;

  return (
    <table
      ref={gridRef}
      role="grid"
      aria-label={label}
      aria-readonly={config.readOnly || undefined}
      aria-multiselectable={ariaMulti}
      className={className}
      onKeyDownCapture={handleKeyDown}
    >
      <RangeDragContext.Provider value={rangeDragRef}>
        {header && <thead>{header}</thead>}
        <tbody>{children ? children({ weeks }) : defaultRender(weeks)}</tbody>
      </RangeDragContext.Provider>
    </table>
  );
}
