"use client";

import {
  useState,
  type ReactNode,
} from "react";
import {
  DatePicker as KenosDatePicker,
  useDatePickerContext,
  type DateRange,
} from "@kenos-ui/react-datepicker";
import { Select as KenosSelect } from "@kenos-ui/react-select";


/* ============================================================
   Real @kenos-ui/react-datepicker-powered demo components.
   These replace the old self-contained fake primitives.
   They compose the official headless parts + apply the site's
   exact visual styling (shells, sizes, colors, states) so the
   live previews look & feel identical while actually running
   the real library code (reducer, timescape, floating-ui, Intl, etc.).
   ============================================================ */

export type DemoKind = "calendar" | "date-picker" | "date-range-picker" | "date-field" | "select";
export type CalSize = "default" | "compact";

/* ---------------- icons (ported from old fake for visual match) ---------------- */
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

/* ---------------- demo shell / size classes (ported + adapted for real parts) ---------------- */
// Shell width = horizontal padding (p-3.5 → 28px, p-2 → 16px) + 7 columns × cell size (36px / 28px).
const calTableLayout =
  "[&_table]:!table-fixed [&_table]:!w-full [&_table]:!border-collapse [&_table]:!border-spacing-0 [&_tr]:!table-row [&_td]:!table-cell [&_td]:!p-0 [&_td]:!text-center [&_th]:!table-cell [&_th]:!p-0 [&_th]:!text-center [&_thead]:!table-header-group [&_tbody]:!table-row-group";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900";

const segmentFocus =
  "[&_input]:rounded-md [&_input]:transition-[background-color,color,box-shadow] [&_input:focus]:!bg-zinc-100 [&_input:focus]:!text-white [&_input:focus]:shadow-sm [&_input::placeholder]:text-zinc-500 dark:[&_input::placeholder]:text-zinc-400 [&_[data-separator]]:font-medium [&_[data-separator]]:text-zinc-500 dark:[&_[data-separator]]:text-zinc-400";

const inputFocusWithin =
  "transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-zinc-100 focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:shadow-[0_0_0_3px_rgb(250 250 250 / 0.15)] dark:focus-within:shadow-[0_0_0_3px_rgb(250 250 250 / 0.12)]";

const DEMO_SHELL: Record<CalSize, string> = {
  default: `rounded-[14px] border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-900 p-3.5 shadow-lg shadow-zinc-900/5 dark:shadow-black/30 ${calTableLayout}`,
  compact: `rounded-[12px] border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-900 p-2 max-w-full shadow-lg shadow-zinc-900/5 dark:shadow-black/30 ${calTableLayout}`,
};

const DEMO_SHELL_W: Record<CalSize, string> = {
  default: "w-[280px] min-w-[280px]",
  compact: "w-[212px] min-w-[212px]",
};

const demoShell = (size: CalSize) => `${DEMO_SHELL[size]} ${DEMO_SHELL_W[size]}`;

const DEMO_DAY_BASE: Record<CalSize, string> = {
  default: [
    "relative z-0 mx-auto grid size-[36px] cursor-default place-items-center rounded-lg text-[14px] font-medium tabular-nums",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-zinc-200/90 hover:text-zinc-950 dark:hover:bg-zinc-700/90 dark:hover:text-zinc-50",
    "data-[outside-month]:hover:bg-zinc-100/70 dark:data-[outside-month]:hover:bg-zinc-800/50",
    focusRing,
    "focus-visible:z-10 aria-selected:z-10",
    "active:scale-[0.97] aria-selected:active:scale-100",
  ].join(" "),
  compact: [
    "relative z-0 mx-auto grid size-[28px] cursor-default place-items-center rounded-md text-[12.5px] font-medium tabular-nums",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-zinc-200/90 hover:text-zinc-950 dark:hover:bg-zinc-700/90 dark:hover:text-zinc-50",
    "data-[outside-month]:hover:bg-zinc-100/70 dark:data-[outside-month]:hover:bg-zinc-800/50",
    focusRing,
    "focus-visible:z-10 aria-selected:z-10",
    "active:scale-[0.97] aria-selected:active:scale-100",
  ].join(" "),
};

