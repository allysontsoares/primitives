# Kairo

Headless, accessible DatePicker primitive for React by AT5 — zero runtime dependencies.

- **Zero deps** — only React + TypeScript + native browser APIs (`Intl`, `Date`)
- **Truly headless** — no default styles; bring your own CSS (Tailwind, Panda CSS, CSS modules, inline styles)
- **Fully accessible** — WAI-ARIA date picker pattern, keyboard navigation, screen reader support
- **State machine powered** — predictable behavior via plain `useReducer` (no Zag JS)
- **Simpler API** — `<DatePicker.Calendar />` shorthand for the common case; escape hatches for full control

---

## Installation

```bash
pnpm add @at5/kairo
# or
npm install @at5/kairo
```

Requires React ≥ 18.

---

## Quick start

```tsx
import * as DatePicker from '@at5/kairo';

function MyDatePicker() {
  return (
    <DatePicker.Root defaultValue={new Date()} onValueChange={console.log}>
      <DatePicker.Label>Departure date</DatePicker.Label>
      <DatePicker.Input />
      <DatePicker.Trigger>📅</DatePicker.Trigger>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

Apply your own styles via `className`, `style`, or `data-*` attribute selectors — no stylesheet is included.

---

## Component reference

### `<DatePicker.Root>`

The context provider. Accepts all shared props plus a mode-specific value/onChange pair.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode |
| `value` | `Date \| null` | — | Controlled value (single mode) |
| `defaultValue` | `Date \| null` | — | Uncontrolled initial value |
| `onValueChange` | `(date: Date \| null) => void` | — | Called when selection changes |
| `locale` | `string` | `navigator.language` | BCP 47 locale tag (`'en-US'`, `'fr-FR'`, …) |
| `weekStartsOn` | `0–6` | locale default | Override first day of week (0 = Sunday) |
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |
| `disabled` | `boolean \| ((date: Date) => boolean)` | — | Disable all or specific dates |
| `readOnly` | `boolean` | `false` | Allow navigation but block selection |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when popup opens/closes |
| `modal` | `boolean` | `true` | Trap focus inside the dialog |
| `closeOnSelect` | `boolean` | `true` (single) | Close after selection |

**Range mode:**
```tsx
<DatePicker.Root
  mode="range"
  value={{ start: startDate, end: endDate }}
  onValueChange={({ start, end }) => { setStart(start); setEnd(end); }}
>
```

**Multiple mode:**
```tsx
<DatePicker.Root
  mode="multiple"
  value={selectedDates}
  onValueChange={setSelectedDates}
>
```

---

### `<DatePicker.Label>`

Renders a `<label>` automatically linked to the input via `htmlFor`/`id`.

---

### `<DatePicker.Input>`

Segmented date input for locale-aware month/day/year editing.

| Prop | Type | Description |
|------|------|-------------|
| `index` | `0 \| 1` | For range mode: 0 = start, 1 = end input |
| `segmentLabels` | `{ month?: string; day?: string; year?: string }` | Accessible labels for the editable segments |

**Keyboard:** digits edit the focused segment · `ArrowUp`/`ArrowDown` increments/decrements · `ArrowLeft`/`ArrowRight` moves between segments · `Backspace`/`Delete` clears · `Escape` closes

---

### `<DatePicker.Trigger>`

Button that toggles the calendar popup. Automatically wires `aria-haspopup`, `aria-expanded`, `aria-controls`.

---

### `<DatePicker.Content>`

The popup container (`role="dialog"`, `aria-modal`). Manages click-outside close, focus trap, and Escape key.

| Prop | Type | Description |
|------|------|-------------|
| `forceMount` | `boolean` | Keep mounted when closed (for CSS animations via `data-state="open|closed"`) |

**Animation hook:** use `[data-state="open"]` / `[data-state="closed"]` selectors with CSS transitions.

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

| Prop | Type | Description |
|------|------|-------------|
| `header` | `ReactNode` | Content for `<thead>` (use `<DatePicker.WeekDays />`) |
| `children` | `(ctx: { weeks: Date[][] }) => ReactNode` | Custom day rendering |

**Keyboard (day view):** `←→↑↓` move focus · `PageUp/Down` prev/next month · `Ctrl+PageUp/Down` prev/next year · `Home/End` start/end of week · `Enter/Space` select · `Escape` close

---

### `<DatePicker.WeekDays>`

Renders `<tr>` of `<th scope="col">` column headers with locale-aware day abbreviations.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `'short' \| 'narrow' \| 'long'` | `'short'` | Day name format |

---

### `<DatePicker.Day>`

Single day cell (`role="gridcell"`). Exposes `data-*` attributes for CSS styling.

| Prop | Type | Description |
|------|------|-------------|
| `date` | `Date` | The date this cell represents |
| `children` | `(meta: DayCellMeta) => ReactNode` | Custom render function |

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
  {({ months }) => months.map(m => (
    <DatePicker.MonthCell key={m.value} value={m.value} disabled={m.isDisabled}>
      {m.label}
    </DatePicker.MonthCell>
  ))}
</DatePicker.MonthGrid>
```

**Keyboard:** `←→` ±1 month · `↑↓` ±3 months (row) · `PageUp/Down` prev/next year · `Home/End` Jan/Dec · `Enter/Space` select · `Escape` back to day view

---

### `<DatePicker.YearGrid>` / `<DatePicker.YearCell>`

Year selection grid for the "year" view.

```tsx
<DatePicker.YearGrid>
  {({ years }) => years.map(y => (
    <DatePicker.YearCell key={y.value} value={y.value} disabled={y.isDisabled}>
      {y.value}
    </DatePicker.YearCell>
  ))}
</DatePicker.YearGrid>
```

**Keyboard:** `←→` ±1 year · `↑↓` ±4 years (row) · `PageUp/Down` prev/next page · `Home/End` first/last · `Enter/Space` select · `Escape` back to month view

---

## Styling

Every component is unstyled. Use any approach:

**CSS `data-*` selectors (recommended):**
```css
[data-selected] { background: #2563eb; color: white; }
[data-today] { font-weight: bold; }
[data-disabled] { opacity: 0.4; cursor: not-allowed; }
[data-in-range] { background: #dbeafe; }
```

**Tailwind:**
```tsx
<DatePicker.Day date={day}>
  {({ isSelected, isToday, isDisabled }) => (
    <td className={cn(
      'h-8 w-8 text-center text-sm rounded cursor-pointer',
      isSelected && 'bg-blue-600 text-white',
      isToday && !isSelected && 'font-bold text-blue-600',
      isDisabled && 'opacity-40 cursor-not-allowed',
    )}>
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
[data-state="open"]  { animation: slideIn 150ms ease; }
[data-state="closed"] { animation: slideOut 150ms ease; }
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

| Concern | Approach |
|---------|----------|
| State management | Pure `useReducer` — no Zag JS |
| Date arithmetic | Native `Date` API |
| Locale / formatting | `Intl.DateTimeFormat`, `Intl.Locale` |
| Styling | Zero — `data-*` attributes + className passthrough |
| Bundle | ~35KB ESM+CJS, zero runtime deps |

---

## Development

```bash
pnpm install
pnpm test          # vitest
pnpm type-check    # tsc --noEmit
pnpm build         # tsup → dist/
pnpm storybook     # visual demos + a11y audit
```
