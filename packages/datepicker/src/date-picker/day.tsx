import React from "react";
import { useDatePickerContext } from "./context";
import {
  isSameDay,
  isInRange,
  isDateDisabled,
  isDateUnavailable,
  isDateSelectable,
  startOfDay,
} from "../utils/date";
import { formatDayAriaLabel } from "../utils/day-aria";
import type { DayCellMeta } from "../types";

export interface DayProps {
  date: Date;
  children?: (meta: DayCellMeta) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Day({ date, children, className, style }: DayProps) {
  const { state, dispatch, config } = useDatePickerContext();
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

  const ariaLabel = formatDayAriaLabel(date, config.locale, {
    isSelected: meta.isSelected,
    isToday: meta.isToday,
    isUnavailable: unavailable,
    isOutsideMonth: !meta.isCurrentMonth,
  });

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
      onClick={() => {
        if (canSelect) dispatch({ type: "SELECT_DATE", date });
      }}
      onMouseEnter={() => {
        if (config.mode === "range") dispatch({ type: "HOVER_DATE", date });
      }}
      onMouseLeave={() => {
        if (config.mode === "range") dispatch({ type: "HOVER_DATE", date: null });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (canSelect) dispatch({ type: "SELECT_DATE", date });
        }
      }}
    >
      {children ? children(meta) : date.getDate()}
    </td>
  );
}
