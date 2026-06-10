import type { AnatomyNode, ApiGroup } from "./docs-data";

export const DATE_PICKER_FEATURES = [
  "Single, range, and multiple selection via one Root API (mode).",
  "Segmented date input powered by timescape — locale-aware order and separators.",
  "Popover calendar with Floating UI positioning, or inline calendar via composition.",
  "Full keyboard navigation across segments, day/month/year grids — RTL-aware arrows.",
  "WAI-ARIA grid and spinbutton semantics built in.",
  "Unavailable dates (focusable, not selectable) vs disabled dates.",
  "HiddenInput for native HTML form submission.",
  "Form props: name, required, invalid, errorMessage.",
  "Unstyled — style with className, style, and data-* attributes.",
  "Localization via Intl (locale, weekStartsOn, dir) — no bundled locale data.",
  "Customizable screen-reader messages via messages prop.",
  "Time segments via granularity (hour, minute, second) — powered by timescape.",
  "DatePicker.Presets + useDatePickerActions for shortcut buttons.",
  "pageBehavior for multi-month grids; allowsNonContiguousRanges for booking ranges.",
  'Fully controlled mode="multiple" with value sync.',
] as const;

export const DATE_PICKER_INSTALL = {
  datepicker: "pnpm add @kenos-ui/react-datepicker",
  react: "pnpm add @kenos-ui/react",
} as const;

export const DATE_PICKER_IMPORT = {
  datepicker: 'import { DatePicker } from "@kenos-ui/react-datepicker";',
  react: 'import { DatePicker } from "@kenos-ui/react";',
} as const;

export const DATE_PICKER_ANATOMY: AnatomyNode[] = [
  {
    tag: "DatePicker.Root",
    note: "state owner (mode, locale, value, constraints)",
    children: [
      { tag: "DatePicker.Label", leaf: true },
      {
        tag: "Popover path",
        note: "input + trigger + floating calendar",
        children: [
          { tag: "DatePicker.Input", note: "segmented field (index for range)" },
          { tag: "DatePicker.Trigger", leaf: true },
          {
            tag: "DatePicker.Content",
            note: "dialog + portal + positioning",
            children: [
              {
                tag: "DatePicker.Presets",
                note: "optional shortcut buttons (useDatePickerActions)",
              },
              {
                tag: "DatePicker.Calendar",
                note: "shorthand — or ViewControl + Grid + Day",
              },
            ],
          },
        ],
      },
      {
        tag: "Inline path",
        note: "omit Content/Trigger — render Calendar or Grid directly",
        children: [{ tag: "DatePicker.Calendar", leaf: true }],
      },
      {
        tag: "Date field path",
        note: "segments only — no calendar",
        children: [{ tag: "DatePicker.Input", leaf: true }],
      },
      { tag: "DatePicker.HiddenInput", note: "native form value (optional)" },
    ],
  },
];

const rootGroup = { group: "Root props" };

