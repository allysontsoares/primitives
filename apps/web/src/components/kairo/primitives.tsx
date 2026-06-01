"use client";

/* ============================================================
   Self-contained, accessible Kairo demo primitives.
   Real working components (keyboard nav, locale-aware, range
   selection) used by the live docs demos. Styled with Tailwind
   utilities + a few state classes from globals.css.
   ============================================================ */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react";

/* ---------------- date utils ---------------- */
export const D = {
  today: () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  },
  iso: (d: Date | null) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate(),
        ).padStart(2, "0")}`
      : "",
  same: (a?: Date | null, b?: Date | null) =>
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
  sameMonth: (a?: Date | null, b?: Date | null) =>
    !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(),
  addDays: (d: Date, n: number) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  },
  addMonths: (d: Date, n: number) => {
    const x = new Date(d);
    x.setMonth(x.getMonth() + n, 1);
    return x;
  },
  startOfMonth: (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1),
  cmp: (a: Date, b: Date) => a.getTime() - b.getTime(),
  inRange: (d: Date, a: number, b: number) => d.getTime() > Math.min(a, b) && d.getTime() < Math.max(a, b),
};

function firstDayOfWeek(locale: string): number {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    const sundayFirst = ["US", "CA", "JP", "IL", "KR", "MX", "ZA", "BR", "PH", "CO", "SA", "TW", "HK"];
    const satFirst = ["AE", "AF", "BH", "DZ", "EG", "IQ", "JO", "KW", "LY", "OM", "QA", "SY"];
    if (region && satFirst.includes(region)) return 6;
    if (region && sundayFirst.includes(region)) return 0;
    return 1;
  } catch {
    return 1;
  }
}

function weekdayLabels(locale: string, weekStart: number): string[] {
  const base = new Date(2023, 0, 1); // Sunday
  const out: string[] = [];
  const f = new Intl.DateTimeFormat(locale, { weekday: "short" });
  for (let i = 0; i < 7; i++) out.push(f.format(D.addDays(base, (weekStart + i) % 7)));
  return out;
}

function monthMatrix(viewDate: Date, weekStart: number) {
  const first = D.startOfMonth(viewDate);
  const lead = (first.getDay() - weekStart + 7) % 7;
  const gridStart = D.addDays(first, -lead);
  const weeks: { date: Date; outside: boolean }[][] = [];
  for (let w = 0; w < 6; w++) {
    const days: { date: Date; outside: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = D.addDays(gridStart, w * 7 + d);
      days.push({ date, outside: date.getMonth() !== viewDate.getMonth() });
    }
    weeks.push(days);
  }
  return weeks;
}

function formatDisplay(date: Date | null, locale: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, opts || { year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

type Seg = { type: "literal"; value: string } | { type: "year" | "month" | "day" };

function fieldSegments(locale: string): Seg[] {
  const parts = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(2025, 10, 22));
  return parts.map((p) =>
    p.type === "literal"
      ? { type: "literal", value: p.value }
      : ({ type: p.type as "year" | "month" | "day" } as Seg),
  );
}

/* ---------------- icons ---------------- */
const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
export const CalIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={1.7} {...iconProps}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </svg>
);
const LeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={1.9} {...iconProps}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const RightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth={1.9} {...iconProps}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/* ---------------- Calendar (the WAI-ARIA grid) ---------------- */
type CalProps = {
  locale?: string;
  weekStart?: number;
  mode?: "single" | "range";
  value?: Date | null;
  rangeValue?: [Date | null, Date | null];
  hover?: Date | null;
  setHover?: (d: Date | null) => void;
  onPick?: (d: Date) => void;
  isDisabled?: (d: Date) => boolean;
  defaultView?: Date;
};

function Calendar(props: CalProps) {
  const { locale = "en-US", mode = "single", value, rangeValue, onPick, isDisabled, hover, setHover } = props;
  const weekStart = props.weekStart != null ? props.weekStart : firstDayOfWeek(locale);
  const [view, setView] = useState(() =>
    D.startOfMonth(props.defaultView || value || (rangeValue && rangeValue[0]) || D.today()),
  );
  const [focus, setFocus] = useState<Date>(() => value || (rangeValue && rangeValue[0]) || D.today());
  const [pane, setPane] = useState<"days" | "months" | "years">("days");
  const cellRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const today = D.today();

  useEffect(() => {
    if (!D.sameMonth(view, focus)) setView(D.startOfMonth(focus));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  const moveFocus = useCallback((next: Date) => {
    setFocus(next);
    requestAnimationFrame(() => {
      const el = cellRefs.current[D.iso(next)];
      if (el) el.focus();
    });
  }, []);

  const onKey = (e: KeyboardEvent, date: Date) => {
    const k = e.key;
    let next: Date | null = null;
    if (k === "ArrowLeft") next = D.addDays(date, -1);
    else if (k === "ArrowRight") next = D.addDays(date, 1);
    else if (k === "ArrowUp") next = D.addDays(date, -7);
    else if (k === "ArrowDown") next = D.addDays(date, 7);
    else if (k === "Home") next = D.addDays(date, -((date.getDay() - weekStart + 7) % 7));
    else if (k === "End") next = D.addDays(date, 6 - ((date.getDay() - weekStart + 7) % 7));
    else if (k === "PageUp") next = D.addMonths(date, e.shiftKey ? -12 : -1);
    else if (k === "PageDown") next = D.addMonths(date, e.shiftKey ? 12 : 1);
    else if (k === "Enter" || k === " ") {
      e.preventDefault();
      onPick?.(date);
      return;
    } else return;
    e.preventDefault();
    moveFocus(next);
  };

  const weeks = useMemo(() => monthMatrix(view, weekStart), [view, weekStart]);
  const labels = useMemo(() => weekdayLabels(locale, weekStart), [locale, weekStart]);

  function dayState(date: Date) {
    const cls = ["cal-day"];
    let selected = false;
    if (date.getMonth() !== view.getMonth()) cls.push("text-faint");
    if (D.same(date, today)) cls.push("today", "font-bold");
    if (mode === "single") {
      if (D.same(date, value)) selected = true;
    } else {
      const [s, e] = rangeValue || [];
      const end = e || (s && hover) || null;
      if (s && D.same(date, s)) {
        cls.push("range-start");
        selected = true;
      }
      if (end && D.same(date, end)) {
        cls.push("range-end");
        selected = true;
      }
      if (s && end && D.inRange(date, s.getTime(), end.getTime())) cls.push("in-range");
      if (s && !e && D.same(date, s)) cls.push("range-start", "range-end");
    }
    return { cls: cls.join(" "), selected };
  }

  const myBtn =
    "py-3 rounded-[9px] text-[13.5px] text-ink hover:bg-hover-strong transition-colors aria-selected:bg-accent aria-selected:text-on-accent aria-selected:font-semibold";

  if (pane === "months") {
    const monthFmt = new Intl.DateTimeFormat(locale, { month: "short" });
    return (
      <div className="select-none">
        <CalHead
          onPrev={() => setView(D.addMonths(view, -12))}
          onNext={() => setView(D.addMonths(view, 12))}
          heading={String(view.getFullYear())}
          onHeading={() => setPane("years")}
        />
        <div className="grid grid-cols-3 gap-1.5 py-1" role="grid">
          {Array.from({ length: 12 }).map((_, m) => (
            <button
              key={m}
              type="button"
              role="gridcell"
              className={myBtn}
              aria-selected={!!value && value.getMonth() === m && value.getFullYear() === view.getFullYear()}
              onClick={() => {
                setView(new Date(view.getFullYear(), m, 1));
                setPane("days");
              }}
            >
              {monthFmt.format(new Date(2025, m, 1))}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (pane === "years") {
    const start = view.getFullYear() - 6;
    return (
      <div className="select-none">
        <CalHead
          onPrev={() => setView(D.addMonths(view, -120))}
          onNext={() => setView(D.addMonths(view, 120))}
          heading={`${start}–${start + 11}`}
          onHeading={() => {}}
        />
        <div className="grid grid-cols-3 gap-1.5 py-1" role="grid">
          {Array.from({ length: 12 }).map((_, i) => {
            const y = start + i;
            return (
              <button
                key={y}
                type="button"
                role="gridcell"
                className={myBtn}
                aria-selected={!!value && value.getFullYear() === y}
                onClick={() => {
                  setView(new Date(y, view.getMonth(), 1));
                  setPane("months");
                }}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="select-none">
      <CalHead
        onPrev={() => setView(D.addMonths(view, -1))}
        onNext={() => setView(D.addMonths(view, 1))}
        heading={formatDisplay(view, locale, { month: "long", year: "numeric" })}
        onHeading={() => setPane("months")}
      />
      <table
        className="w-full border-collapse"
        role="grid"
        aria-label={formatDisplay(view, locale, { month: "long", year: "numeric" })}
      >
        <thead>
          <tr>
            {labels.map((l, i) => (
              <th
                key={i}
                scope="col"
                abbr={l}
                className="text-[11px] font-semibold text-muted py-1.5 text-center uppercase tracking-wide"
              >
                {l.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((cell) => {
                const { cls, selected } = dayState(cell.date);
                const disabled = isDisabled?.(cell.date);
                const isFocus = D.same(cell.date, focus);
                return (
                  <td key={D.iso(cell.date)} className="p-px text-center" role="gridcell" aria-selected={selected || undefined}>
                    <button
                      ref={(el) => {
                        cellRefs.current[D.iso(cell.date)] = el;
                      }}
                      type="button"
                      disabled={disabled}
                      tabIndex={isFocus ? 0 : -1}
                      aria-selected={selected || undefined}
                      aria-label={formatDisplay(cell.date, locale, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      aria-current={D.same(cell.date, today) ? "date" : undefined}
                      className={`relative grid place-items-center w-[34px] h-[34px] rounded-lg text-[13.5px] text-ink transition-colors hover:bg-hover-strong focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
                      onClick={() => {
                        setFocus(cell.date);
                        onPick?.(cell.date);
                      }}
                      onMouseEnter={() => setHover?.(cell.date)}
                      onKeyDown={(e) => onKey(e, cell.date)}
                    >
                      {cell.date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalHead({
  onPrev,
  onNext,
  heading,
  onHeading,
}: {
  onPrev: () => void;
  onNext: () => void;
  heading: string;
  onHeading: () => void;
}) {
  const navBtn =
    "grid place-items-center w-[30px] h-[30px] rounded-lg text-ink2 hover:bg-hover hover:text-ink transition-colors";
  return (
    <div className="flex items-center justify-between mb-2.5">
      <button type="button" aria-label="Previous" onClick={onPrev} className={navBtn}>
        <LeftIcon />
      </button>
      <button
        type="button"
        onClick={onHeading}
        className="text-sm font-[650] px-2.5 py-1 rounded-lg text-ink hover:bg-hover transition-colors"
      >
        {heading}
      </button>
      <button type="button" aria-label="Next" onClick={onNext} className={navBtn}>
        <RightIcon />
      </button>
    </div>
  );
}

/* ---------------- popover helper ---------------- */
function usePopover() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);
  return { open, setOpen, rootRef };
}

