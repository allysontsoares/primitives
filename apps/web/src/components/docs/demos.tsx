"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useTanStackForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  DatePicker as KenosDatePicker,
  useDatePickerActions,
  type DateRange,
} from "@kenos-ui/react-datepicker";
import {
  DP_CAL_SHORTHAND_POPOVER_CLS,
  DP_CONTROL_ROW_CLS,
  DP_DATE_FIELD_INPUT_CLS,
  DP_DATE_FIELD_WRAP_CLS,
  DP_FIELD_WRAP_CLS,
  DP_LABEL_CLS,
  DP_PICKER_INPUT_CLS,
  DP_TRIGGER_CLS,
} from "@/components/ui/date-picker.variants";
import { Combobox as KenosCombobox } from "@kenos-ui/react-combobox";
import { Select as KenosSelect } from "@kenos-ui/react-select";

/* ============================================================
   Real @kenos-ui/react-datepicker-powered demo components.
   These replace the old self-contained fake primitives.
   They compose the official headless parts + apply the site's
   exact visual styling (shells, sizes, colors, states) so the
   live previews look & feel identical while actually running
   the real library code (reducer, timescape, floating-ui, Intl, etc.).
   ============================================================ */

export type DemoKind = "date-picker" | "select" | "combobox";
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
  "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900";

const segmentFocus =
  "[&_input]:rounded-md [&_input]:transition-[background-color,color,box-shadow] [&_input:focus]:!bg-indigo-600 [&_input:focus]:!text-white dark:[&_input:focus]:!bg-indigo-500 dark:[&_input:focus]:!text-white [&_input:focus]:shadow-sm [&_input::selection]:bg-transparent [&_input::placeholder]:text-zinc-500 dark:[&_input::placeholder]:text-zinc-400 [&_[data-separator]]:font-medium [&_[data-separator]]:text-zinc-500 dark:[&_[data-separator]]:text-zinc-400";

const inputFocusWithin =
  "transition-[border-color,box-shadow,background-color] duration-150 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-zinc-950 focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.18)] dark:focus-within:shadow-[0_0_0_3px_rgb(129_140_248_/_0.18)]";

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
    "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-100",
    "data-[outside-month]:hover:bg-indigo-50/60 dark:data-[outside-month]:hover:bg-indigo-500/10",
    focusRing,
    "focus-visible:z-10 aria-selected:z-10",
    "active:scale-[0.97] aria-selected:active:scale-100",
  ].join(" "),
  compact: [
    "relative z-0 mx-auto grid size-[28px] cursor-default place-items-center rounded-md text-[12.5px] font-medium tabular-nums",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-100",
    "data-[outside-month]:hover:bg-indigo-50/60 dark:data-[outside-month]:hover:bg-indigo-500/10",
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
    "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-35",
    focusRing,
  ].join(" "),
  compact: [
    "grid place-items-center w-[26px] h-[26px] shrink-0 rounded-md",
    "text-zinc-600 dark:text-zinc-300",
    "transition-[background-color,color,transform,box-shadow] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-35",
    focusRing,
  ].join(" "),
};

const DEMO_HEAD_TITLE: Record<CalSize, string> = {
  default: [
    "rounded-lg px-2.5 py-1 text-[15px] font-[650] text-zinc-900 dark:text-zinc-100",
    "transition-[background-color,color,box-shadow] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
    "active:bg-indigo-100/80 dark:active:bg-indigo-500/25",
    focusRing,
  ].join(" "),
  compact: [
    "rounded-md px-2 py-0.5 text-[13px] font-[650] text-zinc-900 dark:text-zinc-100",
    "transition-[background-color,color,box-shadow] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
    "active:bg-indigo-100/80 dark:active:bg-indigo-500/25",
    focusRing,
  ].join(" "),
};

const DEMO_MONTH_YEAR_GRID: Record<CalSize, string> = {
  default: "grid w-full grid-cols-3 gap-2 py-1.5",
  compact: "grid w-full grid-cols-3 gap-1.5 py-1",
};

/** Today accent only when the cell is not selected — avoids clashing with the selected state. */
const demoSelectedCls =
  "aria-selected:bg-indigo-600 aria-selected:text-white aria-selected:font-semibold dark:aria-selected:bg-indigo-500 dark:aria-selected:text-white aria-selected:hover:bg-indigo-700 dark:aria-selected:hover:bg-indigo-400 aria-selected:shadow-sm aria-selected:shadow-indigo-600/25";

