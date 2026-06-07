# @at5/kairo

## 0.2.4

### Patch Changes

- Deprecate `@at5/kairo`: re-export `@kenos-ui/react-datepicker` with updated README and migration guide from `@torq-ui/*`, `@at5/axis-*`, and `@at5/kairo`.
- Updated dependencies
  - @kenos-ui/react-datepicker@0.3.1

## 0.2.2

### Patch Changes

- Axis lift-and-shift: publish DatePicker under `@at5/axis-datepicker`.

  - Add `@at5/axis-datepicker` — same DatePicker API and behavior as `@at5/kairo` (migrated from `packages/kairo` to `packages/datepicker`)
  - Add `@at5/axis` — aggregator re-exporting `DatePicker`
  - `@at5/kairo` — deprecated; thin re-export of `@at5/axis-datepicker` for transition
  - Docs site and playground now depend on `@at5/axis-datepicker`

  **Migration:** replace `@at5/kairo` with `@at5/axis-datepicker` (or `@at5/axis`). No API changes.

- Updated dependencies
  - @at5/axis-datepicker@0.3.0

## 0.2.1

### Patch Changes

- cad8443: Improve README with full API reference and accurate dependency description

## 0.2.0

### Minor Changes

- fb70ffd: Initial release