const fieldWrap = "flex flex-col gap-2 w-[260px]";
const labelCls = "text-[13px] font-semibold text-accent";
const inputCls =
  "flex-1 h-[42px] rounded-[10px] border border-line-strong bg-bg px-[13px] text-ink font-mono text-sm outline-none transition-[border-color,box-shadow] placeholder:text-faint focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";
const triggerCls =
  "grid place-items-center w-[42px] h-[42px] shrink-0 rounded-[10px] border border-line-strong bg-bg text-ink2 cursor-pointer transition-colors hover:border-accent hover:text-accent aria-expanded:border-accent aria-expanded:text-accent aria-expanded:bg-accent-soft";
const popoverCls =
  "rounded-[14px] border border-line-strong bg-card p-3.5 w-[296px] shadow-pop animate-pop";

/* ---------------- DatePicker ---------------- */
export function DatePicker({
  locale = "en-US",
  label = "Date",
  defaultValue = null,
}: {
  locale?: string;
  label?: string;
  defaultValue?: Date | null;
}) {
  const [value, setValue] = useState<Date | null>(defaultValue);
  const [text, setText] = useState(value ? formatDisplay(value, locale) : "");
  const { open, setOpen, rootRef } = usePopover();

  const placeholder = useMemo(
    () =>
      fieldSegments(locale)
        .map((s) => (s.type === "literal" ? s.value : s.type === "year" ? "yyyy" : s.type === "month" ? "mm" : "dd"))
        .join(""),
    [locale],
  );

  const commit = (d: Date | null) => {
    setValue(d);
    setText(d ? formatDisplay(d, locale) : "");
    setOpen(false);
  };

  return (
    <div className={`${fieldWrap} relative`} ref={rootRef}>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={text}
          placeholder={placeholder}
          spellCheck={false}
          aria-label={label}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => {
            const t = Date.parse(e.target.value);
            if (!isNaN(t)) commit(new Date(new Date(t).setHours(0, 0, 0, 0)));
          }}
        />
        <button
          type="button"
          className={triggerCls}
          aria-label="Open calendar"
          aria-expanded={open}
          aria-haspopup="grid"
          onClick={() => setOpen((o) => !o)}
        >
          <CalIcon />
        </button>
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-2 z-30">
          <div className={popoverCls} role="dialog" aria-label={label}>
            <Calendar locale={locale} mode="single" value={value} onPick={commit} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- DateRangePicker ---------------- */
export function DateRangePicker({
  locale = "en-US",
  label = "Stay",
  presets = true,
}: {
  locale?: string;
  label?: string;
  presets?: boolean;
}) {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);
  const [hover, setHover] = useState<Date | null>(null);
  const { open, setOpen, rootRef } = usePopover();
  const [start, end] = range;

  const pick = (d: Date) => {
    if (!start || (start && end)) setRange([d, null]);
    else setRange(D.cmp(d, start) < 0 ? [d, start] : [start, d]);
  };
  const applyPreset = (days: number) => {
    const t = D.today();
    setRange([t, D.addDays(t, days)]);
  };
  const text = start
    ? `${formatDisplay(start, locale, { month: "short", day: "numeric" })} → ${
        end ? formatDisplay(end, locale, { month: "short", day: "numeric" }) : "…"
      }`
    : "";

  const presetBtn =
    "flex-1 text-[12.5px] py-1.5 rounded-lg border border-line bg-transparent text-ink2 cursor-pointer transition-colors hover:border-accent hover:text-accent";

  return (
    <div className={`${fieldWrap} relative w-[280px]`} ref={rootRef}>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          className={`${inputCls} cursor-pointer whitespace-nowrap`}
          value={text}
          placeholder="Select dates"
          readOnly
          onClick={() => setOpen(true)}
        />
        <button
          type="button"
          className={triggerCls}
          aria-label="Open calendar"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <CalIcon />
        </button>
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-2 z-30">
          <div className={popoverCls} role="dialog" aria-label={label}>
            <Calendar locale={locale} mode="range" rangeValue={range} hover={hover} setHover={setHover} onPick={pick} />
            {presets && (
              <div className="flex gap-2 mt-2.5 pt-2.5 border-t border-line">
                <button type="button" className={presetBtn} onClick={() => applyPreset(3)}>
                  +3 nights
                </button>
                <button type="button" className={presetBtn} onClick={() => applyPreset(7)}>
                  +1 week
                </button>
                <button type="button" className={presetBtn} onClick={() => setRange([null, null])}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- DateField (segmented, locale-aware) ---------------- */
export function DateField({
  locale = "en-US",
  label = "Date of birth",
  defaultValue = null,
}: {
  locale?: string;
  label?: string;
  defaultValue?: Date | null;
}) {
  const segs = useMemo(() => fieldSegments(locale), [locale]);
  const [vals, setVals] = useState<{ year: number | null; month: number | null; day: number | null }>(() => {
    const v = defaultValue;
    return {
      year: v ? v.getFullYear() : null,
      month: v ? v.getMonth() + 1 : null,
      day: v ? v.getDate() : null,
    };
  });
  const [focused, setFocused] = useState(false);
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});

  const editable = segs.filter((s) => s.type !== "literal") as { type: "year" | "month" | "day" }[];
  const place = { year: "yyyy", month: "mm", day: "dd" } as const;
  const max = { year: 9999, month: 12, day: 31 } as const;

  const fmtSeg = (type: "year" | "month" | "day", val: number | null) => {
    if (val == null) return place[type];
    if (type === "year") return String(val).padStart(4, "0");
    return String(val).padStart(2, "0");
  };
  const focusNext = (type: string) => {
    const i = editable.findIndex((s) => s.type === type);
    const nx = editable[i + 1];
    if (nx) refs.current[nx.type]?.focus();
  };

  const onSegKey = (e: KeyboardEvent, type: "year" | "month" | "day") => {
    const cur = vals[type];
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      let next =
        cur != null && String(cur).length < (type === "year" ? 4 : 2) ? Number(String(cur) + e.key) : Number(e.key);
      if (next > max[type]) next = Number(e.key);
      const filled = String(next).length >= (type === "year" ? 4 : 2) || (type !== "year" && next * 10 > max[type]);
      setVals((v) => ({ ...v, [type]: next }));
      if (filled) focusNext(type);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const d = e.key === "ArrowUp" ? 1 : -1;
      const base = cur == null ? (type === "year" ? new Date().getFullYear() : 1) : cur;
      let nv = base + d;
      const hi = max[type];
      if (nv > hi) nv = 1;
      if (nv < 1) nv = hi;
      setVals((v) => ({ ...v, [type]: nv }));
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setVals((v) => ({ ...v, [type]: null }));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNext(type);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const i = editable.findIndex((s) => s.type === type);
      const pv = editable[i - 1];
      if (pv) refs.current[pv.type]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>{label}</label>
      <div
        className={`inline-flex items-center h-[42px] rounded-[10px] border bg-bg px-2.5 font-mono text-[15px] transition-[border-color,box-shadow] ${
          focused ? "border-accent shadow-[0_0_0_3px_var(--accent-soft)]" : "border-line-strong"
        }`}
        role="group"
        aria-label={label}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
        }}
      >
        {segs.map((s, i) =>
          s.type === "literal" ? (
            <span key={i} className="text-faint">
              {s.value}
            </span>
          ) : (
            <span
              key={i}
              ref={(el) => {
                refs.current[s.type] = el;
              }}
              role="spinbutton"
              tabIndex={0}
              aria-label={s.type}
              aria-valuenow={vals[s.type] || undefined}
              aria-valuetext={fmtSeg(s.type, vals[s.type])}
              data-placeholder={vals[s.type] == null}
              onKeyDown={(e) => onSegKey(e, s.type)}
              className="kf-seg px-[3px] py-0.5 rounded text-ink text-center min-w-[1ch] tabular-nums cursor-text data-[placeholder=true]:text-faint"
            >
              {fmtSeg(s.type, vals[s.type])}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/* ---------------- Inline Calendar ---------------- */
export function InlineCalendar({ locale = "en-US", defaultValue = null }: { locale?: string; defaultValue?: Date | null }) {
  const [value, setValue] = useState<Date | null>(defaultValue);
  return (
    <div className="rounded-[14px] border border-line-strong bg-card p-3.5 w-[296px] shadow-pop">
      <Calendar locale={locale} mode="single" value={value} onPick={setValue} />
    </div>
  );
}

export function LiveDemo({ kind, locale = "en-US" }: { kind: DemoKind; locale?: string }) {
  if (kind === "calendar") return <InlineCalendar locale={locale} defaultValue={D.today()} />;
  if (kind === "date-picker") return <DatePicker locale={locale} label="Pick a date" />;
  if (kind === "date-range-picker") return <DateRangePicker locale={locale} label="Trip dates" />;
  return <DateField locale={locale} label="Date of birth" />;
}

type DemoKind = "calendar" | "date-picker" | "date-range-picker" | "date-field";