const demoTodayUnselected =
  "data-[today]:font-bold data-[today]:[&:not([aria-selected=true])]:text-indigo-600 dark:data-[today]:[&:not([aria-selected=true])]:text-indigo-400 data-[today]:[&:not([aria-selected=true])]:ring-1 data-[today]:[&:not([aria-selected=true])]:ring-indigo-400/60 dark:data-[today]:[&:not([aria-selected=true])]:ring-indigo-400/50 data-[today]:[&:not([aria-selected=true])]:ring-inset";

const demoDayStates = [
  "text-zinc-800 dark:text-zinc-100",
  "data-disabled:cursor-not-allowed data-disabled:opacity-30 data-disabled:hover:bg-transparent",
  "data-unavailable:line-through data-unavailable:opacity-60 data-unavailable:hover:bg-transparent",
  demoSelectedCls,
  "aria-selected:focus-visible:ring-offset-zinc-200 dark:aria-selected:focus-visible:ring-offset-zinc-800",
  demoTodayUnselected,
  "aria-selected:data-[today]:ring-2 aria-selected:data-[today]:ring-indigo-300/80 dark:aria-selected:data-[today]:ring-indigo-300/60 aria-selected:data-[today]:ring-inset",
  "data-[outside-month]:text-zinc-400 dark:data-[outside-month]:text-zinc-500",
].join(" ");

const demoDayCls = (size: CalSize) => `${DEMO_DAY_BASE[size]} ${demoDayStates}`;

const demoRangeDayCls = (size: CalSize) =>
  [
    demoDayCls(size),
    "data-[in-range]:bg-indigo-100 data-[in-range]:text-indigo-900 dark:data-[in-range]:bg-indigo-500/20 dark:data-[in-range]:text-indigo-100",
    "data-[in-range]:hover:bg-indigo-200/80 dark:data-[in-range]:hover:bg-indigo-500/30",
    "data-[in-range]:rounded-none",
    "data-[range-start]:rounded-l-lg data-[range-end]:rounded-r-lg data-[range-start]:data-[range-end]:rounded-lg",
    "data-[range-start]:z-[1] data-[range-end]:z-[1]",
    "data-[range-start]:bg-indigo-600 data-[range-end]:bg-indigo-600 data-[range-start]:text-white data-[range-end]:text-white",
    "dark:data-[range-start]:bg-indigo-500 dark:data-[range-end]:bg-indigo-500 dark:data-[range-start]:text-white dark:data-[range-end]:text-white",
    "data-[range-start]:font-semibold data-[range-end]:font-semibold",
    "data-[range-start]:hover:bg-indigo-700 data-[range-end]:hover:bg-indigo-700 dark:data-[range-start]:hover:bg-indigo-400 dark:data-[range-end]:hover:bg-indigo-400",
  ].join(" ");

const DEMO_MONTH_YEAR_CELL: Record<CalSize, string> = {
  default: [
    "flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-lg px-1.5 py-2",
    "text-center text-[13px] font-medium leading-tight text-zinc-800 dark:text-zinc-200",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-100",
    "active:scale-[0.98] aria-selected:active:scale-100",
    focusRing,
    demoSelectedCls,
    "disabled:pointer-events-none disabled:opacity-35",
  ].join(" "),
  compact: [
    "flex min-h-[36px] w-full min-w-0 items-center justify-center rounded-md px-1 py-1.5",
    "text-center text-[11.5px] font-medium leading-tight text-zinc-800 dark:text-zinc-200",
    "transition-[background-color,color,box-shadow,transform] duration-150",
    "hover:bg-indigo-50 hover:text-indigo-900 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-100",
    "active:scale-[0.98] aria-selected:active:scale-100",
    focusRing,
    demoSelectedCls,
    "disabled:pointer-events-none disabled:opacity-35",
  ].join(" "),
};

const DEMO_YEAR_CELL: Record<CalSize, string> = {
  default: [DEMO_MONTH_YEAR_CELL.default, "tabular-nums text-[14px] tracking-tight"].join(" "),
  compact: [DEMO_MONTH_YEAR_CELL.compact, "tabular-nums text-[12px] tracking-tight"].join(" "),
};

/** Short month labels fit the 3-column grid; full name kept for tooltips. */
function demoMonthLabel(locale: string, monthIndex: number) {
  return new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2024, monthIndex, 1));
}

const labelCls = DP_LABEL_CLS;
const fieldWrap = (compact?: boolean) =>
  compact ? "flex flex-col gap-2 w-[228px] max-w-full" : DP_FIELD_WRAP_CLS;

