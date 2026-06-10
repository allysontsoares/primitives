# @kenos-ui/utils

## Unreleased

### Minor Changes

- Extend `useGridNavigation` with `getNextIndex`, `GridNavigationKey` export, and optional Escape handling (`onEscape` may return `false` to defer). `getNextIndex` returning `null` now means the consumer handled navigation (preventDefault + stop).
- Add `packages/utils/docs/popup-policy.md` documenting `POPUP_POLICY_DEFAULTS` and dismiss/focus behavior.
- Add unit tests for `useGridNavigation`.

## 0.0.2

### Minor Changes

- **Kenos UI Utils — shared primitives** (`@kenos-ui/utils@0.0.2`)

  Internal hooks and helpers shared across Kenos UI headless components.

  **Floating & presence**
  - `useFloating` — Floating UI positioning (`side`, `align`, offsets, collision)
  - `usePresence` — mount/unmount lifecycle for animated overlays

  **Dismiss & focus**
  - `useClickOutside`, `useEscapeKey` (with `stopPropagation` for dialog interop)
  - `useFocusTrap`, `getFocusableElements`, `restoreFocus` with `OpenSource`

  **Composite / collection**
  - `useListNavigation`, `useTypeahead`
  - `useSelectCollection` — type-to-filter for Combobox (and similar patterns)

  **Popup policy**
  - `POPUP_POLICY_DEFAULTS` — interop-first defaults (`modal={false}`, `portal={false}`)

  **Packaging**
  - Add `license: MIT` to `package.json` (fixes npm registry showing "no license")

## 0.0.1

### Patch Changes

- aaa8a57: Initial Combobox scaffold (`@kenos-ui/react-combobox@0.1.0`):
  - Parts: Root, Label, Input, Trigger, Content, List, Item, ItemText, Empty, Clear
  - `ComboboxStore` with `open`, `value`, `inputValue`, `highlightedValue`, item registry
  - `useSelectCollection` hook in `@kenos-ui/utils` for type-to-filter
  - Basic keyboard: filter on type, arrow navigation, Enter to select
  - Re-exported from `@kenos-ui/react`
