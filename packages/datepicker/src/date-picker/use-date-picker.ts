import { useReducer, useMemo, useEffect, useRef, useId } from "react";
import { datePickerReducer, createInitialState } from "./reducer";
import type { DatePickerState, DatePickerAction } from "./reducer";
import type { DatePickerConfig, DatePickerRootProps } from "../types";
import {
  buildCalendarGrid,
  buildWeekDays,
  buildMonthItems,
  buildYearItems,
} from "../utils/calendar";
import { getWeekStartDay } from "../utils/locale";
import type { Dispatch } from "react";

function resolveConfig(props: DatePickerRootProps): DatePickerConfig {
  const base: DatePickerConfig = {
    mode: props.mode ?? "single",
    locale: props.locale ?? (typeof navigator !== "undefined" ? navigator.language : "en-US"),
    readOnly: props.readOnly ?? false,
    modal: props.modal ?? false,
    closeOnSelect: props.closeOnSelect ?? (props.mode !== "range" && props.mode !== "multiple"),
    ...(props.weekStartsOn !== undefined && { weekStartsOn: props.weekStartsOn }),
    ...(props.minDate !== undefined && { minDate: props.minDate }),
    ...(props.maxDate !== undefined && { maxDate: props.maxDate }),
    ...(props.disabled !== undefined && { disabled: props.disabled }),
  };
  return base;
}

function resolveInitialValue(props: DatePickerRootProps) {
  if (!props.mode || props.mode === "single") {
    const v =
      "value" in props && props.value !== undefined
        ? props.value
        : "defaultValue" in props
          ? props.defaultValue
          : undefined;
    return { selectedDate: v ?? null };
  }
  if (props.mode === "range") {
    const v =
      "value" in props && props.value !== undefined
        ? props.value
        : "defaultValue" in props
          ? props.defaultValue
          : undefined;
    return { rangeStart: v?.start ?? null, rangeEnd: v?.end ?? null };
  }
  if (props.mode === "multiple") {
    const v = "defaultValue" in props ? props.defaultValue : undefined;
    return { selectedDates: v ?? [] };
  }
  return {};
}

