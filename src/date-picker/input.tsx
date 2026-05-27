import React, { useState, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useDatePickerContext } from './context';
import { getSegmentInfo } from '../utils/locale';
import { daysInMonth, isDateDisabled } from '../utils/date';

type SegmentField = 'year' | 'month' | 'day';

const PLACEHOLDER: Record<SegmentField, string> = {
  month: 'MM',
  day: 'DD',
  year: 'YYYY',
};

const DEFAULT_LABELS = { month: 'Month', day: 'Day', year: 'Year' };

export interface InputProps {
  index?: 0 | 1;
  segmentLabels?: { month?: string; day?: string; year?: string };
  className?: string;
  style?: React.CSSProperties;
}

export function Input({ index, segmentLabels, className, style }: InputProps) {
  const { state, dispatch, ids, config } = useDatePickerContext();

  const { order: segmentOrder, separator } = useMemo(
    () => getSegmentInfo(config.locale),
    [config.locale]
  );

  const labels = {
    month: segmentLabels?.month ?? DEFAULT_LABELS.month,
    day: segmentLabels?.day ?? DEFAULT_LABELS.day,
    year: segmentLabels?.year ?? DEFAULT_LABELS.year,
  };

  const [values, setValues] = useState<Record<SegmentField, number | null>>({
    month: null,
    day: null,
    year: null,
  });
  const [focused, setFocused] = useState<SegmentField | null>(null);
  const [pending, setPending] = useState('');
  const pendingRef = useRef('');
  // Tracks the segment that should receive focus after the next commit/advance.
  // Read in useLayoutEffect (which fires before MutationObserver) to defend
  // against async focus-theft from the calendar grid when the month changes.
  const pendingFocusRef = useRef<SegmentField | null>(null);

  const monthRef = useRef<HTMLSpanElement>(null);
  const dayRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const segmentRefs: Record<SegmentField, React.RefObject<HTMLSpanElement>> = {
    month: monthRef,
    day: dayRef,
    year: yearRef,
  };

  // Which reducer date drives this input (depends on index prop)
  const sourceDate =
    index === 1
      ? state.rangeEnd
      : index === 0
        ? state.rangeStart
        : state.selectedDate;

  // Calendar → input: sync segment values when the reducer's date changes
  useEffect(() => {
    if (sourceDate) {
      setValues({
        month: sourceDate.getMonth() + 1,
        day: sourceDate.getDate(),
        year: sourceDate.getFullYear(),
      });
    } else {
      setValues({ month: null, day: null, year: null });
    }
  }, [sourceDate]);

  // Input → calendar: dispatch when all segments form a valid date
  function tryCommit(v: Record<SegmentField, number | null>) {
    const { month, day, year } = v;
    if (month === null || day === null || year === null) return;
    if (year < 100 || year > 9999) return;
    const date = new Date(year, month - 1, day);
    // Overflow guard (e.g. Feb 30 rolls over to Mar 1)
    if (date.getMonth() !== month - 1 || date.getDate() !== day) return;
    if (isDateDisabled(date, config)) return;

    dispatch({ type: 'FOCUS_DATE', date });
    if (config.mode === 'single') {
      dispatch({ type: 'SELECT_DATE', date });
    } else if (config.mode === 'range' && index === 0) {
      dispatch({ type: 'ANCHOR_DATE', date });
    } else if (config.mode === 'range' && index === 1) {
      dispatch({ type: 'EXTEND_RANGE', date });
    } else if (config.mode === 'multiple') {
      dispatch({ type: 'TOGGLE_DATE', date });
    }
  }

  function focusSegment(field: SegmentField) {
    segmentRefs[field].current?.focus();
  }

  function focusNext(field: SegmentField) {
    const idx = segmentOrder.indexOf(field);
    const next = segmentOrder[idx + 1];
    if (next) focusSegment(next);
  }

  function focusPrev(field: SegmentField) {
    const idx = segmentOrder.indexOf(field);
    const prev = segmentOrder[idx - 1];
    if (prev) focusSegment(prev);
  }

  function updatePending(next: string) {
    pendingRef.current = next;
    setPending(next);
  }

  function getMaxDay(v: Record<SegmentField, number | null>): number {
    return v.month !== null && v.year !== null
      ? daysInMonth(v.year, v.month - 1)
      : 31;
  }

  // After each commit, re-apply focus synchronously in useLayoutEffect so that
  // it fires before MutationObserver callbacks (which fire as microtasks after
  // React's commit). This prevents the calendar grid from stealing focus when
  // the displayed month changes (e.g. typing "01" navigates to January).
  useLayoutEffect(() => {
    const field = pendingFocusRef.current;
    if (!field) return;
    pendingFocusRef.current = null;
    const el = segmentRefs[field].current;
    if (el && document.activeElement !== el) el.focus();
  });

  function commitAndAdvance(
    field: SegmentField,
    newValues: Record<SegmentField, number | null>
  ) {
    setValues(newValues);
    updatePending('');
    tryCommit(newValues);
    const idx = segmentOrder.indexOf(field);
    const next = segmentOrder[idx + 1];
    if (next) {
      pendingFocusRef.current = next;
      focusSegment(next);
    }
  }

  function handleDigit(
    field: SegmentField,
    digit: string,
    curValues: Record<SegmentField, number | null>,
    curPending: string
  ) {
    const d = parseInt(digit, 10);

    if (field === 'month') {
      if (curPending === '') {
        // Digits 2–9: single-digit month (20+ > 12, so auto-commit)
        if (d >= 2) {
          commitAndAdvance(field, { ...curValues, month: d });
        } else {
          updatePending(digit); // 0 or 1: wait for second digit
        }
      } else {
        const combined = parseInt(curPending + digit, 10);
        if (combined >= 1 && combined <= 12) {
          commitAndAdvance(field, { ...curValues, month: combined });
        } else if (d >= 1 && d <= 12) {
          // Combined invalid (e.g. '13'), use digit alone
          commitAndAdvance(field, { ...curValues, month: d });
        }
        // '00' → ignore
      }
    } else if (field === 'day') {
      const maxDay = getMaxDay(curValues);
      if (curPending === '') {
        // Digits 4–9: single-digit day (40+ > 31, so auto-commit)
        if (d >= 4) {
          commitAndAdvance(field, { ...curValues, day: d });
        } else {
          updatePending(digit);
        }
      } else {
        const combined = parseInt(curPending + digit, 10);
        if (combined >= 1 && combined <= maxDay) {
          commitAndAdvance(field, { ...curValues, day: combined });
        } else if (d >= 1 && d <= maxDay) {
          commitAndAdvance(field, { ...curValues, day: d });
        }
      }
    } else {
      // Year: accumulate 4 digits
      const newPending = curPending + digit;
      if (newPending.length < 4) {
        updatePending(newPending);
      } else {
        const year = parseInt(newPending, 10);
        const newValues = { ...curValues, year };
        setValues(newValues);
        updatePending('');
        tryCommit(newValues);
      }
    }
  }

  function handleIncrement(
    field: SegmentField,
    delta: 1 | -1,
    curValues: Record<SegmentField, number | null>
  ) {
    const maxDay = getMaxDay(curValues);
    const ranges: Record<SegmentField, { min: number; max: number }> = {
      month: { min: 1, max: 12 },
      day: { min: 1, max: maxDay },
      year: { min: 1, max: 9999 },
    };
    const { min, max } = ranges[field];
    const current = curValues[field];

    let next: number;
    if (current === null) {
      next = delta > 0 ? min : max;
    } else {
      next = current + delta;
      if (field === 'year') {
        next = Math.max(1, Math.min(9999, next));
      } else {
        if (next < min) next = max;
        if (next > max) next = min;
      }
    }

    const newValues = { ...curValues, [field]: next };
    setValues(newValues);
    updatePending('');
    tryCommit(newValues);
  }

  function commitPartialPending(
    field: SegmentField,
    curPending: string,
    curValues: Record<SegmentField, number | null>
  ) {
    if (!curPending) return;
    const p = parseInt(curPending, 10);
    if (field === 'month' && p >= 1 && p <= 12) {
      const nv = { ...curValues, month: p };
      setValues(nv);
      tryCommit(nv);
    } else if (field === 'day') {
      const maxDay = getMaxDay(curValues);
      if (p >= 1 && p <= maxDay) {
        const nv = { ...curValues, day: p };
        setValues(nv);
        tryCommit(nv);
      }
    } else if (field === 'year' && curPending.length === 4 && p >= 1000 && p <= 9999) {
      const nv = { ...curValues, year: p };
      setValues(nv);
      tryCommit(nv);
    }
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLSpanElement>,
    field: SegmentField
  ) {
    if (config.readOnly) return;
    const curPending = pendingRef.current;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        if (state.open) dispatch({ type: 'CLOSE' });
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (curPending) updatePending('');
        else focusPrev(field);
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (curPending) updatePending('');
        else focusNext(field);
        break;

      case 'ArrowUp':
        e.preventDefault();
        handleIncrement(field, 1, values);
        break;

      case 'ArrowDown':
        e.preventDefault();
        handleIncrement(field, -1, values);
        break;

      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        if (curPending) {
          updatePending('');
        } else if (values[field] !== null) {
          setValues((v) => ({ ...v, [field]: null }));
        } else {
          focusPrev(field);
        }
        break;

      default:
        if (/^\d$/.test(e.key)) {
          e.preventDefault();
          handleDigit(field, e.key, values, curPending);
        }
    }
  }

  function handleSegmentFocus(field: SegmentField) {
    setFocused(field);
    updatePending('');
    if (!state.open) dispatch({ type: 'OPEN', source: 'input' });
  }

  function handleSegmentBlur(
    field: SegmentField,
    e: React.FocusEvent<HTMLSpanElement>
  ) {
    const relatedTarget = e.relatedTarget as Node | null;
    const isMovingWithin = Object.values(segmentRefs).some(
      (r) => r.current === relatedTarget
    );
    commitPartialPending(field, pendingRef.current, values);
    updatePending('');
    if (!isMovingWithin) setFocused(null);
  }

  function handleGroupFocus(e: React.FocusEvent<HTMLDivElement>) {
    // Forward focus only when focus landed on the wrapper itself (e.g. label click)
    if (e.target === e.currentTarget) {
      const firstField = segmentOrder[0];
      if (firstField) focusSegment(firstField);
    }
  }

  function getDisplayValue(field: SegmentField): string {
    if (focused === field && pending !== '') return pending;
    const v = values[field];
    if (v === null) return PLACEHOLDER[field];
    return field === 'year'
      ? String(v).padStart(4, '0')
      : String(v).padStart(2, '0');
  }

  const maxDayForAria = getMaxDay(values);

  return (
    <div
      role="group"
      id={ids.input}
      aria-labelledby={ids.label}
      tabIndex={-1}
      className={className}
      style={style}
      onFocus={handleGroupFocus}
      {...(config.readOnly ? { 'data-disabled': 'true' } : {})}
    >
      {segmentOrder.map((field, i) => {
        const isFocused = focused === field;
        // When nothing is focused, first segment is the tab stop (roving tabindex)
        const isTabStop = isFocused || (focused === null && i === 0);
        const v = values[field];
        const valuenowProps = v !== null ? { 'aria-valuenow': v } : {};
        const placeholderProps = v === null ? { 'data-placeholder': 'true' } : {};

        return (
          <React.Fragment key={field}>
            {i > 0 && (
              <span aria-hidden="true" data-separator="true">
                {separator}
              </span>
            )}
            <span
              ref={segmentRefs[field]}
              role="spinbutton"
              aria-label={labels[field]}
              {...valuenowProps}
              aria-valuemin={1}
              aria-valuemax={
                field === 'month' ? 12 : field === 'day' ? maxDayForAria : 9999
              }
              aria-valuetext={v !== null ? getDisplayValue(field) : 'Blank'}
              tabIndex={isTabStop ? 0 : -1}
              data-segment={field}
              {...placeholderProps}
              onKeyDown={(e) => handleKeyDown(e, field)}
              onFocus={() => handleSegmentFocus(field)}
              onBlur={(e) => handleSegmentBlur(field, e)}
            >
              {getDisplayValue(field)}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
