# @kenos-ui/react-datepicker

## Unreleased

### Minor Changes

- Refactor day, month, and year grids to use `useGridNavigation` from `@kenos-ui/utils`.
- Range drag selection with pointer events (mouse/pen).
- Clicking an existing range endpoint re-anchors the selection.
- Ctrl/Cmd+click toggles dates in `multiple` mode without clearing the input.
- `useDatePickerAnnouncer` for month, selection, and range-complete screen reader updates.
- Remove duplicate `use-roving-tabindex.ts` (use `@kenos-ui/utils`).
- Controlled `mode="multiple"` sync, `pageBehavior`, `allowsNonContiguousRanges`, `Presets` + `useDatePickerActions`, and time `granularity` via timescape segments.

### Patch Changes

- Fix range selection by click after drag refactor — second click completes the interval again.
- Grid keyboard navigation crosses month boundaries (Arrow at edges paginates via `FOCUS_DATE`).
- CLDR-based `getWeekStartDay` fixes SSR hydration mismatches across Node and browser ICU.
- Portaled `Content` waits for client mount before rendering.
- Arrow keys in day/month/year grids call `preventDefault` so the page does not scroll alongside grid focus.
- Add `<DatePicker.ErrorMessage>` for visible invalid-state messaging.
- `Calendar` shorthand uses abbreviated month labels (`shortLabel`) consistent with composed demos.

## 0.4.2

### Patch Changes

- 3222bd8: Sync controlled single `value` into reducer state via a new `SET_SELECTED_DATE` action, keeping the segmented input and calendar focused month in sync when the prop changes externally.

## 0.4.1

### Minor Changes

- **Kenos UI DatePicker — feature release** (`@kenos-ui/react-datepicker@0.4.1`)

  Headless date & scheduling primitives for React 19+, fully unstyled and composition-first.

  **Selection API**
  - Unified `DatePicker.Root` with `mode`: `"single"` | `"range"` | `"multiple"`
  - Controlled / uncontrolled `value`, `open`, and `onValueChange` / `onOpenChange`
  - Range mode with live hover preview between `rangeStart` and `rangeEnd`
  - `minDate`, `maxDate`, `disabled` (boolean or per-date function), `readOnly`, `closeOnSelect`

  **Segmented input (timescape)**
  - First-class `<DatePicker.Input />` — locale-aware month / day / year segments
  - Dual inputs for range (`index={0}` / `index={1}`)
  - Bidirectional sync: type in segments or pick from calendar
  - Custom `segmentLabels` for screen readers

  **Compound calendar parts**
  - `Label`, `Trigger`, `Content`, `Calendar` (shorthand composition)
  - `ViewControl`, `PrevTrigger`, `NextTrigger`, `ViewTrigger`
  - `View` with `day` / `month` / `year` drill-down
  - `Grid`, `Day` (render-prop `DayCellMeta`), `WeekDays`
  - `MonthGrid` / `MonthCell`, `YearGrid` / `YearCell`
  - `useDatePickerContext()` for custom layouts

  **Positioning & popup policy**
  - Floating UI via `Content`: `side`, `align`, `sideOffset`, `avoidCollisions`, `portal`
  - `forceMount` for enter/exit animations (`data-state`)
  - `modal` prop (default `false`) — opt-in focus trap + `aria-modal`; popup-policy friendly
  - Focus restore to trigger / input on close; dialog-interop (`Escape` does not bubble)

  **State & i18n**
  - Reducer-driven state machine (`OPEN`, `SELECT_DATE`, `NAV_PREV`/`NAV_NEXT`, `SET_VIEW`, `COMMIT_INPUT`, …)
  - `Intl`-based locale: week start, month/year labels, segment order & separators
  - `weekStartsOn` override

  **Accessibility & quality**
  - WAI-ARIA: `role="dialog"`, `grid` / `gridcell`, labelled inputs, keyboard roving tabindex
  - Test suite: reducer, calendar grid, date utils, ARIA, keyboard nav, dialog interop, axe (vitest-axe)
  - Storybook: Single, Range, Multiple, Locales

  **Docs**
  - README with quick start, range / multiple examples, full composition, localization, and `Content` props

  **Packaging**
  - Add `license: MIT` to `package.json` (fixes npm registry showing "no license")

