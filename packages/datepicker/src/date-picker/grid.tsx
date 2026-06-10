import React, { useRef, useEffect } from "react";
import { focusWithoutScrolling } from "@kenos-ui/utils";
import { useDatePickerContext } from "./context";
import { buildCalendarGrid } from "../utils/calendar";
import { getWeekStartDay, formatMonthYear } from "../utils/locale";
import { addMonths, findNextFocusableDate } from "../utils/date";
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

  const weekStartDay = getWeekStartDay(config.locale, config.weekStartsOn);
  const weeks = buildCalendarGrid(state.focusedYear, state.focusedMonth, weekStartDay);
  const label = formatMonthYear(new Date(state.focusedYear, state.focusedMonth, 1), config.locale);
  const rtl = config.dir === "rtl";

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableElement>) {
    if (!state.focusedDate) return;

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(state.focusedDate, rtl ? -1 : 1, config),
        });
        return;
      }
      case "ArrowLeft": {
        e.preventDefault();
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(state.focusedDate, rtl ? 1 : -1, config),
        });
        return;
      }
      case "ArrowDown": {
        e.preventDefault();
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(state.focusedDate, 7, config),
        });
        return;
      }
      case "ArrowUp": {
        e.preventDefault();
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(state.focusedDate, -7, config),
        });
        return;
      }
      case "PageDown":
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({
            type: "FOCUS_DATE",
            date: addMonths(state.focusedDate, 12),
          });
        } else {
          dispatch({ type: "NAV_NEXT" });
        }
        return;
      case "PageUp":
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({
            type: "FOCUS_DATE",
            date: addMonths(state.focusedDate, -12),
          });
        } else {
          dispatch({ type: "NAV_PREV" });
        }
        return;
      case "Home": {
        e.preventDefault();
        const d = new Date(state.focusedDate);
        const diff = (d.getDay() - weekStartDay + 7) % 7;
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(d, -diff || 0, config),
        });
        return;
      }
      case "End": {
        e.preventDefault();
        const d = new Date(state.focusedDate);
        const diff = (weekStartDay + 6 - d.getDay() + 7) % 7;
        dispatch({
          type: "FOCUS_DATE",
          date: findNextFocusableDate(d, diff || 0, config),
        });
        return;
      }
      case "Escape":
        if (config.mode === "range" && state.rangeStart && !state.rangeEnd) {
          e.preventDefault();
          e.stopPropagation();
          dispatch({ type: "CANCEL_RANGE_ANCHOR" });
        }
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        dispatch({ type: "SELECT_DATE", date: state.focusedDate });
        return;
      default:
        return;
    }
  }

  const ariaMulti = config.mode === "range" || config.mode === "multiple" ? true : undefined;

  return (
    <table
      ref={gridRef}
      role="grid"
      aria-label={label}
      aria-readonly={config.readOnly || undefined}
      aria-multiselectable={ariaMulti}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {header && <thead>{header}</thead>}
      <tbody>{children ? children({ weeks }) : defaultRender(weeks)}</tbody>
    </table>
  );
}