const DEMO_WEEKDAY: Record<CalSize, string> = {
  default:
    "text-[12px] font-bold text-zinc-600 dark:text-zinc-300 py-2 text-center uppercase tracking-[0.05em]",
  compact:
    "text-[10.5px] font-bold text-zinc-600 dark:text-zinc-300 py-1 text-center uppercase tracking-[0.05em]",
};

const DEMO_HEAD_NAV: Record<CalSize, string> = {
  default: [
    "grid place-items-center w-[30px] h-[30px] shrink-0 rounded-lg",
    "text-zinc-600 dark:text-zinc-300",
    "transition-[background-color,color,transform,box-shadow] duration-150",
    "hover:bg-zinc-200/90 hover:text-zinc-900 dark:hover:bg-zinc-700/90 dark:hover:text-zinc-50",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-35",
    focusRing,
  ].join(" "),
  compact: [
    "grid place-items-center w-[26px] h-[26px] shrink-0 rounded-md",
    "text-zinc-600 dark:text-zinc-300",
    "transition-[background-color,color,transform,box-shadow] duration-150",
    "hover:bg-zinc-200/90 hover:text-zinc-900 dark:hover:bg-zinc-700/90 dark:hover:text-zinc-50",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-35",
    focusRing,
  ].join(" "),
};

const DEMO_HEAD_TITLE: Record<CalSize, string> = {
  default: [
    "rounded-lg px-2.5 py-1 text-[15px] font-[650] text-zinc-900 dark:text-zinc-100",
    "transition-[background-color,color,box-shadow] duration-150",
    "hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90",
    "active:bg-zinc-300/80 dark:active:bg-zinc-600/80",
    focusRing,
  ].join(" "),
  compact: [
    "rounded-md px-2 py-0.5 text-[13px] font-[650] text-zinc-900 dark:text-zinc-100",
    "transition-[background-color,color,box-shadow] duration-150",
    "hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90",
    "active:bg-zinc-300/80 dark:active:bg-zinc-600/80",
    focusRing,
  ].join(" "),
};

const DEMO_MONTH_YEAR_GRID: Record<CalSize, string> = {
  default: "grid w-full grid-cols-3 gap-2 py-1.5",
  compact: "grid w-full grid-cols-3 gap-1.5 py-1",
};

const DEMO_MONTH_YEAR_CELL: Record<CalSize, string> = {
  default: [
    "flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-lg px-1.5 py-2",
    "text-center text-[13px] font-medium leading-tight text-zinc-800 dark:text-zinc-200",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90",
    "active:scale-[0.98] aria-selected:active:scale-100",
    focusRing,
    "aria-selected:bg-zinc-100 aria-selected:!text-white aria-selected:font-semibold",
    "disabled:pointer-events-none disabled:opacity-35",
  ].join(" "),
  compact: [
    "flex min-h-[36px] w-full min-w-0 items-center justify-center rounded-md px-1 py-1.5",
    "text-center text-[11.5px] font-medium leading-tight text-zinc-800 dark:text-zinc-200",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-zinc-200/90 dark:hover:bg-zinc-700/90",
    "active:scale-[0.98] aria-selected:active:scale-100",
    focusRing,
    "aria-selected:bg-zinc-100 aria-selected:!text-white aria-selected:font-semibold",
    "disabled:pointer-events-none disabled:opacity-35",
  ].join(" "),
};

const DEMO_YEAR_CELL: Record<CalSize, string> = {
  default: [
    DEMO_MONTH_YEAR_CELL.default,
    "tabular-nums text-[14px] tracking-tight",
  ].join(" "),
  compact: [DEMO_MONTH_YEAR_CELL.compact, "tabular-nums text-[12px] tracking-tight"].join(" "),
};

