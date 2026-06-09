# Kenos UI

The space before design. Composable, accessible, unstyled React primitives — start with structure, finish with style. Built on top of the native Intl API, timescape and Floating UI — with full keyboard navigation and WAI-ARIA compliance.

- **Truly headless** — no default styles; bring your own CSS (Tailwind, Panda CSS, CSS modules, inline styles)
- **Fully accessible** — WAI-ARIA date picker pattern, keyboard navigation, screen reader support
- **Predictable** — plain `useReducer`, no hidden magic
- **Simpler API** — `<DatePicker.Calendar />` shorthand for the common case; escape hatches for full control

## Features

- **Calendar** — WAI-ARIA grid pattern with roving focus and full keyboard navigation (day / month / year views)
- **Segmented Input** — Locale-aware month/day/year spinbutton input powered by timescape (excellent keyboard UX)
- **Popover Picker** — Input + calendar popover, or Trigger + calendar
- **Range & Multiple** — Built-in support for date ranges (with hover preview) and multi-date selection via `mode`
- **Fully composable** — Use the high-level `<DatePicker.Calendar />` or compose your own with `View`, `Grid`, `Day` render prop, etc.
- Locale-aware (week start, segment order, RTL) via native `Intl`
- Unstyled — bring your own CSS
- React 19+, TypeScript-first, ~50 kB
- Strong accessibility: roving tabindex, live regions, focus management, click-outside, Escape handling

---

## Installation

```bash
pnpm add @kenos-ui/react-datepicker
# or
npm install @kenos-ui/react-datepicker
```

Requires React ≥ 19.

---

## Quick start

The most common pattern uses the segmented input + calendar popover:

```tsx
import { DatePicker } from "@kenos-ui/react-datepicker";
import { useState } from "react";

function MyDatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker.Root value={date} onValueChange={setDate}>
      <DatePicker.Label>Select date</DatePicker.Label>
      <div>
        <DatePicker.Input />
        <DatePicker.Trigger>📅</DatePicker.Trigger>
      </div>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

You can also use it as a pure calendar (no input) by rendering only `<DatePicker.Calendar />` or the low-level parts.

Apply your own styles via `className`, `style`, or `data-*` attribute selectors — no stylesheet is included.

---

## Range selection

```tsx
import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";
import { useState } from "react";

function TripDates() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <DatePicker.Root mode="range" value={range} onValueChange={setRange}>
      <DatePicker.Label>Trip dates</DatePicker.Label>
      <div>
        <DatePicker.Input index={0} />
        <span>to</span>
        <DatePicker.Input index={1} />
        <DatePicker.Trigger>📅</DatePicker.Trigger>
      </div>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

The same `Root` supports `mode="multiple"` for selecting several dates (the segmented `<DatePicker.Input />` also works in multiple mode).

---

## Component reference

### `<DatePicker.Root>`

The context provider. All date picker parts must be rendered inside it.

Supports three modes via the `mode` prop:

- `"single"` (default) — `value?: Date | null`
- `"range"` — `value?: { start: Date | null; end: Date | null }`
- `"multiple"` — `value?: Date[]`

| Prop            | Type                                   | Default              | Description                                                           |
| --------------- | -------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| `mode`          | `"single" \| "range" \| "multiple"`    | `"single"`           | Selection mode                                                        |
| `value`         | (see modes above)                      | —                    | Controlled value                                                      |
| `defaultValue`  | (see modes above)                      | —                    | Uncontrolled initial value                                            |
| `onValueChange` | (mode-specific)                        | —                    | Called when selection changes                                         |
| `locale`        | `string`                               | `navigator.language` | BCP 47 locale tag (`'en-US'`, `'fr-FR'`, …)                           |
| `weekStartsOn`  | `0–6`                                  | locale default       | Override first day of week (0 = Sunday)                               |
| `minDate`       | `Date`                                 | —                    | Earliest selectable date                                              |
| `maxDate`       | `Date`                                 | —                    | Latest selectable date                                                |
| `disabled`      | `boolean \| ((date: Date) => boolean)` | —                    | Disable all or specific dates                                         |
| `readOnly`      | `boolean`                              | `false`              | Allow navigation but block selection                                  |
| `open`          | `boolean`                              | —                    | Controlled open state of the popover                                  |
| `defaultOpen`   | `boolean`                              | `false`              | Start with popover open                                               |
| `onOpenChange`  | `(open: boolean) => void`              | —                    | Called when popover opens/closes                                      |
| `modal`         | `boolean`                              | `false`              | Opt-in focus trap + `aria-modal` (popup policy)                       |
| `closeOnSelect` | `boolean`                              | `true` (single)      | Close popover after a selection (false for range/multiple by default) |

