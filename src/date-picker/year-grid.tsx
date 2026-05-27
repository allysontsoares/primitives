import React, { useState, useRef, useEffect } from 'react';
import { useDatePickerContext } from './context';
import { YearGridFocusContext } from './context';
import { buildYearItems } from '../utils/calendar';

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
    config.maxDate
  );

  const [focusedYear, setFocusedYear] = useState(state.focusedYear);
  const gridRef = useRef<HTMLDivElement>(null);

  // Keep focused year within the current page when page changes
  useEffect(() => {
    const inPage = focusedYear >= state.yearPageStart && focusedYear < state.yearPageStart + 12;
    if (!inPage) setFocusedYear(state.yearPageStart);
  }, [state.yearPageStart]);

  // Move DOM focus to the focused cell
  useEffect(() => {
    const focused = gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]');
    if (focused && gridRef.current?.contains(document.activeElement)) {
      focused.focus();
    }
  }, [focusedYear, state.yearPageStart]);

  function handleKeyDown(e: React.KeyboardEvent) {
    let next = focusedYear;
    const pageStart = state.yearPageStart;
    const pageEnd = pageStart + 11;

    switch (e.key) {
      case 'ArrowRight': next = Math.min(focusedYear + 1, pageEnd); break;
      case 'ArrowLeft':  next = Math.max(focusedYear - 1, pageStart); break;
      // 4-column grid: ↓/↑ = ±4 years (next/prev row)
      case 'ArrowDown':  next = Math.min(focusedYear + 4, pageEnd); break;
      case 'ArrowUp':    next = Math.max(focusedYear - 4, pageStart); break;
      case 'Home':       next = pageStart; break;
      case 'End':        next = pageEnd; break;
      case 'PageDown':   dispatch({ type: 'YEAR_PAGE_NEXT' }); e.preventDefault(); return;
      case 'PageUp':     dispatch({ type: 'YEAR_PAGE_PREV' }); e.preventDefault(); return;
      case 'Escape':     dispatch({ type: 'SET_VIEW', view: 'month' }); e.preventDefault(); return;
      case 'Enter':
      case ' ':
        dispatch({ type: 'SELECT_YEAR', year: focusedYear });
        e.preventDefault();
        return;
      default: return;
    }
    e.preventDefault();
    setFocusedYear(next);
  }

  return (
    <YearGridFocusContext.Provider value={focusedYear}>
      <div
        ref={gridRef}
        role="grid"
        aria-label={`${state.yearPageStart}–${state.yearPageStart + 11}`}
        className={className}
        onKeyDown={handleKeyDown}
      >
        {children({ years })}
      </div>
    </YearGridFocusContext.Provider>
  );
}
