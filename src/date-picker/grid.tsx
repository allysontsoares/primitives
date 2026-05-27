import React, { useRef, useEffect } from 'react';
import { useDatePickerContext } from './context';
import { buildCalendarGrid } from '../utils/calendar';
import { getWeekStartDay, formatMonthYear } from '../utils/locale';
import { isSameDay, addDays, addMonths } from '../utils/date';
import { Day } from './day';

export interface GridProps {
  children?: (ctx: { weeks: Date[][] }) => React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function Grid({ children, header, className }: GridProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const gridRef = useRef<HTMLTableElement>(null);

  const weekStartDay = getWeekStartDay(config.locale, config.weekStartsOn);
  const weeks = buildCalendarGrid(state.focusedYear, state.focusedMonth, weekStartDay);
  const label = formatMonthYear(new Date(state.focusedYear, state.focusedMonth, 1), config.locale);

  // Move DOM focus to the focused cell after render
  useEffect(() => {
    if (!gridRef.current || !state.focusedDate) return;
    // Don't steal focus while the user is typing in the segmented input
    if (document.activeElement?.getAttribute('role') === 'spinbutton') return;
    if (
      state.openSource === 'input' &&
      !gridRef.current.contains(document.activeElement)
    ) {
      return;
    }
    const focused = gridRef.current.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && document.activeElement !== focused) focused.focus();
  }, [state.focusedDate?.toDateString(), state.openSource]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTableElement>) {
    if (!state.focusedDate) return;
    let next: Date | null = null;

    switch (e.key) {
      case 'ArrowRight': next = addDays(state.focusedDate, 1); break;
      case 'ArrowLeft':  next = addDays(state.focusedDate, -1); break;
      case 'ArrowDown':  next = addDays(state.focusedDate, 7); break;
      case 'ArrowUp':    next = addDays(state.focusedDate, -7); break;
      case 'PageDown':
        next = e.ctrlKey
          ? new Date(state.focusedYear + 1, state.focusedMonth, state.focusedDate.getDate())
          : addMonths(state.focusedDate, 1);
        break;
      case 'PageUp':
        next = e.ctrlKey
          ? new Date(state.focusedYear - 1, state.focusedMonth, state.focusedDate.getDate())
          : addMonths(state.focusedDate, -1);
        break;
      case 'Home': {
        const d = new Date(state.focusedDate);
        const diff = (d.getDay() - weekStartDay + 7) % 7;
        next = addDays(d, -diff);
        break;
      }
      case 'End': {
        const d = new Date(state.focusedDate);
        const diff = (weekStartDay + 6 - d.getDay() + 7) % 7;
        next = addDays(d, diff);
        break;
      }
      default: return;
    }

    e.preventDefault();
    dispatch({ type: 'FOCUS_DATE', date: next });
  }

  const defaultRender = (ws: Date[][]) =>
    ws.map((week, wi) => (
      <tr key={wi}>
        {week.map((day, di) => (
          <Day key={di} date={day} />
        ))}
      </tr>
    ));

  return (
    <table
      ref={gridRef}
      role="grid"
      aria-label={label}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {header && <thead>{header}</thead>}
      <tbody>
        {children ? children({ weeks }) : defaultRender(weeks)}
      </tbody>
    </table>
  );
}
