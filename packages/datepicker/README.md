# @kenos-ui/react-datepicker

Headless date & scheduling primitives for React.

Built on native `Intl`, [timescape](https://github.com/dan-lee/timescape) (segmented inputs), and Floating UI. Full keyboard navigation, WAI-ARIA patterns, and a focus on real-world composition.

- Single, range, and multiple selection with one API (`mode`)
- Outstanding segmented date input (`<DatePicker.Input />`)
- Fully unstyled — bring your own CSS or Tailwind
- Excellent keyboard + screen reader support
- React 19+ and TypeScript-first

## Installation

```bash
npm install @kenos-ui/react-datepicker
```

## Quick start (with segmented input)

```tsx
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
}
```

The `<DatePicker.Input />` gives users a native-feeling segmented editor (month / day / year) that respects the locale's order and separators.

## Date range

One of the strongest use cases:

```tsx
import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";

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

Range mode includes live hover preview between start and end.

## Multiple dates

```tsx
<DatePicker.Root mode="multiple" onValueChange={setDates}>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>
```

## Calendar composition

Use the convenient shorthand:

```tsx
<DatePicker.Root>
  <DatePicker.Calendar />
</DatePicker.Root>
```

Or take full control:

```tsx
<DatePicker.Root>
  <DatePicker.ViewControl>
    <DatePicker.PrevTrigger />
    <DatePicker.ViewTrigger />
    <DatePicker.NextTrigger />
  </DatePicker.ViewControl>

  <DatePicker.View view="day">
    <DatePicker.Grid header={<DatePicker.WeekDays />}>
      {({ weeks }) =>
        weeks.map((week, i) => (
          <tr key={i}>
            {week.map((d, j) => (
              <DatePicker.Day key={j} date={d}>
                {({ isSelected, isToday }) => (
                  // custom rendering
                  <span className={isSelected ? "selected" : ""}>{d.getDate()}</span>
                )}
              </DatePicker.Day>
            ))}
          </tr>
        ))
      }
    </DatePicker.Grid>
  </DatePicker.View>
</DatePicker.Root>
```

You can also render month/year grids with `MonthGrid` / `YearGrid`.

## Positioning & advanced Content

`<DatePicker.Content>` is powered by Floating UI and supports:

- `side`, `align`, `sideOffset`, `alignOffset`
- `portal`
- `forceMount` (for enter/exit animations via `[data-state="open"]`)
- `avoidCollisions`

```tsx
<DatePicker.Content portal side="top" align="end" forceMount>
  <DatePicker.Calendar />
</DatePicker.Content>
```

## Key props on Root

- `mode`: `"single" | "range" | "multiple"`
- `locale`, `weekStartsOn`
- `minDate`, `maxDate`, `disabled`
- `readOnly`
- `modal` — opt-in focus trap + `aria-modal` (default `false` — follows popup policy)
- `defaultOpen`, `closeOnSelect`

See the full prop tables and more examples in the [project README](https://github.com/allysontsoares/kenos-ui/blob/main/README.md).

## Localization

Everything is driven by `Intl.Locale`:

```tsx
<DatePicker.Root locale="pt-BR" />   {/* dd/mm/yyyy, week starts Monday */}
<DatePicker.Root locale="ar" />      {/* RTL + Saturday start */}
<DatePicker.Root locale="ja-JP" />
```

## Requirements

- React ≥ 19
- Node ≥ 22

## Exports

```ts
import {
  DatePicker,
  useDatePickerContext,
  // types
  type DatePickerRootProps,
  type DateRange,
  type DayCellMeta,
  // ...
} from "@kenos-ui/react-datepicker";
```

## License

MIT

---

_Kenos UI_ — https://github.com/allysontsoares/kenos-ui/tree/main/packages/datepicker
