/** JSX + styling snippets shown alongside live demos (Radix-style approach tabs). */

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
  background: #ff5b29;
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
  color: #ff5b29;
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
  border-color: #ff5b29;
  box-shadow: 0 0 0 3px rgba(255, 91, 41, 0.12);
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
  border-color: #ff5b29;
  color: #ff5b29;
  background: rgba(255, 91, 41, 0.12);
}

.popover {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #111112;
  padding: 14px;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.7);
}`;

const rangeDayCss = `.cal-day[data-in-range] {
  background: rgba(255, 91, 41, 0.12);
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
                  className="grid size-[34px] place-items-center rounded-lg text-[13.5px] tabular-nums text-zinc-100 hover:bg-white/5 data-[selected]:bg-zinc-100 data-[selected]:text-white data-[today]:font-bold data-[outside-month]:text-zinc-500"
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
    unstyled: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <DatePicker.Label>Pick a date</DatePicker.Label>
  <div style={{ display: "flex", gap: 8 }}>
    <DatePicker.Input />
    <DatePicker.Trigger>📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,

    css: `/* styles.css */
${fieldCss}

${pickerExtraCss}

${calDayCss}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <DatePicker.Label className="field-label">Pick a date</DatePicker.Label>
  <div style={{ display: "flex", gap: 8 }}>
    <DatePicker.Input className="field-input" />
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

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <DatePicker.Label className="text-[13px] font-semibold text-zinc-100">Pick a date</DatePicker.Label>
  <div className="mt-1.5 flex gap-2">
    <DatePicker.Input className="h-[42px] flex-1 rounded-[10px] border border-white/15 bg-black px-3 font-mono text-sm text-zinc-100 outline-none focus:border-zinc-100 focus:ring-[3px] focus:ring-zinc-100/20" />
    <DatePicker.Trigger className="grid size-[42px] shrink-0 place-items-center rounded-[10px] border border-white/15 bg-black text-zinc-400 transition-colors hover:border-zinc-100 hover:bg-zinc-100/10 hover:text-zinc-100 aria-expanded:border-zinc-100 aria-expanded:bg-zinc-100/10 aria-expanded:text-zinc-100">
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
                  className="grid size-[34px] place-items-center rounded-lg text-[13.5px] tabular-nums text-zinc-100 hover:bg-white/5 data-[selected]:bg-zinc-100 data-[selected]:text-white data-[today]:font-bold data-[outside-month]:text-zinc-500"
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
import { css } from "styled-system/css";

const label = css({ fontSize: "13px", fontWeight: "semibold", color: "orange.500" });
const input = css({
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
  _focus: {
    borderColor: "orange.500",
    boxShadow: "0 0 0 3px rgba(255, 91, 41, 0.2)",
    outline: "none",
  },
});
const trigger = css({
  display: "grid",
  placeItems: "center",
  width: "42px",
  height: "42px",
  flexShrink: 0,
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.15)",
  backgroundColor: "black",
  color: "gray.400",
  _hover: { borderColor: "orange.500", backgroundColor: "rgba(255, 91, 41, 0.1)", color: "orange.500" },
});
const popover = css({
  borderRadius: "14px",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.15)",
  backgroundColor: "gray.900",
  padding: "14px",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.7)",
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

<DatePicker.Root locale="en-US" onValueChange={setValue}>
  <DatePicker.Label className={label}>Pick a date</DatePicker.Label>
  <div className={css({ display: "flex", gap: "8px", marginTop: "6px" })}>
    <DatePicker.Input className={input} />
    <DatePicker.Trigger className={trigger}>📅</DatePicker.Trigger>
  </div>
  <DatePicker.Content className={popover}>
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
                  className="grid size-[34px] place-items-center rounded-none text-[13.5px] tabular-nums text-zinc-100 hover:bg-white/5 data-[in-range]:bg-zinc-100/10 data-[range-start]:rounded-l-lg data-[range-end]:rounded-r-lg data-[selected]:bg-zinc-100 data-[selected]:text-white"
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
  "&[data-in-range]": { backgroundColor: "rgba(255, 91, 41, 0.12)" },
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
${fieldCss}

/* index.tsx */
import { DatePicker } from "@kenos-ui/react-datepicker";
import "./styles.css";

<DatePicker.Root locale="en-GB">
  <DatePicker.Label className="field-label">Date of birth</DatePicker.Label>
  <DatePicker.Input className="dp-input" />
</DatePicker.Root>`,

    tailwind: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root locale="en-GB">
  <DatePicker.Label className="text-[13px] font-semibold text-zinc-100">Date of birth</DatePicker.Label>
  <DatePicker.Input
    className="inline-flex items-center gap-0.5 rounded border border-white/15 bg-black px-3 py-2 font-mono text-sm text-zinc-100 focus-within:border-zinc-100 focus-within:ring-[3px] focus-within:ring-zinc-100/20 [&_[role=spinbutton]]:rounded [&_[role=spinbutton]]:px-0.5 [&_[role=spinbutton]]:outline-none [&_[role=spinbutton]:focus]:bg-zinc-800/60 [&_[role=spinbutton]:focus]:text-zinc-200 [&_[data-placeholder]]:text-zinc-500 [&_[data-separator]]:text-zinc-500"
  />
</DatePicker.Root>`,

    panda: `import { DatePicker } from "@kenos-ui/react-datepicker";
import { css } from "styled-system/css";

const label = css({ fontSize: "13px", fontWeight: "semibold", color: "orange.500" });
const input = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  borderRadius: "6px",
  borderWidth: "1px",
  borderColor: "rgba(255, 255, 255, 0.15)",
  backgroundColor: "black",
  paddingX: "12px",
  paddingY: "8px",
  fontFamily: "mono",
  fontSize: "14px",
  color: "gray.100",
  _focusWithin: {
    borderColor: "orange.500",
    boxShadow: "0 0 0 3px rgba(255, 91, 41, 0.2)",
  },
  "& [data-placeholder]": { color: "gray.500" },
  "& [data-separator]": { color: "gray.500" },
});

<DatePicker.Root locale="en-GB">
  <DatePicker.Label className={label}>Date of birth</DatePicker.Label>
  <DatePicker.Input className={input} />
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
};