export const DATE_PICKER_API: ApiGroup[] = [
  {
    ...rootGroup,
    props: [
      {
        name: "mode",
        type: '"single" | "range" | "multiple"',
        def: '"single"',
        desc: "Selection mode. Controls value shape and Input index usage.",
      },
      {
        name: "value / defaultValue / onValueChange",
        type: "Date | null · DateRange · Date[]",
        desc: "Controlled or uncontrolled value. Shape depends on mode.",
      },
      {
        name: "open / defaultOpen / onOpenChange",
        type: "boolean",
        desc: "Popover open state (popover path only).",
      },
      {
        name: "locale",
        type: "string",
        def: "navigator.language",
        desc: "BCP 47 tag — segment order, separators, labels, week start.",
      },
      {
        name: "weekStartsOn",
        type: "0 – 6",
        desc: "Override first day of week (0 = Sunday).",
      },
      { name: "minDate / maxDate", type: "Date", desc: "Clamp selectable range." },
      {
        name: "disabled",
        type: "boolean | (date: Date) => boolean",
        desc: "Disable dates — no focus, no selection (aria-disabled on cells).",
      },
      {
        name: "unavailable",
        type: "(date: Date) => boolean",
        desc: "Mark dates unavailable — focusable but not selectable (data-unavailable).",
      },
      { name: "readOnly", type: "boolean", desc: "Prevent edits via segments or grid." },
      {
        name: "dir",
        type: '"ltr" | "rtl"',
        desc: "Text direction for keyboard navigation. Defaults to document.dir.",
      },
      {
        name: "messages",
        type: "Partial<DatePickerMessages>",
        desc: "Override prev/next/view labels and range screen-reader prompts.",
      },
      { name: "name", type: "string", desc: "Form field name for HiddenInput." },
      { name: "required", type: "boolean", desc: "Native required on HiddenInput." },
      { name: "invalid", type: "boolean", desc: "Sets aria-invalid on the input group." },
      { name: "errorMessage", type: "string", desc: "Linked via aria-errormessage when invalid." },
      { name: "placeholderDate", type: "Date", desc: "Calendar opens focused on this date." },
      {
        name: "granularity",
        type: '"day" | "hour" | "minute" | "second"',
        def: '"day"',
        desc: "Lowest time unit in Input segments. day = date only; minute adds hour + minute.",
      },
      {
        name: "hourCycle",
        type: "12 | 24",
        desc: "12h vs 24h time segments. Defaults from locale when omitted.",
      },
      {
        name: "pageBehavior",
        type: '"visible" | "single"',
        def: '"visible"',
        desc: "Day grid PageUp/Down: visible changes month view; single moves focus within the grid when possible.",
      },
      {
        name: "allowsNonContiguousRanges",
        type: "boolean",
        def: "false",
        desc: "Range mode only. Allow completing a range that spans unavailable dates between start and end.",
      },
      {
        name: "onFocusWithin / onBlurWithin / onFocusChange",
        type: "FocusEvent handlers",
        desc: "Focus-within callbacks on Root (popover excluded).",
      },
      {
        name: "closeOnSelect",
        type: "boolean | CloseOnSelectConfig",
        def: "true (single)",
        desc: "Close popover after selection. Granular per mode when object.",
      },
      {
        name: "modal",
        type: "boolean",
        def: "false",
        desc: "Opt-in focus trap + aria-modal on Content.",
      },
    ],
  },
  {
    group: "Presets component",
    props: [
      {
        name: "children",
        type: "ReactNode",
        desc: "Shortcut buttons or links. Pair with useDatePickerActions for selectDate, selectRange, etc.",
      },
      { name: "className / style", desc: "Layout wrapper for preset controls." },
    ],
  },
  {
    group: "useDatePickerActions",
    props: [
      { name: "selectDate(date)", desc: "Dispatch SELECT_DATE — single or toggle in multiple." },
      { name: "selectRange(start, end)", desc: "Dispatch SET_RANGE." },
      { name: "selectDates(dates)", desc: "Dispatch SET_SELECTED_DATES — multiple mode." },
      { name: "selectToday()", desc: "Select today's date." },
      { name: "selectDaysFromToday(n)", desc: "Select today + n days." },
      { name: "mode", type: "SelectionMode", desc: "Current Root mode from context." },
    ],
  },
  {
    group: "HiddenInput",
    props: [
      {
        name: "name",
        type: "string",
        desc: "Override Root name. Renders nothing if no name is set.",
      },
    ],
  },
  {
    group: "Input props",
    props: [
      {
        name: "index",
        type: "0 | 1",
        desc: "Range mode: 0 = start segment, 1 = end segment.",
      },
      {
        name: "segmentLabels",
        type: "{ month?, day?, year? }",
        desc: "Accessible labels for spinbutton segments.",
      },
    ],
  },
  {
    group: "Content props",
    props: [
      { name: "portal", type: "boolean", desc: "Render into document.body." },
      { name: "side / align / sideOffset / alignOffset", desc: "Floating UI positioning." },
      { name: "forceMount", type: "boolean", desc: "Keep in DOM when closed (exit animations)." },
      { name: "avoidCollisions", type: "boolean", def: "true", desc: "Flip when no space." },
    ],
  },
  {
    group: "Data attributes (Root)",
    attrs: true,
    props: [
      { name: "[data-open]", desc: "Popover is open." },
      { name: "[data-invalid]", desc: "invalid prop is true." },
      { name: "[data-focus-within]", desc: "Focus is inside the field (excludes popover)." },
      { name: "[data-readonly]", desc: "readOnly prop is true." },
      { name: "[data-disabled]", desc: "disabled prop is true." },
      { name: "[data-required]", desc: "required prop is true." },
    ],
  },
  {
    group: "Data attributes (Day)",
    attrs: true,
    props: [
      { name: "[data-selected]", desc: "Selected day." },
      { name: "[data-today]", desc: "Current date." },
      { name: "[data-outside-month]", desc: "Adjacent month day." },
      { name: "[data-disabled]", desc: "Disabled (min/max or disabled fn) — no focus." },
      { name: "[data-unavailable]", desc: "Unavailable callback — focusable, not selectable." },
      { name: "[data-in-range]", desc: "Inside range selection." },
      { name: "[data-range-start] / [data-range-end]", desc: "Range endpoints." },
    ],
  },
  {
    group: "Keyboard — Trigger",
    keys: true,
    props: [
      { name: "Enter / Space", desc: "Open popover and move focus into the calendar." },
      { name: "Arrow ↓", desc: "Open popover when closed." },
      { name: "Escape", desc: "Close popover when open; restore focus to trigger." },
    ],
  },
  {
    group: "Keyboard — Segments (Input)",
    keys: true,
    props: [
      { name: "0–9", desc: "Type digits; auto-advance when segment is full." },
      { name: "Arrow ↑ / ↓", desc: "Increment or decrement focused segment." },
      { name: "Arrow ← / → / Tab", desc: "Move between month, day, year segments." },
      { name: "Alt + Arrow ↓", desc: "Open popover when closed." },
      { name: "Alt + Arrow ↑", desc: "Close popover when open." },
      { name: "Backspace", desc: "Clear focused segment." },
      { name: "Escape", desc: "Close popover when open." },
    ],
  },
  {
    group: "Keyboard — Day grid",
    keys: true,
    props: [
      { name: "Arrow keys", desc: "Move focus by day (roving tabindex)." },
      {
        name: "PageUp / PageDown",
        desc: "Previous / next month (pageBehavior visible). single: move focus ±1 month within grid when the target day is visible. Shift + Page = year.",
      },
      { name: "Home / End", desc: "First / last day of focused week." },
      { name: "Enter / Space", desc: "Select focused date." },
      {
        name: "Tab / Shift+Tab",
        desc: "Move between the day grid and header controls (Prev, month/year label, Next).",
      },
      {
        name: "Escape",
        desc: "Close popover. In range mode with pending start, cancels anchor instead.",
      },
    ],
  },
  {
    group: "Keyboard — Header controls",
    keys: true,
    props: [
      {
        name: "Tab / Shift+Tab",
        desc: "Move between Prev, ViewTrigger, Next, and the active grid.",
      },
      {
        name: "Enter / Space",
        desc: "Activate Prev/Next (change month or year page) or ViewTrigger (switch day → month → year view).",
      },
    ],
  },
  {
    group: "Keyboard — Month / Year grids",
    keys: true,
    props: [
      { name: "Arrow keys", desc: "Move between months or years." },
      { name: "PageUp / PageDown", desc: "Year view: previous / next 12-year page." },
      { name: "Enter / Space", desc: "Select month or year; drill into next view." },
      { name: "Escape", desc: "Return to previous view or close popover." },
    ],
  },
];