/** Short month labels fit the 3-column grid; full name kept for tooltips. */
function demoMonthLabel(locale: string, monthIndex: number) {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2024, monthIndex, 1));
}

const labelCls = "text-[13px] font-semibold text-zinc-200 dark:text-zinc-300";
const fieldWrap = (compact?: boolean) =>
  compact ? "flex flex-col gap-2 w-[228px] max-w-full" : "flex flex-col gap-2 w-[260px]";

const rangeFieldWrap = "flex w-fit max-w-full flex-col items-start gap-2";

const rangeInputCls = [
  "inline-flex h-[42px] min-w-0 w-full max-w-[108px] items-center rounded-[10px]",
  "border border-zinc-300/90 bg-white px-2 font-mono text-[13px] tabular-nums text-zinc-900",
  "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
  inputFocusWithin,
  segmentFocus,
  "[&_input]:px-0.5 [&_input]:py-0.5",
].join(" ");

const inputCls = [
  "inline-flex h-[42px] min-w-0 flex-1 items-center rounded-[10px]",
  "border border-zinc-300/90 bg-white px-[13px] font-mono text-sm tabular-nums text-zinc-900",
  "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
  inputFocusWithin,
  segmentFocus,
  "[&_input]:px-1 [&_input]:py-0.5",
].join(" ");

const dateFieldWrap = "flex w-fit max-w-full flex-col items-start gap-2";

const dateFieldInputCls = [
  "inline-flex h-[42px] w-fit cursor-text items-center justify-start gap-0.5 rounded-[10px]",
  "border border-zinc-300/90 bg-white px-2.5 font-mono text-sm tabular-nums text-zinc-900",
  "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
  inputFocusWithin,
  segmentFocus,
  "[&_input]:px-1 [&_input]:py-0.5 [&_[data-separator]]:select-none [&_[data-separator]]:px-0.5",
].join(" ");