---

### `<DatePicker.Label>`

Renders a `<label>` automatically linked to the input via `htmlFor`/`id`.

---

### `<DatePicker.Input>`

Segmented date input for locale-aware month/day/year editing.

| Prop            | Type                                              | Description                                 |
| --------------- | ------------------------------------------------- | ------------------------------------------- |
| `index`         | `0 \| 1`                                          | For range mode: 0 = start, 1 = end input    |
| `segmentLabels` | `{ month?: string; day?: string; year?: string }` | Accessible labels for the editable segments |

**Keyboard:** digits edit the focused segment · `ArrowUp`/`ArrowDown` increments/decrements · `ArrowLeft`/`ArrowRight` moves between segments · `Backspace`/`Delete` clears · `Escape` closes

---

### `<DatePicker.Trigger>`

Button that toggles the calendar popup. Automatically wires `aria-haspopup`, `aria-expanded`, `aria-controls`.

---

### `<DatePicker.Content>`

The popover container (`role="dialog"`). Handles positioning (Floating UI), click-outside, Escape, and focus management.

| Prop                         | Type      | Description                                                                                    |
| ---------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `forceMount`                 | `boolean` | Keep the element in the DOM when closed (enables CSS exit animations via `[data-state]`)       |
| `portal`                     | `boolean` | Render into `document.body` (useful for stacking contexts)                                     |
| `side` / `align`             | string    | Positioning relative to the anchor (`top`, `bottom`, `left`, `right` + `start`/`center`/`end`) |
| `sideOffset` / `alignOffset` | number    | Distance from the anchor                                                                       |
| `avoidCollisions`            | `boolean` | Whether to flip when there is no space (default true)                                          |
| `collisionPadding`           | number    | Padding from viewport edges when avoiding collisions                                           |

**Animation hook:** use `[data-state="open"]` / `[data-state="closed"]` selectors with CSS transitions when using `forceMount`.

---

### `<DatePicker.Calendar>`

Convenience composite that renders navigation controls + week day headers + day grid with default styling hooks. Covers 90% of use cases with no configuration required.

---

### `<DatePicker.View>`

Conditionally renders its children only when the current view matches.

```tsx
<DatePicker.View view="day">…</DatePicker.View>
<DatePicker.View view="month">…</DatePicker.View>
<DatePicker.View view="year">…</DatePicker.View>
```

---

### `<DatePicker.ViewControl>` / `<DatePicker.PrevTrigger>` / `<DatePicker.NextTrigger>` / `<DatePicker.ViewTrigger>`

Navigation header. `PrevTrigger` and `NextTrigger` label themselves contextually ("Go to previous month / year / years"). `ViewTrigger` cycles day → month → year view.

---

### `<DatePicker.Grid>`

Renders `<table role="grid">` with keyboard navigation built in.

| Prop       | Type                                      | Description                                           |
| ---------- | ----------------------------------------- | ----------------------------------------------------- |
| `header`   | `ReactNode`                               | Content for `<thead>` (use `<DatePicker.WeekDays />`) |
| `children` | `(ctx: { weeks: Date[][] }) => ReactNode` | Custom day rendering                                  |

**Keyboard (day view):** `←→↑↓` move focus · `PageUp/Down` prev/next month · `Ctrl+PageUp/Down` prev/next year · `Home/End` start/end of week · `Enter/Space` select · `Escape` close

---

### `<DatePicker.WeekDays>`

Renders `<tr>` of `<th scope="col">` column headers with locale-aware day abbreviations.

| Prop     | Type                            | Default   | Description     |
| -------- | ------------------------------- | --------- | --------------- |
| `format` | `'short' \| 'narrow' \| 'long'` | `'short'` | Day name format |