export type KeyboardRow = { key: string; desc: string };

export const DATE_PICKER_A11Y_ROLES: { part: string; role: string }[] = [
  { part: "DatePicker.Input", role: 'role="combobox" (popover path)' },
  { part: "DatePicker.Trigger", role: "aria-haspopup, aria-expanded, aria-controls" },
  { part: "DatePicker.Content", role: 'role="dialog"' },
  { part: "DatePicker.Grid", role: 'role="grid"' },
  { part: "DatePicker.Day", role: 'role="gridcell" · aria-selected · aria-current="date"' },
  { part: "Input segments", role: 'role="spinbutton" · aria-valuenow · aria-valuetext' },
];

export const DATE_PICKER_SNIPPETS = {
  default: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root>
  <DatePicker.Label>Pick a date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger>📅</DatePicker.Trigger>
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  controlled: `const [value, setValue] = useState<Date | null>(null);

<DatePicker.Root value={value} onValueChange={setValue}>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  dateField: `<DatePicker.Root>
  <DatePicker.Label>Date of birth</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,
  range: `import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DatePicker.Root mode="range" value={range} onValueChange={setRange} closeOnSelect={false}>
  <DatePicker.Input index={0} />
  <DatePicker.Input index={1} />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  multiple: `const [dates, setDates] = useState<Date[]>([]);

<DatePicker.Root mode="multiple" value={dates} onValueChange={setDates} closeOnSelect={false}>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  inline: `// No Content or Trigger — calendar lives in your layout
<DatePicker.Root>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  localization: `// One Root: the segmented input and the calendar share state and
// stay in sync. Segment order, separators, weekday names and week start
// all derive from the locale via Intl — no bundled locale data.
<DatePicker.Root locale="pt-BR">
  <DatePicker.Input />
  <DatePicker.Calendar />
</DatePicker.Root>`,
  minMax: `const min = new Date(2026, 0, 1);
const max = new Date(2026, 11, 31);

<DatePicker.Root minDate={min} maxDate={max}>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  disabled: `<DatePicker.Root disabled={(date) => date.getDay() === 0 || date.getDay() === 6}>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  presets: `import { DatePicker, useDatePickerActions } from "@kenos-ui/react-datepicker";

function PresetButtons() {
  const { selectRange, selectToday } = useDatePickerActions();
  const addDays = (n: number) => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + n);
    selectRange(start, end);
  };
  return (
    <>
      <button type="button" onClick={selectToday}>Today</button>
      <button type="button" onClick={() => addDays(7)}>+1 week</button>
    </>
  );
}

