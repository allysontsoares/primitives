---
"@kenos-ui/react-datepicker": minor
---

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
