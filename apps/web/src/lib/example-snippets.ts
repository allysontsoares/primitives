/** JSX + styling snippets shown alongside live demos (Radix-style approach tabs). */

import {
  DP_CAL_SHORTHAND_CSS,
  DP_CAL_SHORTHAND_POPOVER_CLS,
  DP_CONTROL_ROW_CLS,
  DP_DATE_FIELD_INPUT_CLS,
  DP_DATE_FIELD_WRAP_CLS,
  DP_DAY_CLS,
  DP_DAY_CSS,
  DP_FIELD_CSS,
  DP_HEAD_NAV_CLS,
  DP_HEAD_TITLE_CLS,
  DP_LABEL_CLS,
  DP_PANDA_DATE_FIELD_INPUT,
  DP_PANDA_FIELD_BLOCK,
  DP_PICKER_INPUT_CLS,
  DP_POPOVER_SHELL_CLS,
  DP_POPOVER_SHELL_CSS,
  DP_TRIGGER_CLS,
  DP_WEEKDAY_CLS,
} from "@/components/ui/date-picker.variants";

export type ExampleSnippets = {
  unstyled: string;
  css: string;
  tailwind: string;
  panda: string;
};

const calShellCss = `.cal-shell {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #111112;
  padding: 14px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
}`;

const calDayCss = `.cal-day {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  font-size: 13.5px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.cal-day:hover {
  background: rgba(255, 255, 255, 0.06);
}

.cal-day[data-selected] {
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
}

.cal-day[data-outside-month] {
  color: #5e5c58;
}

.cal-day[data-disabled] {
  opacity: 0.4;
  pointer-events: none;
}`;

const fieldCss = `.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
}

.field-input {
  flex: 1;
  height: 42px;
  padding: 0 13px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #000;
  color: #f4f3f1;
  font-family: ui-monospace, monospace;
  font-size: 14px;
}

.field-input:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  outline: none;
}

.dp-input [data-segment] {
  min-width: 2ch;
  text-align: center;
}

.dp-input [data-placeholder] {
  color: #6b7280;
}

.dp-input [data-separator] {
  color: #6b7280;
}`;

const pickerExtraCss = `.picker-trigger {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #000;
  color: #c4c2bd;
  cursor: pointer;
}

.picker-trigger:hover,
.picker-trigger[aria-expanded="true"] {
  border-color: #4f46e5;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.12);
}

.popover {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #111112;
  padding: 14px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.7);
}`;

const rangeDayCss = `.cal-day[data-in-range] {
  background: rgba(99, 102, 241, 0.12);
  border-radius: 0;
}

.cal-day[data-range-start] {
  border-radius: 8px 0 0 8px;
}

.cal-day[data-range-end] {
  border-radius: 0 8px 8px 0;
}`;