## 0.4.0

### Minor Changes

- **Kenos UI DatePicker — feature release** (`@kenos-ui/react-datepicker@0.4.0`)

  Headless date & scheduling primitives for React 19+, fully unstyled and composition-first.

  **Selection API**
  - Unified `DatePicker.Root` with `mode`: `"single"` | `"range"` | `"multiple"`
  - Controlled / uncontrolled `value`, `open`, and `onValueChange` / `onOpenChange`
  - Range mode with live hover preview between `rangeStart` and `rangeEnd`
  - `minDate`, `maxDate`, `disabled` (boolean or per-date function), `readOnly`, `closeOnSelect`

  **Segmented input (timescape)**
  - First-class `<DatePicker.Input />` — locale-aware month / day / year segments
  - Dual inputs for range (`index={0}` / `index={1}`)
  - Bidirectional sync: type in segments or pick from calendar
  - Custom `segmentLabels` for screen readers

  **Compound calendar parts**
  - `Label`, `Trigger`, `Content`, `Calendar` (shorthand composition)
  - `ViewControl`, `PrevTrigger`, `NextTrigger`, `ViewTrigger`
  - `View` with `day` / `month` / `year` drill-down
  - `Grid`, `Day` (render-prop `DayCellMeta`), `WeekDays`
  - `MonthGrid` / `MonthCell`, `YearGrid` / `YearCell`
  - `useDatePickerContext()` for custom layouts

  **Positioning & popup policy**
  - Floating UI via `Content`: `side`, `align`, `sideOffset`, `avoidCollisions`, `portal`
  - `forceMount` for enter/exit animations (`data-state`)
  - `modal` prop (default `false`) — opt-in focus trap + `aria-modal`; popup-policy friendly
  - Focus restore to trigger / input on close; dialog-interop (`Escape` does not bubble)

  **State & i18n**
  - Reducer-driven state machine (`OPEN`, `SELECT_DATE`, `NAV_PREV`/`NAV_NEXT`, `SET_VIEW`, `COMMIT_INPUT`, …)
  - `Intl`-based locale: week start, month/year labels, segment order & separators
  - `weekStartsOn` override

  **Accessibility & quality**
  - WAI-ARIA: `role="dialog"`, `grid` / `gridcell`, labelled inputs, keyboard roving tabindex
  - Test suite: reducer, calendar grid, date utils, ARIA, keyboard nav, dialog interop, axe (vitest-axe)
  - Storybook: Single, Range, Multiple, Locales

  **Docs**
  - README with quick start, range / multiple examples, full composition, localization, and `Content` props

## 0.3.3

### Patch Changes

- docs: major refresh of README.md and root documentation
  - Update package README to accurately reflect current API (unified `DatePicker.Root` with `mode`, first-class `<DatePicker.Input>`, full composition)
  - Add strong examples for segmented input, range with dual inputs + hover preview, multiple selection, and custom rendering
  - Align with brand voice and recent announcement content
  - Update root README with correct features and examples

## 0.3.2

### Patch Changes

- Updated dependencies [aaa8a57]
  - @kenos-ui/utils@0.0.1

## 0.3.1

### Patch Changes

- Rebrand: publish under `@kenos-ui` org. Replaces interim `@torq-ui/*` naming. No API changes.

## 0.3.0

### Minor Changes

- Axis lift-and-shift: publish DatePicker under `@at5/axis-datepicker`.
  - Add `@at5/axis-datepicker` — same DatePicker API and behavior as `@at5/kairo` (migrated from `packages/kairo` to `packages/datepicker`)
  - Add `@at5/axis` — aggregator re-exporting `DatePicker`
  - `@at5/kairo` — deprecated; thin re-export of `@at5/axis-datepicker` for transition
  - Docs site and playground now depend on `@at5/axis-datepicker`

  **Migration:** replace `@at5/kairo` with `@at5/axis-datepicker` (or `@at5/axis`). No API changes.

## 0.2.1

### Patch Changes

- cad8443: Improve README with full API reference and accurate dependency description

## 0.2.0

### Minor Changes

- fb70ffd: Initial release
