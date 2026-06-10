# @kenos-ui/react-select

## 0.2.3

### Patch Changes

- Updated dependencies [9c9de3d]
- Updated dependencies [f2ea00f]
  - @kenos-ui/utils@1.0.0

## 0.2.2

### Minor Changes

- **Kenos UI Select — feature release** (`@kenos-ui/react-select@0.2.2`)

  Headless, accessible, composable Select primitive for React 19+, fully unstyled.

  **Compound API**

  - Parts: `Root`, `Label`, `Trigger`, `Value`, `Icon`, `Content`, `List`, `Item`, `ItemText`, `ItemIndicator`
  - `Group`, `GroupLabel`, `HiddenSelect`, `Portal`, `Positioner`, `Backdrop`, `ClearTrigger`
  - `ScrollUpButton`, `ScrollDownButton` for long lists

  **Selection & forms**

  - Single and multiple selection (`multiple` on Root)
  - `items` prop for value→label maps without mounting every `Item`
  - `isItemEqualToValue` for custom equality
  - `HiddenSelect` for native form submission (`name`, `required`, `disabled`, `readOnly`)
  - `onValueChange`, `onOpenChange`, `onOpenChangeComplete`

  **Popup policy (interop-first)**

  - Defaults: `modal={false}`, `portal={false}` — safe inside Dialogs
  - Opt-in `modal={true}` with `Backdrop` + focus trap
  - `portal` + `container` on Content; Floating UI positioning (`side`, `align`, `sameWidth`)
  - `lazyMount` / `unmountOnExit`; focus restore on close
  - Escape `stopPropagation` — dismisses Select without closing parent Dialog

  **Keyboard & a11y**

  - List navigation (↑↓, Home, End), typeahead, Enter/Space select
  - Store-based item registry; `role="combobox"` / `role="listbox"` / `role="option"`
  - Test suite: ARIA, keyboard nav, forms, portal, presence, dialog interop, axe

  **Packaging**

  - Add `license: MIT` to `package.json` (fixes npm registry showing "no license")

## 0.2.1

### Patch Changes

- Updated dependencies [aaa8a57]
  - @kenos-ui/utils@0.0.1

## 0.2.0

### Minor Changes

- 03f6e47: Add `@kenos-ui/react-select@0.1.0` — headless single select with interop-first popup defaults (`modal={false}`, `portal={false}`), store-based item registry, forms via `Select.HiddenSelect`, and dialog-interop keyboard behavior.
- Add `@kenos-ui/react-select@0.2.0` Tier 2 — multiple selection, `items` prop for label maps, `portal` + `container` on Content, `Select.ClearTrigger`, `isItemEqualToValue`, `onOpenChangeComplete`, and `Select.Backdrop` when `modal={true}`.

## 0.1.0

### Minor Changes

- Initial release — headless single select with interop-first popup defaults (`modal={false}`, `portal={false}`).
- Store-based item registry with `Select.Item` mount/unmount registration.
- Keyboard navigation (↑↓, Home, End), typeahead, Enter/Space select, Escape dismiss with `stopPropagation`.
- `Select.HiddenSelect` for native form submission; `name`, `required`, `disabled`, `readOnly` on Root.
- `useFloating` positioning (`side`, `align`, `sameWidth`); `lazyMount` / `unmountOnExit` on Content.
- Re-exported from `@kenos-ui/react` as `Select` namespace.
