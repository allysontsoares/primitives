# @kenos-ui/react-combobox

## 0.2.2

### Patch Changes

- Updated dependencies [9c9de3d]
- Updated dependencies [f2ea00f]
  - @kenos-ui/utils@1.0.0

## 0.2.1

### Minor Changes

- **Kenos UI Combobox — feature release** (`@kenos-ui/react-combobox@0.2.1`)

  Headless, accessible, composable Combobox primitive for React 19+, fully unstyled.

  **Compound API**

  - Parts: `Root`, `Label`, `Input`, `Trigger`, `Content`, `List`, `Item`, `ItemText`, `Empty`, `Clear`

  **Filtering & selection**

  - Type-to-filter via `useSelectCollection` from `@kenos-ui/utils`
  - `ComboboxStore`: `open`, `value`, `inputValue`, `highlightedValue`, item registry
  - Keyboard: filter on type, arrow navigation, Enter to select
  - `Empty` state when filtered collection has no matches
  - `Clear` resets value and input text

  **Popup policy**

  - Floating UI positioning on `Content`; `lazyMount` / dialog-interop patterns aligned with Select
  - Re-exported from `@kenos-ui/react` as `Combobox` namespace

  **Packaging**

  - Add `license: MIT` to `package.json` (fixes npm registry showing "no license")

## 0.2.0

### Minor Changes

- aaa8a57: Initial Combobox scaffold (`@kenos-ui/react-combobox@0.1.0`):
  - Parts: Root, Label, Input, Trigger, Content, List, Item, ItemText, Empty, Clear
  - `ComboboxStore` with `open`, `value`, `inputValue`, `highlightedValue`, item registry
  - `useSelectCollection` hook in `@kenos-ui/utils` for type-to-filter
  - Basic keyboard: filter on type, arrow navigation, Enter to select
  - Re-exported from `@kenos-ui/react`

### Patch Changes

- Updated dependencies [aaa8a57]
  - @kenos-ui/utils@0.0.1

## 0.1.0

### Minor Changes

- Initial Combobox scaffold: Root, Label, Input, Trigger, Content, List, Item, ItemText, Empty, Clear
- `ComboboxStore` with `open`, `value`, `inputValue`, `highlightedValue`, and item registry
- Type-to-filter via `@kenos-ui/utils` `useSelectCollection`
- Basic keyboard: filter on type, arrow navigation, Enter to select