export const EXAMPLE_SNIPPETS: Record<string, ExampleSnippets> = {
  calendar: {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <DatePicker.ViewControl>
    <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
    <DatePicker.ViewTrigger />
    <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
  </DatePicker.ViewControl>

  <DatePicker.View view="day">
    <DatePicker.Grid header={<DatePicker.WeekDays />}>
      {({ weeks }) =>
        weeks.map((week, wi) => (
          <tr key={wi}>
            {week.map((day, di) => (
              <DatePicker.Day key={di} date={day} />
            ))}
          </tr>
        ))
      }
    </DatePicker.Grid>
  </DatePicker.View>
</DatePicker.Root>`,

    css: `/* styles.css */
${calShellCss}

${calDayCss}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <div className="cal-shell">
    <DatePicker.ViewControl className="flex items-center justify-between mb-2.5">
      <DatePicker.PrevTrigger className="grid place-items-center w-8 h-8 rounded-lg text-zinc-400 hover:bg-white/5">‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className="text-sm font-semibold px-2.5 py-1 rounded-lg text-zinc-100 hover:bg-white/5" />
      <DatePicker.NextTrigger className="grid place-items-center w-8 h-8 rounded-lg text-zinc-400 hover:bg-white/5">›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>

    <DatePicker.View view="day">
      <DatePicker.Grid className="w-full" header={<DatePicker.WeekDays className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide" />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day key={di} date={day} className="cal-day" />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </div>
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <div className="rounded-[14px] border border-white/15 bg-zinc-900 p-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.7)]">
    <DatePicker.ViewControl className="flex items-center justify-between mb-2.5">
      <DatePicker.PrevTrigger className="grid place-items-center w-[30px] h-[30px] rounded-lg text-zinc-400 hover:bg-white/5">‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className="text-sm font-semibold px-2.5 py-1 rounded-lg text-zinc-100 hover:bg-white/5" />
      <DatePicker.NextTrigger className="grid place-items-center w-[30px] h-[30px] rounded-lg text-zinc-400 hover:bg-white/5">›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>

    <DatePicker.View view="day">
      <DatePicker.Grid
        className="w-full border-collapse"
        header={<DatePicker.WeekDays className="text-[11px] font-semibold text-zinc-400 py-1.5 text-center uppercase tracking-wide" />}
      >
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day
                  key={di}
                  date={day}
                  className="grid size-[34px] place-items-center rounded-lg text-[13.5px] tabular-nums text-zinc-100 hover:bg-white/5 aria-selected:bg-indigo-600 aria-selected:text-white aria-selected:font-semibold data-[today]:font-bold data-[outside-month]:text-zinc-500"
                />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </div>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const shell = css({
  width: "296px",
  borderRadius: "14px",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.15)",
  backgroundColor: "gray.900",
  padding: "14px",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.5)",
});

const navBtn = css({
  display: "grid",
  placeItems: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  color: "gray.400",
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.05)", color: "gray.100" },
});

