import { useReducer, useMemo, useEffect, useRef, useId } from 'react';
import { datePickerReducer, createInitialState } from './reducer';
import type { DatePickerState, DatePickerAction } from './reducer';
import type { DatePickerConfig, DatePickerRootProps } from '../types';
import { buildCalendarGrid, buildWeekDays, buildMonthItems, buildYearItems } from '../utils/calendar';
import { getWeekStartDay } from '../utils/locale';
import type { Dispatch } from 'react';

function resolveConfig(props: DatePickerRootProps): DatePickerConfig {
  const base: DatePickerConfig = {
    mode: props.mode ?? 'single',
    locale: props.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US'),
    readOnly: props.readOnly ?? false,
    closeOnSelect: props.closeOnSelect ?? (props.mode !== 'range' && props.mode !== 'multiple'),
    ...(props.weekStartsOn !== undefined && { weekStartsOn: props.weekStartsOn }),
    ...(props.minDate !== undefined && { minDate: props.minDate }),
    ...(props.maxDate !== undefined && { maxDate: props.maxDate }),
    ...(props.disabled !== undefined && { disabled: props.disabled }),
  };
  return base;
}

function resolveInitialValue(props: DatePickerRootProps) {
  if (!props.mode || props.mode === 'single') {
    const v = 'defaultValue' in props ? props.defaultValue : undefined;
    return { selectedDate: v ?? null };
  }
  if (props.mode === 'range') {
    const v = 'defaultValue' in props ? props.defaultValue : undefined;
    return { rangeStart: v?.start ?? null, rangeEnd: v?.end ?? null };
  }
  if (props.mode === 'multiple') {
    const v = 'defaultValue' in props ? props.defaultValue : undefined;
    return { selectedDates: v ?? [] };
  }
  return {};
}

export function useDatePicker(props: DatePickerRootProps) {
  const uid = useId();
  const config = useMemo(() => resolveConfig(props), [
    props.mode,
    props.locale,
    props.weekStartsOn,
    props.minDate,
    props.maxDate,
    props.disabled,
    props.readOnly,
    props.closeOnSelect,
  ]);

  const initialValue = resolveInitialValue(props);
  const [state, dispatch] = useReducer(
    (s: DatePickerState, a: DatePickerAction) => datePickerReducer(s, a, config),
    createInitialState({
      locale: config.locale,
      ...(props.defaultOpen !== undefined && { open: props.defaultOpen }),
      ...initialValue,
    })
  );

  // ── External callbacks ─────────────────────────────────────────────────────
  // Use refs for callbacks to avoid stale closure issues
  const onValueChangeRef = useRef(
    (!props.mode || props.mode === 'single') ? (props as { onValueChange?: (d: Date | null) => void }).onValueChange : undefined
  );
  useEffect(() => {
    if (!props.mode || props.mode === 'single') {
      onValueChangeRef.current = (props as { onValueChange?: (d: Date | null) => void }).onValueChange;
    }
  });

  const prevSelectedRef = useRef<Date | null | undefined>(undefined);
  useEffect(() => {
    // Skip the initial render
    if (prevSelectedRef.current === undefined) {
      prevSelectedRef.current = state.selectedDate;
      return;
    }
    if (state.selectedDate !== prevSelectedRef.current) {
      onValueChangeRef.current?.(state.selectedDate);
      prevSelectedRef.current = state.selectedDate;
    }
  }, [state.selectedDate]);

  const prevRangeRef = useRef<{ start: Date | null; end: Date | null } | undefined>(undefined);
  useEffect(() => {
    if (props.mode !== 'range') return;
    const p = props as { onValueChange?: (r: { start: Date | null; end: Date | null }) => void };
    if (prevRangeRef.current === undefined) {
      prevRangeRef.current = { start: state.rangeStart, end: state.rangeEnd };
      return;
    }
    if (state.rangeStart !== prevRangeRef.current.start || state.rangeEnd !== prevRangeRef.current.end) {
      p.onValueChange?.({ start: state.rangeStart, end: state.rangeEnd });
      prevRangeRef.current = { start: state.rangeStart, end: state.rangeEnd };
    }
  }, [state.rangeStart, state.rangeEnd]);

  const prevMultipleRef = useRef<Date[] | undefined>(undefined);
  useEffect(() => {
    if (props.mode !== 'multiple') return;
    const p = props as { onValueChange?: (dates: Date[]) => void };
    if (prevMultipleRef.current === undefined) {
      prevMultipleRef.current = state.selectedDates;
      return;
    }
    if (state.selectedDates !== prevMultipleRef.current) {
      p.onValueChange?.(state.selectedDates);
      prevMultipleRef.current = state.selectedDates;
    }
  }, [state.selectedDates]);

  // ── Controlled open ────────────────────────────────────────────────────────
  const isControlledOpen = props.open !== undefined;
  const effectiveOpen = isControlledOpen ? (props.open ?? false) : state.open;

  const prevOpenRef = useRef(effectiveOpen);
  useEffect(() => {
    if (prevOpenRef.current !== effectiveOpen) {
      props.onOpenChange?.(effectiveOpen);
    }
    prevOpenRef.current = effectiveOpen;
  }, [effectiveOpen]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const weekStartDay = useMemo(
    () => getWeekStartDay(config.locale, config.weekStartsOn),
    [config.locale, config.weekStartsOn]
  );

  const weeks = useMemo(
    () => buildCalendarGrid(state.focusedYear, state.focusedMonth, weekStartDay),
    [state.focusedYear, state.focusedMonth, weekStartDay]
  );

  const weekDays = useMemo(
    () => buildWeekDays(config.locale, weekStartDay),
    [config.locale, weekStartDay]
  );

  const monthItems = useMemo(
    () => buildMonthItems(state.focusedYear, config.locale, state.focusedMonth, config.minDate, config.maxDate),
    [state.focusedYear, config.locale, state.focusedMonth, config.minDate, config.maxDate]
  );

  const yearItems = useMemo(
    () => buildYearItems(state.yearPageStart, 12, state.focusedYear, config.minDate, config.maxDate),
    [state.yearPageStart, state.focusedYear, config.minDate, config.maxDate]
  );

  const ids = useMemo(() => ({
    root: `dp-${uid}`,
    label: `dp-label-${uid}`,
    input: `dp-input-${uid}`,
    trigger: `dp-trigger-${uid}`,
    content: `dp-content-${uid}`,
  }), [uid]);

  return {
    state: { ...state, open: effectiveOpen },
    dispatch: dispatch as Dispatch<DatePickerAction>,
    config,
    ids,
    derived: { weeks, weekDays, monthItems, yearItems, weekStartDay },
  };
}
