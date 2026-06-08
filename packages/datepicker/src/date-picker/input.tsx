import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTimescape } from "timescape/react";
import { isDateDisabled } from "../utils/date";
import { getSegmentInfo } from "../utils/locale";
import { useDatePickerContext } from "./context";

// React 19 ref callbacks must return void, not null. timescape still uses the
// older signature so we wrap every ref to discard the null return value.
function wrapRef<T extends HTMLElement>(ref: (el: T | null) => void | null): React.RefCallback<T> {
  return (el) => {
    ref(el);
  };
}

const DEFAULT_LABELS = { month: "Month", day: "Day", year: "Year" };
const FIELD_MAP = {
  year: "years" as const,
  month: "months" as const,
  day: "days" as const,
};

export interface InputProps {
  index?: 0 | 1;
  segmentLabels?: { month?: string; day?: string; year?: string };
  className?: string;
  style?: React.CSSProperties;
}

// ─── Inner component ────────────────────────────────────────────────────────
// Lives in a separate component so React can remount it (via `key`) whenever
// an external update (e.g. calendar click) must reinitialise timescape with
// a new date.  If we updated timescape's internal state imperatively with
// `update()`, it would silently no-op when timescape starts in placeholder
// mode (no initial date), so remounting is the reliable path.

interface SegmentsProps {
  sourceDate: Date | null;
  segmentOrder: string[];
  separator: string;
  labels: Record<string, string>;
  onDateChange: (date: Date | undefined) => void;
  groupId?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}