const day = css({
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  fontSize: "13.5px",
  color: "gray.100",
  fontVariantNumeric: "tabular-nums",
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.05)" },
  "&[data-selected]": {
    backgroundColor: "orange.500",
    color: "white",
    fontWeight: "semibold",
  },
  "&[data-outside-month]": { color: "gray.600" },
  "&[data-disabled]": { opacity: 0.4, pointerEvents: "none" },
});

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue} className={shell}>
  <DatePicker.ViewControl
    className={css({ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" })}
  >
    <DatePicker.PrevTrigger className={navBtn}>‹</DatePicker.PrevTrigger>
    <DatePicker.ViewTrigger className={css({ fontSize: "14px", fontWeight: "semibold", color: "gray.100" })} />
    <DatePicker.NextTrigger className={navBtn}>›</DatePicker.NextTrigger>
  </DatePicker.ViewControl>
  <DatePicker.View view="day">
    <DatePicker.Grid className={css({ width: "100%", borderCollapse: "collapse" })} header={<DatePicker.WeekDays className={css({ fontSize: "11px", fontWeight: "semibold", color: "gray.400" })} />}>
      {({ weeks }) =>
        weeks.map((week, wi) => (
          <tr key={wi}>
            {week.map((dayDate, di) => (
              <DatePicker.Day key={di} date={dayDate} className={day} />
            ))}
          </tr>
        ))
      }
    </DatePicker.Grid>
  </DatePicker.View>
</DatePicker.Root>`,
  },

  "date-picker": {
    unstyled: `import { useState } from "react";
import { DatePicker } from "@kenos-ui/react-datepicker";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root value={date} onValueChange={setDate}>
      <DatePicker.Label>Pick a date</DatePicker.Label>
      <div>
        <DatePicker.Input />
        <DatePicker.Trigger>📅</DatePicker.Trigger>
      </div>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}`,

    css: `/* styles.css */
${DP_FIELD_CSS}

${DP_CAL_SHORTHAND_CSS}

/* App.tsx */
import { useState } from "react";
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root value={date} onValueChange={setDate}>
      <div className="dp-field">
        <DatePicker.Label className="dp-label">Pick a date</DatePicker.Label>
        <div className="dp-control">
          <DatePicker.Input className="dp-input" />
          <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
        </div>
        <DatePicker.Content className="dp-popover">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`,

    tailwind: `import { useState } from "react";
import { DatePicker } from "@kenos-ui/react-datepicker";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root value={date} onValueChange={setDate}>
      <div className="flex flex-col gap-2 w-[260px]">
        <DatePicker.Label className="${DP_LABEL_CLS}">Pick a date</DatePicker.Label>
        <div className="${DP_CONTROL_ROW_CLS}">
          <DatePicker.Input className="${DP_PICKER_INPUT_CLS}" />
          <DatePicker.Trigger className="${DP_TRIGGER_CLS}">📅</DatePicker.Trigger>
        </div>
        <DatePicker.Content className="${DP_CAL_SHORTHAND_POPOVER_CLS}">
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`,

    panda: `import { useState } from "react";
import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

${DP_PANDA_FIELD_BLOCK}

const popover = css({
  width: "280px",
  minWidth: "280px",
  borderRadius: "14px",
  borderWidth: "1px",
  borderColor: { base: "rgba(228, 228, 231, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "zinc.50", _dark: "zinc.900" },
  padding: "14px",
  "& [role=group]": { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" },
  "& table": { width: "100%", tableLayout: "fixed", borderCollapse: "collapse" },
  "& td, & th": { padding: 0, textAlign: "center", verticalAlign: "middle" },
  "& [role=gridcell]": {
    width: "36px",
    height: "36px",
    lineHeight: "36px",
    borderRadius: "8px",
    fontSize: "14px",
    color: { base: "zinc.800", _dark: "zinc.100" },
    "&[data-selected]": {
      backgroundColor: { base: "zinc.800", _dark: "zinc.200" },
      color: { base: "white", _dark: "zinc.900" },
      fontWeight: "semibold",
    },
  },
});

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root value={date} onValueChange={setDate}>
      <div className={css({ display: "flex", flexDirection: "column", gap: "8px", width: "260px" })}>
        <DatePicker.Label className={label}>Pick a date</DatePicker.Label>
        <div className={css({ display: "flex", alignItems: "center", gap: "8px" })}>
          <DatePicker.Input className={input} />
          <DatePicker.Trigger className={trigger}>📅</DatePicker.Trigger>
        </div>
        <DatePicker.Content className={popover}>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </div>
    </DatePicker.Root>
  );
}`,
  },

  "date-picker-composition": {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <DatePicker.Label>Pick a date</DatePicker.Label>
  <div style={{ display: "flex", gap: 8 }}>
    <DatePicker.Input />
    <DatePicker.Trigger>📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content>
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger />
      <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>
    <DatePicker.View view="day">
      <DatePicker.Grid header={<DatePicker.WeekDays />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day key={di} date={day} />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </DatePicker.Content>
</DatePicker.Root>`,

    css: `/* styles.css */
${DP_FIELD_CSS}

${DP_POPOVER_SHELL_CSS}

${DP_DAY_CSS}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <div className="dp-field">
    <DatePicker.Label className="dp-label">Pick a date</DatePicker.Label>
    <div className="dp-control">
      <DatePicker.Input className="dp-input" />
      <DatePicker.Trigger className="dp-trigger">📅</DatePicker.Trigger>
    </div>
    <DatePicker.Content className="dp-popover">
      <DatePicker.ViewControl>
        <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger />
        <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.View view="day">
        <DatePicker.Grid header={<DatePicker.WeekDays />}>
          {({ weeks }) =>
            weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <DatePicker.Day key={di} date={day} className="dp-day" />
                ))}
              </tr>
            ))
          }
        </DatePicker.Grid>
      </DatePicker.View>
    </DatePicker.Content>
  </div>
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <div className="flex flex-col gap-2 w-[260px]">
    <DatePicker.Label className="${DP_LABEL_CLS}">Pick a date</DatePicker.Label>
    <div className="${DP_CONTROL_ROW_CLS}">
      <DatePicker.Input className="${DP_PICKER_INPUT_CLS}" />
      <DatePicker.Trigger className="${DP_TRIGGER_CLS}">📅</DatePicker.Trigger>
    </div>
    <DatePicker.Content className="${DP_POPOVER_SHELL_CLS}">
      <div className="flex items-center justify-between mb-2.5">
        <DatePicker.PrevTrigger className="${DP_HEAD_NAV_CLS}">‹</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger className="${DP_HEAD_TITLE_CLS}" />
        <DatePicker.NextTrigger className="${DP_HEAD_NAV_CLS}">›</DatePicker.NextTrigger>
      </div>
      <DatePicker.View view="day">
        <DatePicker.Grid
          className="w-full border-collapse table-fixed"
          header={<DatePicker.WeekDays className="${DP_WEEKDAY_CLS}" />}
        >
          {({ weeks }) =>
            weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <DatePicker.Day key={di} date={day} className="${DP_DAY_CLS}" />
                ))}
              </tr>
            ))
          }
        </DatePicker.Grid>
      </DatePicker.View>
    </DatePicker.Content>
  </div>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

${DP_PANDA_FIELD_BLOCK}

const popover = css({
  width: "280px",
  minWidth: "280px",
  borderRadius: "14px",
  borderWidth: "1px",
  borderColor: { base: "rgba(228, 228, 231, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "zinc.50", _dark: "zinc.900" },
  padding: "14px",
  boxShadow: "0 10px 24px rgba(24, 24, 27, 0.08)",
});

const day = css({
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: "36px",
  height: "36px",
  margin: "0 auto",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "medium",
  color: { base: "zinc.800", _dark: "zinc.100" },
  fontVariantNumeric: "tabular-nums",
  _hover: { backgroundColor: { base: "zinc.200", _dark: "zinc.700" } },
  "&[aria-selected=true], &[data-selected]": {
    backgroundColor: { base: "zinc.800", _dark: "zinc.200" },
    color: { base: "white", _dark: "zinc.900" },
    fontWeight: "semibold",
  },
});

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <div className={css({ display: "flex", flexDirection: "column", gap: "8px", width: "260px" })}>
    <DatePicker.Label className={label}>Pick a date</DatePicker.Label>
    <div className={css({ display: "flex", alignItems: "center", gap: "8px" })}>
      <DatePicker.Input className={input} />
      <DatePicker.Trigger className={trigger}>📅</DatePicker.Trigger>
    </div>
    <DatePicker.Content className={popover}>
      <DatePicker.ViewControl className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" })}>
        <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
        <DatePicker.ViewTrigger />
        <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
      </DatePicker.ViewControl>
      <DatePicker.View view="day">
        <DatePicker.Grid header={<DatePicker.WeekDays />}>
          {({ weeks }) =>
            weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((dayDate, di) => (
                  <DatePicker.Day key={di} date={dayDate} className={day} />
                ))}
              </tr>
            ))
          }
        </DatePicker.Grid>
      </DatePicker.View>
    </DatePicker.Content>
  </div>
</DatePicker.Root>`,
  },

  "date-range-picker": {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";
import type { DateRange } from "@kenos-ui/react-datepicker";

<DatePicker.Root mode="range" onValueChange={(r: DateRange) => save(r.start, r.end)}>
  <DatePicker.Label>Trip dates</DatePicker.Label>
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <DatePicker.Input index={0} />
    <span aria-hidden>–</span>
    <DatePicker.Input index={1} />
    <DatePicker.Trigger>📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content>
    <DatePicker.Calendar />
    {/* Add your own presets UI here (buttons that update the range value) */}
  </DatePicker.Content>
</DatePicker.Root>`,

    css: `/* styles.css */
${fieldCss}

${pickerExtraCss}

${calDayCss}

${rangeDayCss}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import type { DateRange } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root mode="range" onValueChange={(r: DateRange) => save(r.start, r.end)}>
  <DatePicker.Label className="field-label">Trip dates</DatePicker.Label>
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <DatePicker.Input index={0} className="field-input" />
    <span aria-hidden>–</span>
    <DatePicker.Input index={1} className="field-input" />
    <DatePicker.Trigger className="picker-trigger">📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content className="popover">
    <DatePicker.ViewControl className="flex items-center justify-between mb-2.5">
      <DatePicker.PrevTrigger className="grid place-items-center w-8 h-8 rounded-lg text-zinc-400 hover:bg-white/5">‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className="text-sm font-semibold px-2.5 py-1 rounded-lg text-zinc-100 hover:bg-white/5" />
      <DatePicker.NextTrigger className="grid place-items-center w-8 h-8 rounded-lg text-zinc-400 hover:bg-white/5">›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>

    <DatePicker.View view="day">
      <DatePicker.Grid className="w-full" header={<DatePicker.WeekDays className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide" />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day key={di} date={day} className="cal-day" />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </DatePicker.Content>
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";
import type { DateRange } from "@kenos-ui/react-datepicker";

<DatePicker.Root mode="range" onValueChange={(r: DateRange) => save(r.start, r.end)}>
  <DatePicker.Label className="text-[13px] font-semibold text-zinc-100">Trip dates</DatePicker.Label>
  <div className="mt-1.5 flex items-center gap-2">
    <DatePicker.Input index={0} className="h-[42px] flex-1 rounded-[10px] border border-white/15 bg-black px-3 font-mono text-sm text-zinc-100" />
    <span aria-hidden className="text-zinc-500">–</span>
    <DatePicker.Input index={1} className="h-[42px] flex-1 rounded-[10px] border border-white/15 bg-black px-3 font-mono text-sm text-zinc-100" />
    <DatePicker.Trigger className="grid size-[42px] place-items-center rounded-[10px] border border-white/15 bg-black text-zinc-400 hover:border-zinc-100 hover:text-zinc-100">
      📅
    </DatePicker.Trigger>
  </div>
  <DatePicker.Content className="rounded-[14px] border border-white/15 bg-zinc-900 p-3.5 shadow-[0_18px_48px_rgba(0,0,0,0.7)]">
    <DatePicker.ViewControl className="flex items-center justify-between mb-2.5">
      <DatePicker.PrevTrigger className="grid place-items-center w-[30px] h-[30px] rounded-lg text-zinc-400 hover:bg-white/5">‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className="text-sm font-semibold px-2.5 py-1 rounded-lg text-zinc-100 hover:bg-white/5" />
      <DatePicker.NextTrigger className="grid place-items-center w-[30px] h-[30px] rounded-lg text-zinc-400 hover:bg-white/5">›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>

    <DatePicker.View view="day">
      <DatePicker.Grid
        className="w-full border-collapse"
        header={<DatePicker.WeekDays className="text-[11px] font-semibold text-zinc-400 py-1.5 text-center uppercase tracking-wide" />}
      >
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day
                  key={di}
                  date={day}
                  className="grid size-[34px] place-items-center rounded-none text-[13.5px] tabular-nums text-zinc-100 hover:bg-white/5 data-[in-range]:bg-indigo-500/20 data-[range-start]:rounded-l-lg data-[range-end]:rounded-r-lg data-[range-start]:bg-indigo-600 data-[range-end]:bg-indigo-600 data-[range-start]:text-white data-[range-end]:text-white"
                />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </DatePicker.Content>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import type { DateRange } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const label = css({ fontSize: "13px", fontWeight: "semibold", color: "orange.500" });
const fieldInput = css({
  flex: 1,
  height: "42px",
  paddingX: "12px",
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.15)",
  backgroundColor: "black",
  color: "gray.100",
  fontFamily: "mono",
  fontSize: "14px",
});

const navBtn = css({
  display: "grid",
  placeItems: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  color: "gray.400",
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.05)", color: "gray.100" },
});

const day = css({
  display: "grid",
  placeItems: "center",
  width: "34px",
  height: "34px",
  color: "gray.100",
  borderRadius: 0,
  _hover: { backgroundColor: "rgba(255, 255, 255, 0.05)" },
  "&[data-in-range]": { backgroundColor: "rgba(99, 102, 241, 0.12)" },
  "&[data-selected]": { backgroundColor: "orange.500", color: "white" },
  "&[data-range-start]": { borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" },
  "&[data-range-end]": { borderTopRightRadius: "8px", borderBottomRightRadius: "8px" },
  "&[data-outside-month]": { color: "gray.600" },
  "&[data-disabled]": { opacity: 0.4, pointerEvents: "none" },
});

<DatePicker.Root mode="range" onValueChange={(r: DateRange) => save(r.start, r.end)}>
  <DatePicker.Label className={label}>Trip dates</DatePicker.Label>
  <div className={css({ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" })}>
    <DatePicker.Input index={0} className={fieldInput} />
    <DatePicker.Input index={1} className={fieldInput} />
    <DatePicker.Trigger>📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content className={css({ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "gray.900", padding: "14px" })}>
    <DatePicker.ViewControl
      className={css({ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" })}
    >
      <DatePicker.PrevTrigger className={navBtn}>‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className={css({ fontSize: "14px", fontWeight: "semibold", color: "gray.100" })} />
      <DatePicker.NextTrigger className={navBtn}>›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>
    <DatePicker.View view="day">
      <DatePicker.Grid className={css({ width: "100%", borderCollapse: "collapse" })} header={<DatePicker.WeekDays className={css({ fontSize: "11px", fontWeight: "semibold", color: "gray.400" })} />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((dayDate, di) => (
                <DatePicker.Day key={di} date={dayDate} className={day} />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </DatePicker.Content>
</DatePicker.Root>`,
  },

  "date-field": {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-GB">
  <DatePicker.Label>Date of birth</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,

    css: `/* styles.css */
${DP_FIELD_CSS}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-GB">
  <div className="dp-date-field-wrap">
    <DatePicker.Label className="dp-label">Date of birth</DatePicker.Label>
    <DatePicker.Input className="dp-date-field" />
  </div>
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-GB">
  <div className="${DP_DATE_FIELD_WRAP_CLS}">
    <DatePicker.Label className="${DP_LABEL_CLS}">Date of birth</DatePicker.Label>
    <DatePicker.Input className="${DP_DATE_FIELD_INPUT_CLS}" />
  </div>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const label = css({ fontSize: "13px", fontWeight: "semibold", color: { base: "zinc.200", _dark: "zinc.300" } });
${DP_PANDA_DATE_FIELD_INPUT}

<DatePicker.Root locale="en-GB">
  <div className={css({ display: "flex", flexDirection: "column", gap: "8px", width: "fit-content" })}>
    <DatePicker.Label className={label}>Date of birth</DatePicker.Label>
    <DatePicker.Input className={dateField} />
  </div>
</DatePicker.Root>`,
  },

  "date-picker-field": {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-GB">
  <DatePicker.Label>Date of birth</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,

    css: `/* styles.css */
${DP_FIELD_CSS}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-GB">
  <div className="dp-date-field-wrap">
    <DatePicker.Label className="dp-label">Date of birth</DatePicker.Label>
    <DatePicker.Input className="dp-date-field" />
  </div>
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-GB">
  <div className="${DP_DATE_FIELD_WRAP_CLS}">
    <DatePicker.Label className="${DP_LABEL_CLS}">Date of birth</DatePicker.Label>
    <DatePicker.Input className="${DP_DATE_FIELD_INPUT_CLS}" />
  </div>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const label = css({ fontSize: "13px", fontWeight: "semibold", color: { base: "zinc.200", _dark: "zinc.300" } });
${DP_PANDA_DATE_FIELD_INPUT}

<DatePicker.Root locale="en-GB">
  <div className={css({ display: "flex", flexDirection: "column", gap: "8px", width: "fit-content" })}>
    <DatePicker.Label className={label}>Date of birth</DatePicker.Label>
    <DatePicker.Input className={dateField} />
  </div>
</DatePicker.Root>`,
  },

  "date-picker-inline": {
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <DatePicker.Calendar />
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <div className="${DP_POPOVER_SHELL_CLS}">
    <div className="flex items-center justify-between mb-2.5">
      <DatePicker.PrevTrigger className="${DP_HEAD_NAV_CLS}">‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger className="${DP_HEAD_TITLE_CLS}" />
      <DatePicker.NextTrigger className="${DP_HEAD_NAV_CLS}">›</DatePicker.NextTrigger>
    </div>
    <DatePicker.View view="day">
      <DatePicker.Grid
        className="w-full border-collapse table-fixed"
        header={<DatePicker.WeekDays className="${DP_WEEKDAY_CLS}" />}
      >
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day key={di} date={day} className="${DP_DAY_CLS}" />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </div>
</DatePicker.Root>`,

    css: `/* styles.css */
${DP_POPOVER_SHELL_CSS}
${DP_DAY_CSS}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <div className="dp-popover">
    <DatePicker.ViewControl>
      <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger />
      <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>
    <DatePicker.View view="day">
      <DatePicker.Grid header={<DatePicker.WeekDays />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <DatePicker.Day key={di} date={day} className="dp-day" />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </div>
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const shell = css({
  width: "280px",
  borderRadius: "14px",
  borderWidth: "1px",
  borderColor: { base: "rgba(228, 228, 231, 0.9)", _dark: "zinc.700" },
  backgroundColor: { base: "zinc.50", _dark: "zinc.900" },
  padding: "14px",
});

const day = css({
  display: "grid",
  placeItems: "center",
  width: "36px",
  height: "36px",
  margin: "0 auto",
  borderRadius: "8px",
  fontSize: "14px",
  color: { base: "zinc.800", _dark: "zinc.100" },
  "&[aria-selected=true], &[data-selected]": {
    backgroundColor: { base: "zinc.800", _dark: "zinc.200" },
    color: { base: "white", _dark: "zinc.900" },
    fontWeight: "semibold",
  },
});

<DatePicker.Root locale="en-US" value={value} onValueChange={setValue}>
  <div className={shell}>
    <DatePicker.ViewControl className={css({ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" })}>
      <DatePicker.PrevTrigger>‹</DatePicker.PrevTrigger>
      <DatePicker.ViewTrigger />
      <DatePicker.NextTrigger>›</DatePicker.NextTrigger>
    </DatePicker.ViewControl>
    <DatePicker.View view="day">
      <DatePicker.Grid header={<DatePicker.WeekDays />}>
        {({ weeks }) =>
          weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((dayDate, di) => (
                <DatePicker.Day key={di} date={dayDate} className={day} />
              ))}
            </tr>
          ))
        }
      </DatePicker.Grid>
    </DatePicker.View>
  </div>
</DatePicker.Root>`,
  },

  select: {
    unstyled: `import { Select } from "@kenos-ui/react-select";

<Select.Root name="framework" onValueChange={setValue}>
  <Select.Label>Framework</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Choose…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.List>
      <Select.Item value="react">React</Select.Item>
      <Select.Item value="vue">Vue</Select.Item>
    </Select.List>
  </Select.Content>
  <Select.HiddenSelect />
</Select.Root>`,

    css: `.select-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #000;
  color: #f4f3f1;
}

.select-content {
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #111112;
  padding: 4px;
}

.select-item[data-highlighted] {
  background: rgba(255, 255, 255, 0.08);
}

.select-item[data-selected] {
  font-weight: 600;
}

/* index.tsx */
import { Select } from "@kenos-ui/react-select";
import "./select.css";

<Select.Root name="framework" onValueChange={setValue}>
  <Select.Label className="label">Framework</Select.Label>
  <Select.Trigger className="select-trigger">
    <Select.Value placeholder="Choose…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content className="select-content">
    <Select.List>
      <Select.Item value="react" className="select-item">React</Select.Item>
      <Select.Item value="vue" className="select-item">Vue</Select.Item>
    </Select.List>
  </Select.Content>
  <Select.HiddenSelect />
</Select.Root>`,

    tailwind: `import { Select } from "@kenos-ui/react-select";

<Select.Root name="framework">
  <Select.Label className="text-sm font-semibold">Framework</Select.Label>
  <Select.Trigger className="flex w-full items-center justify-between rounded-lg border px-3 py-2">
    <Select.Value placeholder="Choose…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content className="mt-1 rounded-lg border bg-white p-1 shadow-lg" sameWidth>
    <Select.List>
      <Select.Item value="react" className="rounded px-2 py-1.5 data-[highlighted]:bg-zinc-100">
        React
      </Select.Item>
    </Select.List>
  </Select.Content>
</Select.Root>`,

    panda: `import { Select } from "@kenos-ui/react-select";
import { css } from "../styled-system/css";

const trigger = css({ display: "flex", w: "full", px: "3", py: "2", borderRadius: "md", borderWidth: "1px" });

<Select.Root name="framework">
  <Select.Trigger className={trigger}>
    <Select.Value placeholder="Choose…" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="react">React</Select.Item>
  </Select.Content>
</Select.Root>`,
  },

  combobox: {
    unstyled: `import { Combobox } from "@kenos-ui/react-combobox";

<Combobox.Root defaultValue="ts" onValueChange={setValue}>
  <Combobox.Label>Language</Combobox.Label>
  <Combobox.Input placeholder="Search languages…" />
  <Combobox.Trigger>▼</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.List>
      <Combobox.Item value="ts">
        <Combobox.ItemText>TypeScript</Combobox.ItemText>
      </Combobox.Item>
      <Combobox.Item value="js">
        <Combobox.ItemText>JavaScript</Combobox.ItemText>
      </Combobox.Item>
    </Combobox.List>
    <Combobox.Empty>No languages found</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,

    css: `.combobox-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px 0 0 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #000;
  color: #f4f3f1;
}

.combobox-trigger {
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-left: none;
  border-radius: 0 8px 8px 0;
  background: #000;
  color: #f4f3f1;
  cursor: pointer;
}

.combobox-content {
  margin-top: 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #111112;
  padding: 4px;
}

.combobox-item[data-highlighted] {
  background: rgba(255, 255, 255, 0.08);
}

.combobox-empty {
  padding: 8px 12px;
  color: #888;
  font-size: 14px;
}

/* index.tsx */
import { Combobox } from "@kenos-ui/react-combobox";
import "./combobox.css";

<Combobox.Root defaultValue="ts">
  <Combobox.Label className="label">Language</Combobox.Label>
  <div className="row">
    <Combobox.Input className="combobox-input" placeholder="Search…" />
    <Combobox.Trigger className="combobox-trigger">▼</Combobox.Trigger>
  </div>
  <Combobox.Content className="combobox-content">
    <Combobox.List>
      <Combobox.Item value="ts" className="combobox-item">
        <Combobox.ItemText>TypeScript</Combobox.ItemText>
      </Combobox.Item>
    </Combobox.List>
    <Combobox.Empty className="combobox-empty">No languages found</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,

    tailwind: `import { Combobox } from "@kenos-ui/react-combobox";

<Combobox.Root defaultValue="ts">
  <Combobox.Label className="text-sm font-semibold">Language</Combobox.Label>
  <div className="flex">
    <Combobox.Input
      className="flex-1 rounded-l-lg border px-3 py-2"
      placeholder="Search languages…"
    />
    <Combobox.Trigger className="rounded-r-lg border border-l-0 px-2.5 py-2">▼</Combobox.Trigger>
  </div>
  <Combobox.Content className="mt-1 rounded-lg border bg-white p-1 shadow-lg" sameWidth>
    <Combobox.List>
      <Combobox.Item value="ts" className="rounded px-2 py-1.5 data-[highlighted]:bg-zinc-100">
        <Combobox.ItemText>TypeScript</Combobox.ItemText>
      </Combobox.Item>
    </Combobox.List>
    <Combobox.Empty className="px-2 py-1.5 text-sm text-zinc-500">No languages found</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,

    panda: `import { Combobox } from "@kenos-ui/react-combobox";
import { css } from "../styled-system/css";

const input = css({ flex: "1", px: "3", py: "2", borderRadius: "md", borderWidth: "1px" });

<Combobox.Root defaultValue="ts">
  <Combobox.Input className={input} placeholder="Search…" />
  <Combobox.Content>
    <Combobox.Item value="ts">
      <Combobox.ItemText>TypeScript</Combobox.ItemText>
    </Combobox.Item>
    <Combobox.Empty>No matches</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`,
  },
};
