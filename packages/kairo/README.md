# @at5/kairo

Headless date & scheduling primitives for React. Built on top of the native `Intl` API, timescape and Floating UI — with full keyboard navigation and WAI-ARIA compliance.

## Features

- **Calendar** — WAI-ARIA grid pattern with roving focus and full keyboard navigation
- **Date Picker** — Input + popover calendar, semantic HTML only
- **Date Range Picker** — Dual-endpoint selection with live hover preview and optional presets
- **Date Field** — Segmented spinbutton input (day/month/year), no calendar required
- Locale-aware: respects week start day, date format order, and RTL scripts
- Unstyled — bring your own CSS
- React 19+, TypeScript-first

## Installation

```bash
npm install @at5/kairo
```

## Quick Start

```tsx
import { DatePicker } from "@at5/kairo";

function App() {
  return (
    <DatePicker.Root>
      <DatePicker.Trigger>Pick a date</DatePicker.Trigger>
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

## Components

### Calendar

Standalone month grid with keyboard navigation.

```tsx
import { Calendar } from "@at5/kairo";

<Calendar.Root
  locale="en-US"
  onValueChange={(date) => console.log(date)}
/>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `locale`, `weekStartsOn`, `min`, `max`, `isDateUnavailable`, `numberOfMonths`

**Data attributes:** `[data-selected]`, `[data-today]`, `[data-outside-range]`, `[data-disabled]`

---

### Date Picker

Text input paired with a calendar popover.

```tsx
import { DatePicker } from "@at5/kairo";

<DatePicker.Root
  locale="en-US"
  onValueChange={(date) => console.log(date)}
>
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `open`, `onOpenChange`, `locale`, `format`, `closeOnSelect`, `placement`

**Keyboard:** `Enter`/`Space` opens popover, `Escape` closes, arrow keys navigate calendar.

---

### Date Range Picker

Selects a start and end date with optional night presets.

```tsx
import { DateRangePicker } from "@at5/kairo";

<DateRangePicker.Root
  locale="en-US"
  onValueChange={({ start, end }) => console.log(start, end)}
>
  <DateRangePicker.Trigger />
  <DateRangePicker.Content>
    <DateRangePicker.Calendar />
  </DateRangePicker.Content>
</DateRangePicker.Root>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `minNights`, `maxNights`, `presets`, `locale`

---

### Date Field

Segmented spinbutton input — no popover, locale-aware segment order.

```tsx
import { DateField } from "@at5/kairo";

<DateField.Root locale="en-US" onValueChange={(date) => console.log(date)}>
  <DateField.Segment segment="month" />
  <DateField.Literal>/</DateField.Literal>
  <DateField.Segment segment="day" />
  <DateField.Literal>/</DateField.Literal>
  <DateField.Segment segment="year" />
</DateField.Root>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `locale`, `granularity`, `min`, `max`

**Keyboard:** `↑`/`↓` increments/decrements the focused segment, `Tab` advances to next segment.

## Localization

All components accept a `locale` prop compatible with `Intl.Locale`. Week start day, month/day/year order, and calendar display adapt automatically.

```tsx
// Arabic RTL
<DatePicker.Root locale="ar" />

// Brazilian Portuguese
<DatePicker.Root locale="pt-BR" />

// Japanese
<DatePicker.Root locale="ja-JP" />
```

## Requirements

- React `>=19.0.0`
- Node.js `>=22`

## License

MIT
