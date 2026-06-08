# @kenos-ui/react-select

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
