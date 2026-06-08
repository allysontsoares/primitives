# @kenos-ui/react

## 0.3.1

### Patch Changes

- aaa8a57: Initial Combobox scaffold (`@kenos-ui/react-combobox@0.1.0`):

  - Parts: Root, Label, Input, Trigger, Content, List, Item, ItemText, Empty, Clear
  - `ComboboxStore` with `open`, `value`, `inputValue`, `highlightedValue`, item registry
  - `useSelectCollection` hook in `@kenos-ui/utils` for type-to-filter
  - Basic keyboard: filter on type, arrow navigation, Enter to select
  - Re-exported from `@kenos-ui/react`

- Updated dependencies [aaa8a57]
  - @kenos-ui/react-combobox@0.2.0
  - @kenos-ui/react-datepicker@0.3.2
  - @kenos-ui/react-select@0.2.1

## 0.3.0

### Minor Changes

- 03f6e47: Add `@kenos-ui/react-select@0.1.0` — headless single select with interop-first popup defaults (`modal={false}`, `portal={false}`), store-based item registry, forms via `Select.HiddenSelect`, and dialog-interop keyboard behavior.
- Add `@kenos-ui/react-select@0.2.0` Tier 2 — multiple selection, `items` prop for label maps, `portal` + `container` on Content, `Select.ClearTrigger`, `isItemEqualToValue`, `onOpenChangeComplete`, and `Select.Backdrop` when `modal={true}`.

### Patch Changes

- Updated dependencies [03f6e47]
- Updated dependencies
  - @kenos-ui/react-select@0.2.0

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
