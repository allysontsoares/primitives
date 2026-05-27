import React, { useRef, useEffect } from 'react';
import { useDatePickerContext } from './context';
import { useClickOutside } from './use-click-outside';
import { useFocusTrap } from './use-focus-trap';
import { formatMonthYear, formatYear } from '../utils/locale';

export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

export function Content({ children, forceMount, onKeyDown, ...props }: ContentProps) {
  const { state, dispatch, ids, config } = useDatePickerContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Stable ref that always points to the trigger element, so click-outside
  // does not fire when the user clicks the trigger button itself.
  const triggerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    triggerRef.current = document.getElementById(ids.trigger);
  });

  const isOpen = state.open;
  const shouldRender = forceMount || isOpen;

  useClickOutside([contentRef, triggerRef], () => dispatch({ type: 'CLOSE' }), isOpen);
  useFocusTrap(contentRef, isOpen);

  // When opened via trigger, move focus into the content.
  // Don't steal focus when the input opened the calendar.
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    if (state.openSource === 'input') return;
    const active = document.activeElement;
    const activeRole = active?.getAttribute('role');
    // Don't steal focus if the input (combobox or segmented spinbutton) opened the calendar
    if (activeRole === 'combobox' || activeRole === 'spinbutton') return;
    const firstFocusable = contentRef.current.querySelector<HTMLElement>(
      'button:not([disabled]), [tabindex="0"]'
    );
    firstFocusable?.focus();
  }, [isOpen, state.openSource]);

  // Announce navigation changes to screen readers
  const announcement =
    state.view === 'day'
      ? formatMonthYear(new Date(state.focusedYear, state.focusedMonth, 1), config.locale)
      : state.view === 'month'
        ? formatYear(state.focusedYear, config.locale)
        : `${state.yearPageStart}–${state.yearPageStart + 11}`;

  if (!shouldRender) return null;

  return (
    <div
      ref={contentRef}
      id={ids.content}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ids.label}
      data-state={isOpen ? 'open' : 'closed'}
      style={!isOpen ? { display: 'none' } : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          dispatch({ type: 'CLOSE' });
          document.getElementById(ids.trigger)?.focus();
        }
        onKeyDown?.(e);
      }}
      {...props}
    >
      {/* Screen reader live region for navigation announcements */}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      >
        {isOpen ? announcement : ''}
      </span>
      {children}
    </div>
  );
}