const triggerCls = [
  "grid h-[42px] w-[42px] shrink-0 cursor-pointer place-items-center rounded-[10px]",
  "border border-zinc-300/90 bg-white text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
  "transition-[border-color,background-color,color,transform,box-shadow] duration-150",
  "hover:border-zinc-100 hover:bg-zinc-100/5 hover:text-zinc-200 dark:hover:text-zinc-300",
  "active:scale-[0.97]",
  "aria-expanded:border-zinc-100 aria-expanded:bg-zinc-100/12 aria-expanded:text-zinc-200 dark:aria-expanded:text-zinc-300",
  focusRing,
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const presetBtn = [
  "min-h-[34px] flex-1 cursor-pointer rounded-lg border py-1.5 text-[12.5px] font-medium",
  "border-zinc-300/90 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200",
  "transition-[border-color,background-color,color,transform,box-shadow] duration-150",
  "hover:border-zinc-100 hover:bg-zinc-100/12 hover:text-zinc-200 dark:hover:text-zinc-300",
  "active:scale-[0.98] active:bg-zinc-100/18",
  focusRing,
].join(" ");

const popoverAlign = {
  side: "bottom" as const,
  align: "center" as const,
  sideOffset: 8,
};

/** Today accent only when the cell is not selected — avoids clashing with the selected state. */
const demoTodayUnselected =
  "data-[today]:font-bold data-[today]:[&:not([aria-selected=true])]:text-zinc-200 dark:data-[today]:[&:not([aria-selected=true])]:text-zinc-300 data-[today]:[&:not([aria-selected=true])]:ring-1 data-[today]:[&:not([aria-selected=true])]:ring-zinc-100/50 data-[today]:[&:not([aria-selected=true])]:ring-inset";

const demoDayStates = [
  "text-zinc-800 dark:text-zinc-100",
  "data-disabled:cursor-not-allowed data-disabled:opacity-30 data-disabled:hover:bg-transparent",
  "aria-selected:bg-zinc-100 aria-selected:!text-white aria-selected:font-semibold",
  "aria-selected:hover:bg-zinc-200 dark:aria-selected:hover:bg-zinc-100",
  "aria-selected:focus-visible:ring-offset-zinc-100",
  demoTodayUnselected,
  "aria-selected:data-[today]:!text-white aria-selected:data-[today]:ring-2 aria-selected:data-[today]:ring-white/70 aria-selected:data-[today]:ring-inset",
  "data-[outside-month]:text-zinc-400 dark:data-[outside-month]:text-zinc-500",
].join(" ");

const demoDayCls = (size: CalSize) => `${DEMO_DAY_BASE[size]} ${demoDayStates}`;

const demoRangeDayCls = (size: CalSize) =>
  [
    demoDayCls(size),
    "data-[in-range]:bg-zinc-100/28 data-[in-range]:text-zinc-900 dark:data-[in-range]:bg-zinc-100/22 dark:data-[in-range]:text-zinc-100",
    "data-[in-range]:hover:bg-zinc-100/36 dark:data-[in-range]:hover:bg-zinc-100/30",
    "data-[in-range]:rounded-none",
    "data-[range-start]:rounded-l-lg data-[range-end]:rounded-r-lg data-[range-start]:data-[range-end]:rounded-lg",
    "data-[range-start]:z-[1] data-[range-end]:z-[1]",
    "data-[range-start]:bg-zinc-100 data-[range-end]:bg-zinc-100",
    "data-[range-start]:!text-white data-[range-end]:!text-white data-[range-start]:font-semibold data-[range-end]:font-semibold",
    "data-[range-start]:data-[today]:!text-white data-[range-end]:data-[today]:!text-white",
    "data-[range-start]:hover:bg-zinc-200 data-[range-end]:hover:bg-zinc-200",
  ].join(" ");

/* ---------------- helpers ---------------- */
function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function RangePresets() {
  const { dispatch } = useDatePickerContext();

  const applyPreset = (nights: number) => {
    const start = today();
    const end = new Date(start);
    end.setDate(start.getDate() + nights);
    dispatch({ type: "SET_RANGE", start, end });
  };

  const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="mt-2.5 flex gap-2 border-t border-zinc-200/90 pt-2.5 dark:border-zinc-700/80">
      <button
        type="button"
        className={presetBtn}
        onMouseDown={preventFocusSteal}
        onClick={() => applyPreset(3)}
      >
        +3 nights
      </button>
      <button
        type="button"
        className={presetBtn}
        onMouseDown={preventFocusSteal}
        onClick={() => applyPreset(7)}
      >
        +1 week
      </button>
      <button
        type="button"
        className={presetBtn}
        onMouseDown={preventFocusSteal}
        onClick={() => dispatch({ type: "SET_RANGE", start: null, end: null })}
      >
        Clear
      </button>
    </div>
  );
}

