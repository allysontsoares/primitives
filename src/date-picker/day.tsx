import React from 'react';
import { useDatePickerContext } from './context';
import { isSameDay, isInRange, isDateDisabled, startOfDay } from '../utils/date';
import type { DayCellMeta } from '../types';

export interface DayProps {
  date: Date;
  children?: (meta: DayCellMeta) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Day({ date, children, className, style }: DayProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const today = startOfDay(new Date());

  const meta: DayCellMeta = {
    date,
    isCurrentMonth: date.getMonth() === state.focusedMonth,
    isToday: isSameDay(date, today),
    isSelected:
      config.mode === 'single'
        ? isSameDay(date, state.selectedDate)
        : config.mode === 'multiple'
          ? state.selectedDates.some((d) => isSameDay(d, date))
          : isSameDay(date, state.rangeStart) || isSameDay(date, state.rangeEnd),
    isDisabled: isDateDisabled(date, config),
    isRangeStart: isSameDay(date, state.rangeStart),
    isRangeEnd: isSameDay(date, state.rangeEnd ?? state.hoverDate),
    isInRange: isInRange(date, state.rangeStart, state.rangeEnd ?? state.hoverDate),
    isHovered: isSameDay(date, state.hoverDate),
  };

  const isFocused = isSameDay(date, state.focusedDate);

  return (
    <td
      role="gridcell"
      aria-selected={meta.isSelected}
      aria-disabled={meta.isDisabled}
      aria-current={meta.isToday ? 'date' : undefined}
      tabIndex={isFocused ? 0 : -1}
      className={className}
      style={style}
      data-selected={meta.isSelected || undefined}
      data-today={meta.isToday || undefined}
      data-disabled={meta.isDisabled || undefined}
      data-outside-month={!meta.isCurrentMonth || undefined}
      data-range-start={meta.isRangeStart || undefined}
      data-range-end={meta.isRangeEnd || undefined}
      data-in-range={meta.isInRange || undefined}
      onClick={() => {
        if (!meta.isDisabled && !config.readOnly) dispatch({ type: 'SELECT_DATE', date });
      }}
      onMouseEnter={() => {
        if (config.mode === 'range') dispatch({ type: 'HOVER_DATE', date });
      }}
      onMouseLeave={() => {
        if (config.mode === 'range') dispatch({ type: 'HOVER_DATE', date: null });
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!meta.isDisabled && !config.readOnly) dispatch({ type: 'SELECT_DATE', date });
        }
      }}
    >
      {children ? children(meta) : date.getDate()}
    </td>
  );
}