---

### `<DatePicker.Day>`

Single day cell (`role="gridcell"`). Exposes `data-*` attributes for CSS styling.

| Prop       | Type                               | Description                   |
| ---------- | ---------------------------------- | ----------------------------- |
| `date`     | `Date`                             | The date this cell represents |
| `children` | `(meta: DayCellMeta) => ReactNode` | Custom render function        |

**`data-*` attributes:** `data-selected` · `data-today` · `data-disabled` · `data-outside-month` · `data-range-start` · `data-range-end` · `data-in-range`

**`DayCellMeta`:**

```typescript
interface DayCellMeta {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
}
```

---

### `<DatePicker.MonthGrid>` / `<DatePicker.MonthCell>`

Month selection grid for the "month" view.

```tsx
<DatePicker.MonthGrid>
  {({ months }) =>
    months.map((m) => (
      <DatePicker.MonthCell key={m.value} value={m.value} disabled={m.isDisabled}>
        {m.label}
      </DatePicker.MonthCell>
    ))
  }
</DatePicker.MonthGrid>
```

**Keyboard:** `←→` ±1 month · `↑↓` ±3 months (row) · `PageUp/Down` prev/next year · `Home/End` Jan/Dec · `Enter/Space` select · `Escape` back to day view

---

### `<DatePicker.YearGrid>` / `<DatePicker.YearCell>`

Year selection grid for the "year" view.

```tsx
<DatePicker.YearGrid>
  {({ years }) =>
    years.map((y) => (
      <DatePicker.YearCell key={y.value} value={y.value} disabled={y.isDisabled}>
        {y.value}
      </DatePicker.YearCell>
    ))
  }
</DatePicker.YearGrid>
```

**Keyboard:** `←→` ±1 year · `↑↓` ±4 years (row) · `PageUp/Down` prev/next page · `Home/End` first/last · `Enter/Space` select · `Escape` back to month view

---

### Advanced: `useDatePickerContext`

For building highly custom parts or integrating with external state, you can access the internal state and dispatch:

```tsx
import { useDatePickerContext } from "@kenos-ui/react-datepicker";

function CustomPart() {
  const { state, dispatch, config } = useDatePickerContext();
  // ...
}
```

---

## Styling

Every component is unstyled. Use any approach:

**CSS `data-*` selectors (recommended):**

```css
[data-selected] {
  background: #2563eb;
  color: white;
}
[data-today] {
  font-weight: bold;
}
[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
[data-in-range] {
  background: #dbeafe;
}
```

**Tailwind:**

```tsx
<DatePicker.Day date={day}>
  {({ isSelected, isToday, isDisabled }) => (
    <td
      className={cn(
        "h-8 w-8 text-center text-sm rounded cursor-pointer",
        isSelected && "bg-blue-600 text-white",
        isToday && !isSelected && "font-bold text-blue-600",
        isDisabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {day.getDate()}
    </td>
  )}
</DatePicker.Day>
```

**CSS animations with `forceMount`:**

```tsx
<DatePicker.Content forceMount>…</DatePicker.Content>
```

```css
[data-state="open"] {
  animation: slideIn 150ms ease;
}
[data-state="closed"] {
  animation: slideOut 150ms ease;
}
```

---

## Accessibility

- `role="combobox"` on input, `role="dialog"` + `aria-modal` on popup, `role="grid"` on calendar
- Full roving tabindex within day/month/year grids
- `aria-selected`, `aria-disabled`, `aria-current="date"` on day cells
- `aria-live="polite"` region announces month navigation to screen readers
- Focus trap within dialog; focus returns to trigger on close
- All WAI-ARIA keyboard patterns implemented per [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

---

## Architecture

| Concern             | Approach                                           |
| ------------------- | -------------------------------------------------- |
| State management    | No external state management libraries             |
| Date arithmetic     | Native `Date` API                                  |
| Locale / formatting | `Intl.DateTimeFormat`, `Intl.Locale`               |
| Styling             | Zero — `data-*` attributes + className passthrough |
| Bundle              | ~50KB ESM+CJS                                      |

---

## License

MIT
