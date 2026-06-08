---
"@kenos-ui/react-combobox": minor
"@kenos-ui/utils": patch
"@kenos-ui/react": patch
---

Initial Combobox scaffold (`@kenos-ui/react-combobox@0.1.0`):

- Parts: Root, Label, Input, Trigger, Content, List, Item, ItemText, Empty, Clear
- `ComboboxStore` with `open`, `value`, `inputValue`, `highlightedValue`, item registry
- `useSelectCollection` hook in `@kenos-ui/utils` for type-to-filter
- Basic keyboard: filter on type, arrow navigation, Enter to select
- Re-exported from `@kenos-ui/react`