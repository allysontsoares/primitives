import React, { useContext, useRef } from "react";
import { useDatePickerContext, RangeDragContext } from "./context";
import {
  isSameDay,
  isInRange,
  isDateDisabled,
  isDateUnavailable,
  isDateSelectable,
  startOfDay,
} from "../utils/date";
import { formatDayAriaLabel } from "../utils/day-aria";
import { preventGridScrollOnKeyDown } from "../utils/grid-keyboard";
import type { DayCellMeta } from "../types";

export interface DayProps {
  date: Date;
  children?: (meta: DayCellMeta) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Day({ date, children, className, style }: DayProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const dragRef = useContext(RangeDragContext);
  const suppressClickRef = useRef(false);
  const today = startOfDay(new Date());
  const disabled = isDateDisabled(date, config);
  const unavailable = isDateUnavailable(date, config);

  const meta: DayCellMeta = {
    date,
    isCurrentMonth: date.getMonth() === state.focusedMonth,
    isToday: isSameDay(date, today),
    isSelected:
      config.mode === "single"
        ? isSameDay(date, state.selectedDate)
        : config.mode === "multiple"
          ? state.selectedDates.some((d) => isSameDay(d, date))
          : isSameDay(date, state.rangeStart) || isSameDay(date, state.rangeEnd),
    isDisabled: disabled,
    isUnavailable: unavailable,
    isRangeStart: isSameDay(date, state.rangeStart),
    isRangeEnd: isSameDay(date, state.rangeEnd ?? state.hoverDate),
    isInRange: isInRange(date, state.rangeStart, state.rangeEnd ?? state.hoverDate),
    isHovered: isSameDay(date, state.hoverDate),
  };

  const isFocused = isSameDay(date, state.focusedDate);
  const canFocus = !disabled;
  const canSelect = isDateSelectable(date, config) && !config.readOnly;
  // A fresh range selection is one with no pending anchor (no start, or a complete range).
  const startsFreshRange = config.mode === "range" && (!state.rangeStart || !!state.rangeEnd);

  const ariaLabel = formatDayAriaLabel(date, config.locale, {
    isSelected: meta.isSelected,
    isToday: meta.isToday,
    isUnavailable: unavailable,
    isOutsideMonth: !meta.isCurrentMonth,
  });

  function handleSelect() {
    if (!canSelect) return;
    // The reducer's SELECT_DATE does the right thing per mode: single sets the value,
    // range anchors on the first click and completes (or re-anchors) on the next, and
    // multiple toggles. Live range preview is driven by the hover handlers below.
    dispatch({ type: "SELECT_DATE", date });
  }

  return (
    <td
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={meta.isSelected || undefined}
      aria-disabled={disabled || undefined}
      aria-current={meta.isToday ? "date" : undefined}
      tabIndex={isFocused && canFocus ? 0 : -1}
      className={className}
      style={style}
      data-selected={meta.isSelected || undefined}
      data-today={meta.isToday || undefined}
      data-disabled={meta.isDisabled || undefined}
      data-unavailable={meta.isUnavailable || undefined}
      data-outside-month={!meta.isCurrentMonth || undefined}
      data-range-start={meta.isRangeStart || undefined}
      data-range-end={meta.isRangeEnd || undefined}
      data-in-range={meta.isInRange || undefined}
      onClick={(e) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        if (config.mode === "multiple" && (e.ctrlKey || e.metaKey)) {
          if (canSelect) dispatch({ type: "TOGGLE_DATE", date });
          return;
        }
        handleSelect();
      }}
      onPointerDown={(e) => {
        // Begin a potential drag-select only for mouse/pen, on a fresh range, with the
        // primary button. We do NOT anchor yet — a plain click is handled by onClick.
        if (!dragRef || e.pointerType === "touch") return;
        if (e.button > 0 || !startsFreshRange || !canSelect) return;
        dragRef.current = { startDate: date, active: false };
      }}
      onPointerUp={() => {
        if (!dragRef) return;
        const drag = dragRef.current;
        dragRef.current = { startDate: null, active: false };
        // A real drag occurred (pointer moved onto another cell): complete the range on
        // the cell we released over, and swallow the click that would otherwise re-anchor.
        if (drag.active && canSelect) {
          // Swallow the click that fires when the press started and ended on this same
          // cell (it would otherwise re-anchor). When the drag ends on a different cell
          // no click fires here, so auto-clear the flag next frame to avoid leaking it.
          suppressClickRef.current = true;
          requestAnimationFrame(() => {
            suppressClickRef.current = false;
          });
          dispatch({ type: "SELECT_DATE", date });
        }
      }}
      onMouseEnter={() => {
        if (config.mode !== "range") return;
        const drag = dragRef?.current;
        // First move onto a different cell promotes the press into a drag: anchor the
        // start date once, then let hover drive the live preview.
        if (drag && drag.startDate && !drag.active && !isSameDay(date, drag.startDate)) {
          drag.active = true;
          if (canSelect) dispatch({ type: "ANCHOR_DATE", date: drag.startDate });
        }
        dispatch({ type: "HOVER_DATE", date });
      }}
      onMouseLeave={() => {
        if (config.mode === "range") dispatch({ type: "HOVER_DATE", date: null });
      }}
      onKeyDown={(e) => {
        preventGridScrollOnKeyDown(e);
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {children ? children(meta) : date.getDate()}
    </td>
  );
}