/* ---------------- Inline / bare Calendar (for "calendar" kind + accessibility etc.) ---------------- */
export function InlineCalendar({
  locale = "en-US",
  defaultValue = null,
  size = "default" as CalSize,
}: {
  locale?: string;
  defaultValue?: Date | null;
  size?: CalSize;
}) {
  const [value, setValue] = useState<Date | null>(defaultValue);
  const shell = demoShell(size);
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  // We use low-level composition for full control over classes + to wrap in the demo shell
  return (
    <KenosDatePicker.Root
      mode="single"
      locale={locale}
      defaultValue={value}
      onValueChange={setValue}
    >
      <div className={shell} data-cal-size={size}>
        <div className={`flex items-center justify-between ${size === "default" ? "mb-2.5" : "mb-2"}`}>
          <KenosDatePicker.PrevTrigger className={headNav} aria-label="Previous">
            <LeftIcon />
          </KenosDatePicker.PrevTrigger>
          <KenosDatePicker.ViewTrigger className={headTitle} />
          <KenosDatePicker.NextTrigger className={headNav} aria-label="Next">
            <RightIcon />
          </KenosDatePicker.NextTrigger>
        </div>

        <KenosDatePicker.View view="day">
          <KenosDatePicker.Grid
            className="w-full border-collapse table-fixed"
            header={
              <KenosDatePicker.WeekDays className={weekdayCls} />
            }
          >
            {({ weeks }) =>
              weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((date, di) => (
                    <KenosDatePicker.Day
                      key={di}
                      date={date}
                      className={demoDayCls(size)}
                    />
                  ))}
                </tr>
              ))
            }
          </KenosDatePicker.Grid>
        </KenosDatePicker.View>

        {/* Month / Year views for full parity with old demo (switch via ViewTrigger) */}
        <KenosDatePicker.View view="month">
          <KenosDatePicker.MonthGrid className={DEMO_MONTH_YEAR_GRID[size]}>
            {({ months }) => (
              <>
                {months.map((m) => (
                  <KenosDatePicker.MonthCell
                    key={m.value}
                    value={m.value}
                    disabled={m.isDisabled}
                    title={m.label}
                    className={DEMO_MONTH_YEAR_CELL[size]}
                  >
                    {demoMonthLabel(locale, m.value)}
                  </KenosDatePicker.MonthCell>
                ))}
              </>
            )}
          </KenosDatePicker.MonthGrid>
        </KenosDatePicker.View>

        <KenosDatePicker.View view="year">
          <KenosDatePicker.YearGrid className={DEMO_MONTH_YEAR_GRID[size]}>
            {({ years }) => (
              <>
                {years.map((y) => (
                  <KenosDatePicker.YearCell
                    key={y.value}
                    value={y.value}
                    disabled={y.isDisabled}
                    className={DEMO_YEAR_CELL[size]}
                  >
                    {y.value}
                  </KenosDatePicker.YearCell>
                ))}
              </>
            )}
          </KenosDatePicker.YearGrid>
        </KenosDatePicker.View>
      </div>
    </KenosDatePicker.Root>
  );
}

/* ---------------- DatePicker (simple prop API for quick renders + pages) ---------------- */
export function DatePicker({
  locale = "en-US",
  label = "Date",
  defaultValue = null,
  size = "default" as CalSize,
  defaultOpen = false,
}: {
  locale?: string;
  label?: string;
  defaultValue?: Date | null;
  size?: CalSize;
  defaultOpen?: boolean;
}) {
  const compact = size === "compact";
  const shell = demoShell(size);
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  return (
    <KenosDatePicker.Root
      mode="single"
      locale={locale}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
    >
      <div className={fieldWrap(compact)}>
        <label className={labelCls}>{label}</label>
        <div className="flex items-center gap-2">
          <KenosDatePicker.Input className={inputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>

        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={shell}
          role="dialog"
          aria-label={label}
          data-cal-size={size}
        >
          <div className={`flex items-center justify-between ${compact ? "mb-2" : "mb-2.5"}`}>
            <KenosDatePicker.PrevTrigger className={headNav} aria-label="Previous">
              <LeftIcon />
            </KenosDatePicker.PrevTrigger>
            <KenosDatePicker.ViewTrigger className={headTitle} />
            <KenosDatePicker.NextTrigger className={headNav} aria-label="Next">
              <RightIcon />
            </KenosDatePicker.NextTrigger>
          </div>

          <KenosDatePicker.View view="day">
            <KenosDatePicker.Grid
              className="w-full border-collapse table-fixed"
              header={<KenosDatePicker.WeekDays className={weekdayCls} />}
            >
              {({ weeks }) =>
                weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((date, di) => (
                      <KenosDatePicker.Day
                        key={di}
                        date={date}
                        className={demoDayCls(size)}
                      />
                    ))}
                  </tr>
                ))
              }
            </KenosDatePicker.Grid>
          </KenosDatePicker.View>

          {/* Support month/year panes like the old demo */}
          <KenosDatePicker.View view="month">
            <KenosDatePicker.MonthGrid className={DEMO_MONTH_YEAR_GRID[size]}>
              {({ months }) => (
                <>
                  {months.map((m) => (
                    <KenosDatePicker.MonthCell
                      key={m.value}
                      value={m.value}
                      disabled={m.isDisabled}
                      title={m.label}
                      className={DEMO_MONTH_YEAR_CELL[size]}
                    >
                      {demoMonthLabel(locale, m.value)}
                    </KenosDatePicker.MonthCell>
                  ))}
                </>
              )}
            </KenosDatePicker.MonthGrid>
          </KenosDatePicker.View>

          <KenosDatePicker.View view="year">
            <KenosDatePicker.YearGrid className={DEMO_MONTH_YEAR_GRID[size]}>
              {({ years }) => (
                <>
                  {years.map((y) => (
                    <KenosDatePicker.YearCell
                      key={y.value}
                      value={y.value}
                      disabled={y.isDisabled}
                      className={DEMO_YEAR_CELL[size]}
                    >
                      {y.value}
                    </KenosDatePicker.YearCell>
                  ))}
                </>
              )}
            </KenosDatePicker.YearGrid>
          </KenosDatePicker.View>
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

