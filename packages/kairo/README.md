# @at5/kairo

> **Deprecated.** This package is no longer maintained. Use [`@kenos-ui/react-datepicker`](https://www.npmjs.com/package/@kenos-ui/react-datepicker) instead.

`@at5/kairo` is a thin compatibility shim that re-exports `@kenos-ui/react-datepicker`. Existing installs keep working, but new projects should install Kenos directly.

## Migrate

### From `@at5/kairo`

```bash
pnpm remove @at5/kairo
pnpm add @kenos-ui/react-datepicker
```

```diff
- import { DatePicker } from "@at5/kairo";
+ import { DatePicker } from "@kenos-ui/react-datepicker";
```

No API changes — same `DatePicker.*` compound components, props, and behavior.

### From `@torq-ui/*` (removed)

The interim `@torq-ui/react-date-picker` and `@torq-ui/react` packages were deleted from npm. Replace them with Kenos:

```bash
pnpm remove @torq-ui/react-date-picker @torq-ui/react
pnpm add @kenos-ui/react-datepicker
```

```diff
- import { DatePicker } from "@torq-ui/react-date-picker";
- import { DatePicker } from "@torq-ui/react";
+ import { DatePicker } from "@kenos-ui/react-datepicker";
```

### From `@at5/axis-datepicker` or `@at5/axis`

```bash
pnpm remove @at5/axis-datepicker @at5/axis
pnpm add @kenos-ui/react-datepicker
```

```diff
- import { DatePicker } from "@at5/axis-datepicker";
+ import { DatePicker } from "@kenos-ui/react-datepicker";
```

## Install (new projects)

```bash
pnpm add @kenos-ui/react-datepicker
# or
npm install @kenos-ui/react-datepicker
```

```tsx
import { DatePicker } from "@kenos-ui/react-datepicker";

export function MyDatePicker() {
  return (
    <DatePicker.Root onValueChange={(date) => console.log(date)}>
      <DatePicker.Label>Pick a date</DatePicker.Label>
      <DatePicker.Input />
      <DatePicker.Trigger />
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

## Docs

- [kenos.at5.dev](https://kenos.at5.dev) — installation, API, examples
- [@kenos-ui/react](https://www.npmjs.com/package/@kenos-ui/react) — aggregator package (optional)

## Why Kenos?

Kenos UI (`@kenos-ui`) is the current home for these primitives. `@at5/kairo` remains published only so existing lockfiles and dependents can transition without a breaking release.