const rangeFieldWrap = "flex w-fit max-w-full flex-col items-start gap-2";

const rangeInputCls = [
  "inline-flex h-[42px] min-w-0 w-full max-w-[108px] items-center rounded-[10px]",
  "border border-zinc-300/90 bg-white px-2 font-mono text-[13px] tabular-nums text-zinc-900",
  "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
  inputFocusWithin,
  segmentFocus,
  "[&_input]:px-0.5 [&_input]:py-0.5",
].join(" ");

const inputCls = DP_PICKER_INPUT_CLS;

const dateFieldWrap = DP_DATE_FIELD_WRAP_CLS;

const dateFieldInputCls = DP_DATE_FIELD_INPUT_CLS;

const triggerCls = DP_TRIGGER_CLS;

const presetBtn = [
  "min-h-[34px] flex-1 cursor-pointer rounded-lg border py-1.5 text-[12.5px] font-medium",
  "border-zinc-300/90 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200",
  "transition-[border-color,background-color,color,transform,box-shadow] duration-150",
  "hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:border-indigo-400/60 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300",
  "active:scale-[0.98] active:bg-indigo-100 dark:active:bg-indigo-500/25",
  focusRing,
].join(" ");

const popoverAlign = {
  side: "bottom" as const,
  align: "center" as const,
  sideOffset: 8,
};

/* ---------------- helpers ---------------- */
function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

const weekendUnavailable = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault();

function RangePresetButtons() {
  const { selectRange } = useDatePickerActions();

  const applyPreset = (nights: number) => {
    const start = today();
    const end = new Date(start);
    end.setDate(start.getDate() + nights);
    selectRange(start, end);
  };

  return (
    <>
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
        onClick={() => selectRange(today(), today())}
      >
        Today
      </button>
    </>
  );
}

function RangePresets() {
  return (
    <KenosDatePicker.Presets className="mt-2.5 flex gap-2 border-t border-zinc-200/90 pt-2.5 dark:border-zinc-700/80">
      <RangePresetButtons />
    </KenosDatePicker.Presets>
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
        <div
          className={`flex items-center justify-between ${size === "default" ? "mb-2.5" : "mb-2"}`}
        >
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
                    <KenosDatePicker.Day key={di} date={date} className={demoDayCls(size)} />
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

/* ---------------- Connected segmented input + inline calendar (Localization) ---------------- */
// One Root so the input and calendar share state: typing reflects in the calendar and
// picking a day reflects in the input. Demonstrates locale-aware segments + grid together.
export function LocalizedDatePickerDemo({
  locale = "en-US",
  label = "Date",
}: {
  locale?: string;
  label?: string;
}) {
  const [value, setValue] = useState<Date | null>(new Date());
  const size: CalSize = "default";
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  return (
    <KenosDatePicker.Root mode="single" locale={locale} value={value} onValueChange={setValue}>
      <div className={fieldWrap()}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <KenosDatePicker.Input className={inputCls} />
        <div className={`${demoShell(size)} mt-1`} data-cal-size={size}>
          <div className="mb-2.5 flex items-center justify-between">
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
                      <KenosDatePicker.Day key={di} date={date} className={demoDayCls(size)} />
                    ))}
                  </tr>
                ))
              }
            </KenosDatePicker.Grid>
          </KenosDatePicker.View>

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
      </div>
    </KenosDatePicker.Root>
  );
}

/* ---------------- Shared styled calendar body (popover + inline) ---------------- */
function DemoCalendarBody({ locale = "en-US", size = "default" as CalSize }) {
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  return (
    <>
      <div
        className={`flex items-center justify-between ${size === "compact" ? "mb-2" : "mb-2.5"}`}
      >
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
                  <KenosDatePicker.Day key={di} date={date} className={demoDayCls(size)} />
                ))}
              </tr>
            ))
          }
        </KenosDatePicker.Grid>
      </KenosDatePicker.View>

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
    </>
  );
}

function DemoRangeCalendarBody({ locale = "en-US", size = "default" as CalSize }) {
  const weekdayCls = DEMO_WEEKDAY[size];
  const headNav = DEMO_HEAD_NAV[size];
  const headTitle = DEMO_HEAD_TITLE[size];

  return (
    <>
      <div
        className={`flex items-center justify-between ${size === "compact" ? "mb-2" : "mb-2.5"}`}
      >
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
                  <KenosDatePicker.Day key={di} date={date} className={demoRangeDayCls(size)} />
                ))}
              </tr>
            ))
          }
        </KenosDatePicker.Grid>
      </KenosDatePicker.View>

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
    </>
  );
}