export function useDatePicker(props: DatePickerRootProps) {
  const uid = useId();
  const { mode, locale, weekStartsOn, minDate, maxDate, disabled, readOnly, closeOnSelect, modal } =
    props;
  const config = useMemo(
    () =>
      resolveConfig({
        mode,
        locale,
        weekStartsOn,
        minDate,
        maxDate,
        disabled,
        readOnly,
        closeOnSelect,
        modal,
      } as DatePickerRootProps),
    [mode, locale, weekStartsOn, minDate, maxDate, disabled, readOnly, closeOnSelect, modal],
  );

  const initialValue = resolveInitialValue(props);
  const [state, dispatch] = useReducer(
    (s: DatePickerState, a: DatePickerAction) => datePickerReducer(s, a, config),
    createInitialState({
      locale: config.locale,
      ...(props.defaultOpen !== undefined && { open: props.defaultOpen }),
      ...initialValue,
    }),
  );

  // ── External callbacks ─────────────────────────────────────────────────────
  // Use refs for callbacks to avoid stale closure issues
  const onValueChangeRef = useRef(
    !props.mode || props.mode === "single"
      ? (props as { onValueChange?: (d: Date | null) => void }).onValueChange
      : undefined,
  );
  useEffect(() => {
    if (!props.mode || props.mode === "single") {
      onValueChangeRef.current = (
        props as { onValueChange?: (d: Date | null) => void }
      ).onValueChange;
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

  // Sync controlled range value into reducer state (props → state only; never react to
  // internal state changes or stale parent value would overwrite in-flight updates).
  const controlledRangeValue =
    props.mode === "range" && "value" in props && props.value !== undefined
      ? props.value
      : undefined;
  const lastSyncedPropRangeRef = useRef<{ startT: number | null; endT: number | null } | null>(
    null,
  );
  const propRangeStartT = controlledRangeValue?.start?.getTime() ?? null;
  const propRangeEndT = controlledRangeValue?.end?.getTime() ?? null;

  useEffect(() => {
    if (controlledRangeValue === undefined) return;

    const last = lastSyncedPropRangeRef.current;
    if (last?.startT === propRangeStartT && last?.endT === propRangeEndT) return;

    lastSyncedPropRangeRef.current = { startT: propRangeStartT, endT: propRangeEndT };

    const stateStartT = state.rangeStart?.getTime() ?? null;
    const stateEndT = state.rangeEnd?.getTime() ?? null;
    if (propRangeStartT === stateStartT && propRangeEndT === stateEndT) return;

    dispatch({
      type: "SET_RANGE",
      start: controlledRangeValue.start ?? null,
      end: controlledRangeValue.end ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync when the controlled prop changes
  }, [propRangeStartT, propRangeEndT, dispatch]);

  const prevRangeRef = useRef<{ startT: number | null; endT: number | null } | undefined>(
    undefined,
  );
  useEffect(() => {
    if (props.mode !== "range") return;
    const p = props as { onValueChange?: (r: { start: Date | null; end: Date | null }) => void };
    const startT = state.rangeStart?.getTime() ?? null;
    const endT = state.rangeEnd?.getTime() ?? null;
    if (prevRangeRef.current === undefined) {
      prevRangeRef.current = { startT, endT };
      return;
    }
    if (startT !== prevRangeRef.current.startT || endT !== prevRangeRef.current.endT) {
      p.onValueChange?.({ start: state.rangeStart, end: state.rangeEnd });
      prevRangeRef.current = { startT, endT };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props is a new object each render; mode/onValueChange accessed via closure intentionally
  }, [state.rangeStart, state.rangeEnd]);

  const prevMultipleRef = useRef<Date[] | undefined>(undefined);
  useEffect(() => {
    if (props.mode !== "multiple") return;
    const p = props as { onValueChange?: (dates: Date[]) => void };
    if (prevMultipleRef.current === undefined) {
      prevMultipleRef.current = state.selectedDates;
      return;
    }
    if (state.selectedDates !== prevMultipleRef.current) {
      p.onValueChange?.(state.selectedDates);
      prevMultipleRef.current = state.selectedDates;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props is a new object each render; mode/onValueChange accessed via closure intentionally
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- props.onOpenChange accessed via closure; adding props would cause infinite loops
  }, [effectiveOpen]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const weekStartDay = useMemo(
    () => getWeekStartDay(config.locale, config.weekStartsOn),
    [config.locale, config.weekStartsOn],
  );

  const weeks = useMemo(
    () => buildCalendarGrid(state.focusedYear, state.focusedMonth, weekStartDay),
    [state.focusedYear, state.focusedMonth, weekStartDay],
  );

  const weekDays = useMemo(
    () => buildWeekDays(config.locale, weekStartDay),
    [config.locale, weekStartDay],
  );

  const monthItems = useMemo(
    () =>
      buildMonthItems(
        state.focusedYear,
        config.locale,
        state.focusedMonth,
        config.minDate,
        config.maxDate,
      ),
    [state.focusedYear, config.locale, state.focusedMonth, config.minDate, config.maxDate],
  );

  const yearItems = useMemo(
    () =>
      buildYearItems(state.yearPageStart, 12, state.focusedYear, config.minDate, config.maxDate),
    [state.yearPageStart, state.focusedYear, config.minDate, config.maxDate],
  );

  const ids = useMemo(
    () => ({
      root: `dp-${uid}`,
      label: `dp-label-${uid}`,
      input: `dp-input-${uid}`,
      trigger: `dp-trigger-${uid}`,
      content: `dp-content-${uid}`,
    }),
    [uid],
  );

  return {
    state: { ...state, open: effectiveOpen },
    dispatch: dispatch as Dispatch<DatePickerAction>,
    config,
    ids,
    derived: { weeks, weekDays, monthItems, yearItems, weekStartDay },
  };
}
