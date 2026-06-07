# @kenos-ui/react

## 0.2.1

### Patch Changes

- Rebrand: publish under `@kenos-ui` org. Replaces interim `@torq-ui/*` naming. No API changes.
- Updated dependencies
  - @kenos-ui/react-datepicker@0.3.1

## 0.2.0

### Minor Changes

- Axis lift-and-shift: publish DatePicker under `@at5/axis-datepicker`.

  - Add `@at5/axis-datepicker` — same DatePicker API and behavior as `@at5/kairo` (migrated from `packages/kairo` to `packages/datepicker`)
  - Add `@at5/axis` — aggregator re-exporting `DatePicker`
  - `@at5/kairo` — deprecated; thin re-export of `@at5/axis-datepicker` for transition
  - Docs site and playground now depend on `@at5/axis-datepicker`

  **Migration:** replace `@at5/kairo` with `@at5/axis-datepicker` (or `@at5/axis`). No API changes.

### Patch Changes

- Updated dependencies
  - @at5/axis-datepicker@0.3.0

## 0.1.0

### Minor Changes

- Initial aggregator release — re-exports `@at5/axis-datepicker`
