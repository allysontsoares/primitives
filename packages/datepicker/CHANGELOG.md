# @kenos-ui/react-datepicker

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