/* ---------------- DatePicker (README — Calendar shorthand) ---------------- */
export function DatePicker({
  locale = "en-US",
  label = "Date",
  defaultValue = null,
  defaultOpen = false,
}: {
  locale?: string;
  label?: string;
  defaultValue?: Date | null;
  defaultOpen?: boolean;
}) {
  return (
    <KenosDatePicker.Root
      mode="single"
      locale={locale}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
    >
      <div className={fieldWrap()}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <div className={DP_CONTROL_ROW_CLS}>
          <KenosDatePicker.Input className={inputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>
        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={DP_CAL_SHORTHAND_POPOVER_CLS}
          role="dialog"
          aria-label={label}
          data-cal-size="default"
        >
          <KenosDatePicker.Calendar />
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

/** Full composition — ViewControl + Grid + Day (popover path). */
export function DatePickerComposed({
  locale = "en-US",
  label = "Pick a date",
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

  return (
    <KenosDatePicker.Root
      mode="single"
      locale={locale}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
    >
      <div className={fieldWrap(compact)}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <div className={DP_CONTROL_ROW_CLS}>
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
          <DemoCalendarBody locale={locale} size={size} />
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

  return (
    <KenosDatePicker.Root
      mode="range"
      locale={locale}
      onValueChange={setRange}
      defaultOpen={defaultOpen}
      closeOnSelect={false}
    >
      <div className={`${compact ? fieldWrap(compact) : rangeFieldWrap} mx-auto`}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <div
          className={
            compact
              ? DP_CONTROL_ROW_CLS
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
              <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-400" aria-hidden>
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
          <DemoRangeCalendarBody locale={locale} size={size} />
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
    <KenosDatePicker.Root mode="single" locale={locale} defaultValue={defaultValue}>
      <div className={`${dateFieldWrap} mx-auto`}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
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
      <SelectDemo label="Theme" name="theme" defaultValue="light" options={selectThemeOptions} />
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
        className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
      >
        Submit
      </button>
    </form>
  );
}

const selectTagOptions = [
  ["react", "React"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
  ["solid", "Solid"],
] as const;

export function SelectMultipleDemo() {
  return (
    <KenosSelect.Root name="tags" multiple defaultValue={["react", "vue"]}>
      <KenosSelect.Label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        Frameworks
      </KenosSelect.Label>
      <KenosSelect.Trigger className={selectTriggerCls}>
        <KenosSelect.Value placeholder="Choose frameworks…" />
        <KenosSelect.Icon />
      </KenosSelect.Trigger>
      <KenosSelect.Content className={selectContentCls} sameWidth>
        <KenosSelect.List>
          {selectTagOptions.map(([value, text]) => (
            <KenosSelect.Item key={value} value={value} className={selectItemCls}>
              <KenosSelect.ItemText>{text}</KenosSelect.ItemText>
              <KenosSelect.ItemIndicator value={value}>✓</KenosSelect.ItemIndicator>
            </KenosSelect.Item>
          ))}
        </KenosSelect.List>
      </KenosSelect.Content>
      <KenosSelect.HiddenSelect />
    </KenosSelect.Root>
  );
}

export function SelectPortalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm overflow-hidden rounded-xl border-2 border-indigo-400/60 bg-indigo-50/50 p-4 dark:border-indigo-500/40 dark:bg-indigo-950/20"
    >
      <p className="mb-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        Dialog.Content (portal container)
      </p>
      <KenosSelect.Root name="country">
        <KenosSelect.Label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Country
        </KenosSelect.Label>
        <KenosSelect.Trigger className={selectTriggerCls}>
          <KenosSelect.Value placeholder="Choose…" />
          <KenosSelect.Icon />
        </KenosSelect.Trigger>
        <KenosSelect.Content portal container={containerRef} className={selectContentCls} sameWidth>
          <KenosSelect.List>
            {(
              [
                ["pt", "Portugal"],
                ["br", "Brazil"],
                ["es", "Spain"],
              ] as const
            ).map(([value, text]) => (
              <KenosSelect.Item key={value} value={value} className={selectItemCls}>
                <KenosSelect.ItemText>{text}</KenosSelect.ItemText>
              </KenosSelect.Item>
            ))}
          </KenosSelect.List>
        </KenosSelect.Content>
        <KenosSelect.HiddenSelect />
      </KenosSelect.Root>
    </div>
  );
}

const comboboxInputCls = [
  "min-w-0 flex-1 rounded-l-[10px] border border-r-0 border-zinc-200/90 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm",
  "transition-[border-color,box-shadow] duration-150 placeholder:text-zinc-400",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40",
  "dark:border-zinc-700/80 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500",
].join(" ");

const comboboxTriggerCls = [
  "inline-flex shrink-0 items-center justify-center rounded-r-[10px] border border-zinc-200/90 bg-white px-2.5 py-2.5 text-zinc-500 shadow-sm",
  "transition-[border-color,box-shadow] duration-150",
  "hover:border-zinc-300 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40",
  "dark:border-zinc-700/80 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200",
].join(" ");

const comboboxEmptyCls = "px-2.5 py-2 text-sm text-zinc-500 dark:text-zinc-400";

const comboboxLanguageOptions = [
  ["ts", "TypeScript"],
  ["js", "JavaScript"],
  ["py", "Python"],
  ["rs", "Rust"],
  ["go", "Go"],
] as const;

const comboboxFilterLanguageOptions = [
  ["ts", "TypeScript"],
  ["js", "JavaScript"],
  ["py", "Python"],
  ["rs", "Rust"],
  ["go", "Go"],
  ["java", "Java"],
  ["kotlin", "Kotlin"],
  ["swift", "Swift"],
  ["csharp", "C#"],
  ["cpp", "C++"],
  ["ruby", "Ruby"],
  ["php", "PHP"],
  ["scala", "Scala"],
  ["elixir", "Elixir"],
  ["haskell", "Haskell"],
  ["lua", "Lua"],
  ["r", "R"],
  ["dart", "Dart"],
  ["zig", "Zig"],
  ["ocaml", "OCaml"],
] as const;

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    strokeWidth={2}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export function ComboboxDemo({
  label = "Language",
  defaultValue = "ts",
  options = comboboxLanguageOptions,
}: {
  label?: string;
  defaultValue?: string;
  options?: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <KenosCombobox.Root defaultValue={defaultValue}>
      <KenosCombobox.Label className="mb-1.5 block text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        {label}
      </KenosCombobox.Label>
      <div className="flex min-w-[240px]">
        <KenosCombobox.Input className={comboboxInputCls} placeholder="Search languages…" />
        <KenosCombobox.Trigger className={comboboxTriggerCls} aria-label="Toggle list">
          <ChevronDownIcon />
        </KenosCombobox.Trigger>
      </div>
      <KenosCombobox.Content className={selectContentCls} sameWidth>
        <KenosCombobox.List>
          {options.map(([value, text]) => (
            <KenosCombobox.Item key={value} value={value} className={selectItemCls}>
              <KenosCombobox.ItemText>{text}</KenosCombobox.ItemText>
            </KenosCombobox.Item>
          ))}
        </KenosCombobox.List>
        <KenosCombobox.Empty className={comboboxEmptyCls}>No languages found</KenosCombobox.Empty>
      </KenosCombobox.Content>
    </KenosCombobox.Root>
  );
}

export function ComboboxFilterDemo() {
  return <ComboboxDemo label="Language" options={comboboxFilterLanguageOptions} />;
}

export function ComboboxDialogDemo() {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      className="w-full max-w-sm rounded-xl border border-zinc-200/90 bg-zinc-50 p-4 shadow-lg dark:border-zinc-700/80 dark:bg-zinc-900"
    >
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Settings</h3>
      <ComboboxDemo label="Language" defaultValue="js" />
    </div>
  );
}

const dateFormSchema = z.object({
  date: z.union([z.date(), z.null()]).refine((d) => d !== null, { message: "Select a date" }),
});

type DateFormValues = z.input<typeof dateFormSchema>;

function DatePickerFieldControlled({
  value,
  onChange,
  label = "Appointment",
  locale = "en-US",
}: {
  value: Date | null;
  onChange: (d: Date | null) => void;
  label?: string;
  locale?: string;
}) {
  return (
    <KenosDatePicker.Root value={value} onValueChange={onChange} locale={locale}>
      <div className={fieldWrap()}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <div className={DP_CONTROL_ROW_CLS}>
          <KenosDatePicker.Input className={inputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>
        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={demoShell("default")}
          role="dialog"
          aria-label={label}
          data-cal-size="default"
        >
          <DemoCalendarBody locale={locale} size="default" />
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerControlledDemo() {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <DatePickerFieldControlled value={value} onChange={setValue} />
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        Selected:{" "}
        <span className="font-mono text-zinc-800 dark:text-zinc-200">
          {value ? value.toLocaleDateString() : "—"}
        </span>
      </p>
    </div>
  );
}

export function DatePickerMinMaxDemo() {
  const min = new Date();
  min.setMonth(min.getMonth() - 1);
  const max = new Date();
  max.setMonth(max.getMonth() + 2);
  return (
    <KenosDatePicker.Root minDate={min} maxDate={max}>
      <div className={demoShell("default")} data-cal-size="default">
        <DemoCalendarBody size="default" />
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerDisabledDemo() {
  return (
    <KenosDatePicker.Root disabled={(date) => date.getDay() === 0 || date.getDay() === 6}>
      <div className={demoShell("default")} data-cal-size="default">
        <DemoCalendarBody size="default" />
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerUnavailableDemo() {
  return (
    <KenosDatePicker.Root unavailable={(date) => date.getDay() === 0 || date.getDay() === 6}>
      <div className={demoShell("default")} data-cal-size="default">
        <DemoCalendarBody size="default" />
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerFormNativeDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setSubmitted(String(fd.get("appointment") ?? ""));
      }}
    >
      <KenosDatePicker.Root name="appointment" required>
        <div className={fieldWrap()}>
          <KenosDatePicker.Label className={labelCls}>Appointment</KenosDatePicker.Label>
          <div className={DP_CONTROL_ROW_CLS}>
            <KenosDatePicker.Input className={inputCls} />
            <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
              <CalIcon />
            </KenosDatePicker.Trigger>
          </div>
          <KenosDatePicker.HiddenInput />
          <KenosDatePicker.Content
            portal
            {...popoverAlign}
            className={demoShell("default")}
            role="dialog"
            aria-label="Appointment"
            data-cal-size="default"
          >
            <DemoCalendarBody size="default" />
          </KenosDatePicker.Content>
        </div>
      </KenosDatePicker.Root>
      <button
        type="submit"
        className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
      >
        Submit
      </button>
      {submitted !== null && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          FormData appointment: {submitted || "(empty)"}
        </p>
      )}
    </form>
  );
}

export function DatePickerInvalidDemo() {
  // Reactive validity: invalid while empty, clears once a valid date is entered/picked.
  const [value, setValue] = useState<Date | null>(null);
  const isInvalid = value == null;

  return (
    <KenosDatePicker.Root
      value={value}
      onValueChange={setValue}
      invalid={isInvalid}
      errorMessage="Please select a valid date"
    >
      {/* Ring + message are driven by `data-invalid` on the Root, via an ancestor
          selector — not hardcoded — so they reflect the real validity state. */}
      <div
        className={`${fieldWrap()} rounded-lg p-3 [[data-invalid]_&]:ring-2 [[data-invalid]_&]:ring-red-500/55`}
      >
        <KenosDatePicker.Label className={labelCls}>Appointment</KenosDatePicker.Label>
        <div className={DP_CONTROL_ROW_CLS}>
          <KenosDatePicker.Input className={inputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>
        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={demoShell("default")}
          role="dialog"
          aria-label="Appointment"
          data-cal-size="default"
        >
          <DemoCalendarBody size="default" />
        </KenosDatePicker.Content>
        <KenosDatePicker.ErrorMessage className="mt-1.5 text-[13px] text-red-600 dark:text-red-400" />
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerRTLDemo() {
  return (
    <KenosDatePicker.Root locale="ar-EG" dir="rtl">
      <div className={fieldWrap()} dir="rtl">
        <KenosDatePicker.Label className={labelCls}>التاريخ</KenosDatePicker.Label>
        <div className={DP_CONTROL_ROW_CLS}>
          <KenosDatePicker.Input className={inputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="فتح التقويم">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>
        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={demoShell("default")}
          role="dialog"
          aria-label="التاريخ"
          data-cal-size="default"
        >
          <DemoCalendarBody locale="ar-EG" size="default" />
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerGranularityDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 5, 15, 14, 30));
  return (
    <KenosDatePicker.Root
      granularity="minute"
      hourCycle={24}
      value={value}
      onValueChange={setValue}
    >
      <div className={fieldWrap()}>
        <KenosDatePicker.Label className={labelCls}>Appointment</KenosDatePicker.Label>
        <KenosDatePicker.Input className={inputCls} />
        <p className="mt-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
          {value
            ? value.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: false,
              })
            : "No value"}
        </p>
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerNonContiguousRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        Weekends are unavailable but you can still book Mon → Fri with{" "}
        <code className="text-xs">allowsNonContiguousRanges</code>.
      </p>
      <KenosDatePicker.Root
        mode="range"
        unavailable={weekendUnavailable}
        allowsNonContiguousRanges
        value={range}
        onValueChange={setRange}
        defaultOpen
        closeOnSelect={false}
      >
        <div className={fieldWrap()}>
          <KenosDatePicker.Label className={labelCls}>Stay</KenosDatePicker.Label>
          <div className={DP_CONTROL_ROW_CLS}>
            <KenosDatePicker.Input index={0} className={rangeInputCls} />
            <span className="shrink-0 text-zinc-500" aria-hidden>
              →
            </span>
            <KenosDatePicker.Input index={1} className={rangeInputCls} />
            <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
              <CalIcon />
            </KenosDatePicker.Trigger>
          </div>
          <KenosDatePicker.Content
            portal
            {...popoverAlign}
            className={demoShell("default")}
            role="dialog"
            aria-label="Stay"
            data-cal-size="default"
          >
            <DemoRangeCalendarBody size="default" />
          </KenosDatePicker.Content>
        </div>
      </KenosDatePicker.Root>
      <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
        {range.start && range.end
          ? `${range.start.toLocaleDateString()} → ${range.end.toLocaleDateString()}`
          : "Select a range"}
      </p>
    </div>
  );
}

export function DatePickerRangeEscapeDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        Select a start date, then press Escape to cancel the pending range without closing.
      </p>
      <DateRangePicker label="Trip" presets={false} defaultOpen />
    </div>
  );
}

export function DatePickerMultipleDemo() {
  const [dates, setDates] = useState<Date[]>([]);
  // A segmented input holds a single value, so it isn't a good fit for multi-select.
  // Use a summary trigger plus removable chips to show the live selection two-way.
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const removeDate = (target: Date) =>
    setDates((prev) => prev.filter((d) => d.getTime() !== target.getTime()));

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <KenosDatePicker.Root
        mode="multiple"
        value={dates}
        onValueChange={setDates}
        closeOnSelect={false}
      >
        <div className={fieldWrap()}>
          <KenosDatePicker.Label className={labelCls}>Select dates</KenosDatePicker.Label>
          <KenosDatePicker.Trigger
            className="flex h-[42px] w-full items-center justify-between gap-2 rounded-[10px] border border-zinc-300/90 bg-white px-3 text-sm text-zinc-700 transition-[border-color,box-shadow] duration-150 hover:border-indigo-400 aria-expanded:border-indigo-500 aria-expanded:ring-2 aria-expanded:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-indigo-400/70 dark:aria-expanded:border-indigo-400"
            aria-label="Open calendar"
          >
            <span className={dates.length ? "" : "text-zinc-400 dark:text-zinc-500"}>
              {dates.length
                ? `${dates.length} date${dates.length === 1 ? "" : "s"} selected`
                : "Pick dates"}
            </span>
            <CalIcon />
          </KenosDatePicker.Trigger>
          <KenosDatePicker.Content
            portal
            {...popoverAlign}
            className={demoShell("default")}
            role="dialog"
            aria-label="Select dates"
            data-cal-size="default"
          >
            <DemoCalendarBody size="default" />
          </KenosDatePicker.Content>
        </div>
      </KenosDatePicker.Root>
      {sorted.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="Selected dates">
          {sorted.map((d) => (
            <li key={d.getTime()}>
              <button
                type="button"
                onClick={() => removeDate(d)}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-50 py-1 pl-2 pr-1.5 text-[12px] font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200/70 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20 dark:hover:bg-indigo-500/25"
                aria-label={`Remove ${d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
              >
                {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                <span aria-hidden className="text-indigo-400 dark:text-indigo-400/70">
                  ×
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">No dates selected yet</p>
      )}
    </div>
  );
}

export function DatePickerRHFFormDemo() {
  const [result, setResult] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DateFormValues>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: { date: null },
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={handleSubmit((data) => {
        setResult(data.date?.toLocaleDateString() ?? "");
      })}
    >
      <Controller
        control={control}
        name="date"
        render={({ field }) => (
          <DatePickerFieldControlled
            value={field.value}
            onChange={field.onChange}
            label="Appointment"
          />
        )}
      />
      {errors.date && (
        <p className="text-[13px] text-red-600 dark:text-red-400">{errors.date.message}</p>
      )}
      {result && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          Submitted: {result} — React Hook Form (Single)
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setResult(null);
          }}
          className="min-h-9 rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

const dateRangeFormSchema = z.object({
  range: z
    .object({
      start: z.union([z.date(), z.null()]),
      end: z.union([z.date(), z.null()]),
    })
    .refine((r) => r.start !== null && r.end !== null, { message: "Select a date range" }),
});

type DateRangeFormValues = z.input<typeof dateRangeFormSchema>;

function DateRangePickerFieldControlled({
  value,
  onChange,
  label = "Trip dates",
  locale = "en-US",
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
  label?: string;
  locale?: string;
}) {
  return (
    <KenosDatePicker.Root
      mode="range"
      value={value}
      onValueChange={onChange}
      locale={locale}
      closeOnSelect={false}
    >
      <div className={rangeFieldWrap}>
        <KenosDatePicker.Label className={labelCls}>{label}</KenosDatePicker.Label>
        <div className="grid w-full grid-cols-[minmax(0,108px)_auto_minmax(0,108px)_auto] items-center gap-x-2 gap-y-0">
          <KenosDatePicker.Input index={0} className={rangeInputCls} />
          <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-400" aria-hidden>
            →
          </span>
          <KenosDatePicker.Input index={1} className={rangeInputCls} />
          <KenosDatePicker.Trigger className={triggerCls} aria-label="Open calendar">
            <CalIcon />
          </KenosDatePicker.Trigger>
        </div>
        <KenosDatePicker.Content
          portal
          {...popoverAlign}
          className={demoShell("default")}
          role="dialog"
          aria-label={label}
          data-cal-size="default"
        >
          <DemoRangeCalendarBody size="default" />
        </KenosDatePicker.Content>
      </div>
    </KenosDatePicker.Root>
  );
}

export function DatePickerRangeRHFFormDemo() {
  const [result, setResult] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DateRangeFormValues>({
    resolver: zodResolver(dateRangeFormSchema),
    defaultValues: { range: { start: null, end: null } },
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={handleSubmit((data) => {
        const { start, end } = data.range;
        setResult(`${start?.toLocaleDateString() ?? ""} → ${end?.toLocaleDateString() ?? ""}`);
      })}
    >
      <Controller
        control={control}
        name="range"
        render={({ field }) => (
          <DateRangePickerFieldControlled
            value={field.value}
            onChange={field.onChange}
            label="Trip dates"
          />
        )}
      />
      {errors.range && (
        <p className="text-[13px] text-red-600 dark:text-red-400">{errors.range.message}</p>
      )}
      {result && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          Submitted: {result} — React Hook Form (Range)
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setResult(null);
          }}
          className="min-h-9 rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export function DatePickerRangeTanStackFormDemo() {
  const [result, setResult] = useState<string | null>(null);
  const form = useTanStackForm({
    defaultValues: { range: { start: null, end: null } as DateRange },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.range.start || !value.range.end) {
          return { fields: { range: "Select a date range" } };
        }
        return undefined;
      },
    },
    onSubmit: ({ value }) => {
      setResult(
        `${value.range.start?.toLocaleDateString() ?? ""} → ${value.range.end?.toLocaleDateString() ?? ""}`,
      );
    },
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="range">
        {(field) => (
          <div>
            <DateRangePickerFieldControlled
              value={field.state.value}
              onChange={field.handleChange}
              label="Trip dates"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-[13px] text-red-600 dark:text-red-400">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>
      {result && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          Submitted: {result} — TanStack Form (Range)
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            form.reset();
            setResult(null);
          }}
          className="min-h-9 rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export function DatePickerTanStackFormDemo() {
  const [result, setResult] = useState<string | null>(null);
  const form = useTanStackForm({
    defaultValues: { date: null as Date | null },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.date) return { fields: { date: "Select a date" } };
        return undefined;
      },
    },
    onSubmit: ({ value }) => {
      setResult(value.date?.toLocaleDateString() ?? "");
    },
  });

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="date">
        {(field) => (
          <div>
            <DatePickerFieldControlled
              value={field.state.value}
              onChange={field.handleChange}
              label="Appointment"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-[13px] text-red-600 dark:text-red-400">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>
      {result && (
        <p className="text-[13px] text-emerald-700 dark:text-emerald-400">
          Submitted: {result} — TanStack Form (Single)
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="min-h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            form.reset();
            setResult(null);
          }}
          className="min-h-9 rounded-lg border border-zinc-300 px-4 text-sm font-medium dark:border-zinc-700"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

/* ---------------- LiveDemo dispatcher (used by component pages) ---------------- */
export function LiveDemo({ kind, locale = "en-US" }: { kind: DemoKind; locale?: string }) {
  if (kind === "date-picker") {
    return <DatePicker locale={locale} label="Pick a date" />;
  }
  if (kind === "select") {
    return <SelectDemo />;
  }
  return <ComboboxDemo />;
}