/* ---------------- DateRangePicker (with optional presets) ---------------- */
export function DateRangePicker({
  locale = "en-US",
  label = "Stay",
  presets = true,
  size = "default" as CalSize,
  defaultOpen = false,
}: {
  locale?: string;
  label?: string;
  presets?: boolean;
  size?: CalSize;
  defaultOpen?: boolean;
}) {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const compact = size === "compact";
  const shell = demoShell(size);
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  return (
    <KenosDatePicker.Root
      mode="range"
      locale={locale}
      onValueChange={setRange}
      defaultOpen={defaultOpen}
      closeOnSelect={false}
    >
      <div className={`${compact ? fieldWrap(compact) : rangeFieldWrap} mx-auto`}>
        <label className={labelCls}>{label}</label>
        <div
          className={
            compact
              ? "flex items-center gap-2"
              : "grid w-full grid-cols-[minmax(0,108px)_auto_minmax(0,108px)_auto] items-center gap-x-2 gap-y-0"
          }
        >
          {compact ? (
            <div
              className={`${inputCls} max-w-none cursor-pointer whitespace-nowrap text-zinc-700 dark:text-zinc-200`}
            >
              {range.start
                ? `${range.start.toLocaleDateString(locale, { month: "short", day: "numeric" })} → ${range.end ? range.end.toLocaleDateString(locale, { month: "short", day: "numeric" }) : "…"}`
                : "Select dates"}
            </div>
          ) : (
            <>
              <KenosDatePicker.Input index={0} className={rangeInputCls} />
              <span
                className="shrink-0 font-medium text-zinc-500 dark:text-zinc-400"
                aria-hidden
              >
                →
              </span>
              <KenosDatePicker.Input index={1} className={rangeInputCls} />
            </>
          )}
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>

        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={shell}
          role="dialog"
          aria-label={label}
          data-cal-size={size}
        >
          <div className={`flex items-center justify-between ${compact ? "mb-2" : "mb-2.5"}`}>
            <KenosDatePicker.PrevTrigger className={headNav} aria-label="Previous">
              <LeftIcon />
            </KenosDatePicker.PrevTrigger>
            <KenosDatePicker.ViewTrigger className={headTitle} />
            <KenosDatePicker.NextTrigger className={headNav} aria-label="Next">
              <RightIcon />
            </KenosDatePicker.NextTrigger>
          </div>

          <KenosDatePicker.View view="day">
            <KenosDatePicker.Grid
              className="w-full border-collapse table-fixed"
              header={<KenosDatePicker.WeekDays className={weekdayCls} />}
            >
              {({ weeks }) =>
                weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((date, di) => (
                      <KenosDatePicker.Day
                        key={di}
                        date={date}
                        className={demoRangeDayCls(size)}
                      />
                    ))}
                  </tr>
                ))
              }
            </KenosDatePicker.Grid>
          </KenosDatePicker.View>

          {presets && <RangePresets />}
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

