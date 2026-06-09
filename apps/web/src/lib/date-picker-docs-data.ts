import type { AnatomyNode, ApiGroup } from "./docs-data";

export const DATE_PICKER_FEATURES = [
  "Single, range, and multiple selection via one Root API (mode).",
  "Segmented date input powered by timescape — locale-aware order and separators.",
  "Popover calendar with Floating UI positioning, or inline calendar via composition.",
  "Full keyboard navigation across segments, day/month/year grids.",
  "WAI-ARIA grid and spinbutton semantics built in.",
  "Unstyled — style with className, style, and data-* attributes.",
  "Localization via Intl (locale, weekStartsOn) — no bundled locale data.",
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
        desc: "Disable all dates or specific dates.",
      },
      { name: "readOnly", type: "boolean", desc: "Prevent edits via segments or grid." },
      {
        name: "closeOnSelect",
        type: "boolean",
        def: "true (single)",
        desc: "Close popover after selection. Default false for range/multiple.",
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
    group: "Data attributes (Day)",
    attrs: true,
    props: [
      { name: "[data-selected]", desc: "Selected day." },
      { name: "[data-today]", desc: "Current date." },
      { name: "[data-outside-month]", desc: "Adjacent month day." },
      { name: "[data-disabled]", desc: "Unavailable (min/max or disabled fn)." },
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
      { name: "Backspace", desc: "Clear focused segment." },
    ],
  },
  {
    group: "Keyboard — Day grid",
    keys: true,
    props: [
      { name: "Arrow keys", desc: "Move focus by day (roving tabindex)." },
      { name: "PageUp / PageDown", desc: "Previous / next month. Shift + Page = year." },
      { name: "Home / End", desc: "First / last day of focused week." },
      { name: "Enter / Space", desc: "Select focused date." },
      { name: "Escape", desc: "Close popover; return focus to trigger." },
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
  multiple: `<DatePicker.Root mode="multiple" defaultValue={[]} onValueChange={setDates}>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content closeOnSelect={false}>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  inline: `// No Content or Trigger — calendar lives in your layout
<DatePicker.Root>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  localization: `<DatePicker.Root locale="pt-BR">
  <DatePicker.Input />
</DatePicker.Root>`,
  minMax: `const min = new Date(2026, 0, 1);
const max = new Date(2026, 11, 31);

<DatePicker.Root minDate={min} maxDate={max}>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  disabled: `<DatePicker.Root disabled={(date) => date.getDay() === 0 || date.getDay() === 6}>
  <DatePicker.Calendar />
</DatePicker.Root>`,
  presets: `import { useDatePickerContext } from "@kenos-ui/react-datepicker";

function Presets() {
  const { dispatch } = useDatePickerContext();
  return (
    <button type="button" onClick={() => dispatch({ type: "SET_RANGE", start, end })}>
      +1 week
    </button>
  );
}`,
  styling: `.day[data-selected] { background: var(--accent); color: #fff; }
.day[data-today]    { font-weight: 700; }
.day[data-disabled] { opacity: .4; pointer-events: none; }
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