<DatePicker.Root mode="range" closeOnSelect={false}>
  <DatePicker.Content>
    <DatePicker.Presets><PresetButtons /></DatePicker.Presets>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  granularity: `<DatePicker.Root granularity="minute" hourCycle={24} defaultValue={new Date()}>
  <DatePicker.Label>Appointment time</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,
  nonContiguousRange: `<DatePicker.Root
  mode="range"
  unavailable={(date) => date.getDay() === 0}
  allowsNonContiguousRanges
  closeOnSelect={false}
>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  pageBehavior: `<DatePicker.Root pageBehavior="single">
  <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
</DatePicker.Root>`,
  formNative: `<form action="/api/booking" method="post">
  <DatePicker.Root name="checkIn" required>
    <DatePicker.Label>Check-in</DatePicker.Label>
    <DatePicker.Input />
    <DatePicker.Trigger />
    <DatePicker.HiddenInput />
    <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
  </DatePicker.Root>
  <button type="submit">Book</button>
</form>`,
  unavailable: `<DatePicker.Root
  unavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  invalid: `<DatePicker.Root invalid errorMessage="Select a valid date">
  <DatePicker.Label>Appointment</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,
  rtl: `<DatePicker.Root locale="ar-EG" dir="rtl">
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
</DatePicker.Root>`,
  styling: `/* Root state */
[data-invalid] .input { border-color: var(--error); }
[data-focus-within] .input { box-shadow: 0 0 0 2px var(--ring); }

/* Day cells */
.day[data-selected] { background: var(--accent); color: #fff; }
.day[data-today]    { font-weight: 700; }
.day[data-disabled] { opacity: .4; pointer-events: none; }
.day[data-unavailable] { text-decoration: line-through; opacity: .7; }
.day[data-in-range] { background: #dbeafe; }`,
  rhf: `import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  date: z.union([z.date(), z.null()]).refine((d) => d !== null, "Select a date"),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { date: null },
});

<Controller
  control={control}
  name="date"
  render={({ field }) => (
    <DatePicker.Root value={field.value} onValueChange={field.onChange}>
      <DatePicker.Input />
      <DatePicker.Trigger />
      <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
    </DatePicker.Root>
  )}
/>`,
  tanstack: `import { useForm } from "@tanstack/react-form";

const form = useForm({
  defaultValues: { date: null as Date | null },
  onSubmit: ({ value }) => console.log(value),
});

<form.Field name="date">
  {(field) => (
    <DatePicker.Root value={field.state.value} onValueChange={field.handleChange}>
      <DatePicker.Input />
      <DatePicker.Trigger />
      <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
    </DatePicker.Root>
  )}
</form.Field>`,
  rangeRhf: `import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";

const schema = z.object({
  range: z
    .object({ start: z.union([z.date(), z.null()]), end: z.union([z.date(), z.null()]) })
    .refine((r) => r.start !== null && r.end !== null, "Select a date range"),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { range: { start: null, end: null } as DateRange },
});

<Controller
  control={control}
  name="range"
  render={({ field }) => (
    <DatePicker.Root mode="range" value={field.value} onValueChange={field.onChange} closeOnSelect={false}>
      <DatePicker.Input index={0} />
      <DatePicker.Input index={1} />
      <DatePicker.Trigger />
      <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
    </DatePicker.Root>
  )}
/>`,
  rangeTanstack: `import { useForm } from "@tanstack/react-form";
import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";

const form = useForm({
  defaultValues: { range: { start: null, end: null } as DateRange },
  onSubmit: ({ value }) => console.log(value),
});

<form.Field name="range">
  {(field) => (
    <DatePicker.Root
      mode="range"
      value={field.state.value}
      onValueChange={field.handleChange}
      closeOnSelect={false}
    >
      <DatePicker.Input index={0} />
      <DatePicker.Input index={1} />
      <DatePicker.Trigger />
      <DatePicker.Content><DatePicker.Calendar /></DatePicker.Content>
    </DatePicker.Root>
  )}
</form.Field>`,
} as const;
