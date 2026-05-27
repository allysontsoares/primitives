import React, { useState, useRef, useEffect } from 'react';
import { useDatePickerContext } from './context';
import { MonthGridFocusContext } from './context';
import { buildMonthItems } from '../utils/calendar';
import type { MonthItem } from '../types';

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
    config.maxDate
  );

  const [focusedIndex, setFocusedIndex] = useState(state.focusedMonth);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sync focused index when the visible month changes (e.g. year navigation)
  useEffect(() => {
    setFocusedIndex(state.focusedMonth);
  }, [state.focusedYear]);

  // Move DOM focus to the focused cell after state change
  useEffect(() => {
    const focused = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && gridRef.current?.contains(document.activeElement)) {
      focused.focus();
    }
  }, [focusedIndex, state.focusedYear]);

  function handleKeyDown(e: React.KeyboardEvent) {
    let next = focusedIndex;
    switch (e.key) {
      case 'ArrowRight': next = Math.min(focusedIndex + 1, 11); break;
      case 'ArrowLeft':  next = Math.max(focusedIndex - 1, 0); break;
      case 'ArrowDown':  next = Math.min(focusedIndex + 3, 11); break;
      case 'ArrowUp':    next = Math.max(focusedIndex - 3, 0); break;
      case 'Home':       next = 0; break;
      case 'End':        next = 11; break;
      case 'PageDown':   dispatch({ type: 'NAV_NEXT' }); e.preventDefault(); return;
      case 'PageUp':     dispatch({ type: 'NAV_PREV' }); e.preventDefault(); return;
      case 'Escape':     dispatch({ type: 'SET_VIEW', view: 'day' }); e.preventDefault(); return;
      case 'Enter':
      case ' ':
        dispatch({ type: 'SELECT_MONTH', month: focusedIndex });
        e.preventDefault();
        return;
      default: return;
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