function Segments({
  sourceDate,
  segmentOrder,
  separator,
  labels,
  onDateChange,
  groupId,
  className,
  style,
}: SegmentsProps) {
  const { state, dispatch, ids, config } = useDatePickerContext();

  // Keep onDateChange stable inside timescape even when the prop reference changes.
  const onDateChangeRef = useRef(onDateChange);
  onDateChangeRef.current = onDateChange;

  const opts: Record<string, unknown> = {
    wrapAround: true,
    onChangeDate: (d: Date | undefined) => onDateChangeRef.current(d),
  };
  if (config.minDate) opts.minDate = config.minDate;
  if (config.maxDate) opts.maxDate = config.maxDate;
  if (sourceDate) opts.date = sourceDate;

  const { getRootProps, getInputProps } = useTimescape(opts as Parameters<typeof useTimescape>[0]);

  const [focused, setFocused] = useState<string | null>(null);

  function handleSegmentFocus(field: string) {
    setFocused(field);
    if (!state.open && !config.readOnly) dispatch({ type: "OPEN", source: "input" });
  }

  function handleSegmentBlur(field: string, e: React.FocusEvent<HTMLInputElement>) {
    const relatedTarget = e.relatedTarget as Node | null;
    const isMovingWithin = e.currentTarget.parentElement?.contains(relatedTarget);
    if (!isMovingWithin) setFocused(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (config.readOnly) {
      e.preventDefault();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (state.open) dispatch({ type: "CLOSE" });
    }
  }

  const { ref: rootRef, ...rootProps } = getRootProps();

  return (
    <div
      role="group"
      id={groupId ?? ids.input}
      aria-labelledby={ids.label}
      tabIndex={-1}
      className={className}
      style={style}
      {...rootProps}
      ref={wrapRef(rootRef as (el: HTMLElement | null) => void | null)}
      {...(config.readOnly ? { "data-readonly": "true" } : {})}
    >
      {segmentOrder.map((field, i) => {
        const type = FIELD_MAP[field as keyof typeof FIELD_MAP];
        const isFocused = focused === field;
        const isTabStop = isFocused || (focused === null && i === 0);
        const { ref: inputRef, ...inputProps } = getInputProps(type);
        const wrappedInputRef = wrapRef(inputRef as (el: HTMLInputElement | null) => void | null);

        return (
          <React.Fragment key={field}>
            {i > 0 && (
              <span aria-hidden="true" data-separator="true">
                {separator}
              </span>
            )}
            <input
              {...inputProps}
              ref={wrappedInputRef}
              aria-label={labels[field]}
              data-segment={field}
              tabIndex={config.readOnly ? -1 : isTabStop ? 0 : -1}
              disabled={config.readOnly}
              onFocus={(e) => {
                inputRef(e.currentTarget);
                handleSegmentFocus(field);
              }}
              onBlur={(e) => handleSegmentBlur(field, e)}
              onKeyDown={handleKeyDown}
              className="timescape-input"
              style={{
                width: field === "year" ? "4ch" : "2ch",
                border: "none",
                background: "transparent",
                padding: 0,
                margin: 0,
                textAlign: "center",
                font: "inherit",
                outline: "none",
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Public component ────────────────────────────────────────────────────────

export function Input({ index, segmentLabels, className, style }: InputProps) {
  const { state, dispatch, config, ids } = useDatePickerContext();

  const { order: segmentOrder, separator } = useMemo(
    () => getSegmentInfo(config.locale),
    [config.locale],
  );

  const labels = {
    month: segmentLabels?.month ?? DEFAULT_LABELS.month,
    day: segmentLabels?.day ?? DEFAULT_LABELS.day,
    year: segmentLabels?.year ?? DEFAULT_LABELS.year,
  };

  const sourceDate =
    index === 1 ? state.rangeEnd : index === 0 ? state.rangeStart : state.selectedDate;

  // ── External-change detection ──────────────────────────────────────────
  // When the user picks a date from the calendar (external update), we
  // increment `timescapeKey` to remount <Segments> with the correct
  // initialDate.  When the change came from this input's own onDateChange
  // (internal), we skip the remount to preserve focus.
  const isInternalChangeRef = useRef(false);
  const prevSourceDateRef = useRef(sourceDate);
  const [timescapeKey, setTimescapeKey] = useState(0);

  useEffect(() => {
    const prev = prevSourceDateRef.current;
    prevSourceDateRef.current = sourceDate;

    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    // Compare by value so same-day objects don't trigger a remount.
    const prevTime = prev?.getTime();
    const currTime = sourceDate?.getTime();
    if (prevTime !== currTime) {
      setTimescapeKey((k) => k + 1);
    }
  }, [sourceDate]);

  // ── Date-change handler ────────────────────────────────────────────────
  const onDateChange = useCallback(
    (nextDate: Date | undefined) => {
      if (!nextDate) return;
      if (isDateDisabled(nextDate, config)) return;

      const prevDate = prevSourceDateRef.current;
      if (prevDate && prevDate.getTime() === nextDate.getTime()) return;

      if (config.mode === "multiple") {
        // Clear the input after each toggle so the user can enter
        // the next date without a manual clear.
        dispatch({ type: "FOCUS_DATE", date: nextDate });
        dispatch({ type: "TOGGLE_DATE", date: nextDate });
        setTimescapeKey((k) => k + 1);
        return;
      }

      // For single / range: mark as internal so the useEffect above
      // does not remount timescape (we want to keep segment focus).
      isInternalChangeRef.current = true;
      dispatch({ type: "FOCUS_DATE", date: nextDate });

      if (config.mode === "single") {
        dispatch({ type: "SELECT_DATE", date: nextDate });
      } else if (config.mode === "range" && index === 0) {
        dispatch({ type: "ANCHOR_DATE", date: nextDate });
      } else if (config.mode === "range" && index === 1) {
        dispatch({ type: "EXTEND_RANGE", date: nextDate });
      }
    },
    [config, dispatch, index],
  );

  const groupId = index !== undefined ? `${ids.input}-${index}` : ids.input;

  return (
    <Segments
      key={timescapeKey}
      sourceDate={sourceDate}
      segmentOrder={segmentOrder}
      separator={separator}
      labels={labels}
      onDateChange={onDateChange}
      groupId={groupId}
      className={className}
      style={style}
    />
  );
}