/* ---------------- DateField (pure segmented, no popover) using real Input ---------------- */
export function DateField({
  locale = "en-US",
  label = "Date of birth",
  defaultValue = null,
}: {
  locale?: string;
  label?: string;
  defaultValue?: Date | null;
}) {
  return (
    <KenosDatePicker.Root
      mode="single"
      locale={locale}
      defaultValue={defaultValue}
    >
      <div className={`${dateFieldWrap} mx-auto`}>
        <label className={labelCls}>{label}</label>
        <KenosDatePicker.Input className={dateFieldInputCls} />
      </div>
    </KenosDatePicker.Root>
  );
}

const selectTriggerCls = [
  "flex w-full min-w-[240px] items-center justify-between gap-2 rounded-[10px] border border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm",
  "transition-[border-color,box-shadow] duration-150",
  "hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40",
  "dark:border-zinc-700/80 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-600",
].join(" ");

const selectContentCls = [
  "z-50 mt-1 max-h-60 overflow-auto rounded-[10px] border border-zinc-200/90 bg-white p-1 shadow-lg",
  "dark:border-zinc-700/80 dark:bg-zinc-950",
].join(" ");

const selectItemCls = [
  "cursor-default rounded-md px-2.5 py-2 text-sm text-zinc-800 outline-none",
  "data-[highlighted]:bg-zinc-100 data-[selected]:font-medium dark:text-zinc-100 dark:data-[highlighted]:bg-zinc-800",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
].join(" ");

const selectFrameworkOptions = [
  ["react", "React"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
] as const;

const selectThemeOptions = [
  ["light", "Light"],
  ["dark", "Dark"],
] as const;

export function SelectDemo({
  label = "Framework",
  name = "framework",
  defaultValue = "react",
  options = selectFrameworkOptions,
}: {
  label?: string;
  name?: string;
  defaultValue?: string;
  options?: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <KenosSelect.Root name={name} defaultValue={defaultValue}>
      <KenosSelect.Label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {label}
      </KenosSelect.Label>
      <KenosSelect.Trigger className={selectTriggerCls}>
        <KenosSelect.Value placeholder="Choose…" />
        <KenosSelect.Icon />
      </KenosSelect.Trigger>
      <KenosSelect.Content className={selectContentCls} sameWidth>
        <KenosSelect.List>
          {options.map(([value, text]) => (
            <KenosSelect.Item key={value} value={value} className={selectItemCls}>
              <KenosSelect.ItemText>{text}</KenosSelect.ItemText>
            </KenosSelect.Item>
          ))}
        </KenosSelect.List>
      </KenosSelect.Content>
      <KenosSelect.HiddenSelect />
    </KenosSelect.Root>
  );
}

export function SelectDialogDemo() {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="w-full max-w-sm rounded-xl border border-zinc-200/90 bg-zinc-50 p-4 shadow-lg dark:border-zinc-700/80 dark:bg-zinc-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Settings</h3>
      <SelectDemo
        label="Theme"
        name="theme"
        defaultValue="light"
        options={selectThemeOptions}
      />
    </div>
  );
}

export function SelectFormDemo() {
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SelectDemo label="Country" name="country" defaultValue="react" />
      <button
        type="submit"
        className="min-h-9 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        Submit
      </button>
    </form>
  );
}

/* ---------------- LiveDemo dispatcher (used by component pages) ---------------- */
export function LiveDemo({ kind, locale = "en-US" }: { kind: DemoKind; locale?: string }) {
  if (kind === "calendar") {
    return <InlineCalendar locale={locale} defaultValue={today()} />;
  }
  if (kind === "date-picker") {
    return <DatePicker locale={locale} label="Pick a date" />;
  }
  if (kind === "date-range-picker") {
    return <DateRangePicker locale={locale} label="Trip dates" />;
  }
  if (kind === "select") {
    return <SelectDemo />;
  }
  return <DateField locale={locale} label="Date of birth" />;
}
