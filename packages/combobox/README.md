# @kenos-ui/react-combobox

Headless, accessible, composable Combobox primitive for React.

## Installation

```bash
pnpm add @kenos-ui/react-combobox
```

## Usage

```tsx
import { Combobox } from '@kenos-ui/react-combobox';

<Combobox.Root onValueChange={setValue}>
  <Combobox.Label>Language</Combobox.Label>
  <Combobox.Input placeholder="Search…" />
  <Combobox.Trigger>▼</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.List>
      <Combobox.Item value="ts">
        <Combobox.ItemText>TypeScript</Combobox.ItemText>
      </Combobox.Item>
      <Combobox.Item value="js">
        <Combobox.ItemText>JavaScript</Combobox.ItemText>
      </Combobox.Item>
    </Combobox.List>
    <Combobox.Empty>No results</Combobox.Empty>
  </Combobox.Content>
  <Combobox.Clear />
</Combobox.Root>
```

## API

| Part | Description |
|------|-------------|
| `Root` | Context + state provider |
| `Label` | Associated `<label>` |
| `Input` | Text input (`role="combobox"`) — type to filter |
| `Trigger` | Button that toggles the listbox |
| `Content` | Listbox container (floating, lazyMount) |
| `List` | `role="listbox"` wrapper |
| `Item` | `role="option"` — registers value/label |
| `ItemText` | Option label slot |
| `Empty` | Shown when the filtered collection is empty |
| `Clear` | Clears value and input text |

## Store

`ComboboxStore` tracks:

- `open` — listbox visibility
- `value` — selected value
- `inputValue` — current input text (filter query)
- `highlightedValue` — keyboard/mouse highlight
- `items` — registry populated by `Combobox.Item`

Filtering uses `useSelectCollection` from `@kenos-ui/utils` (not a dependency on `@kenos-ui/react-select`).

## Popup defaults (interop-first)

- `modal={false}` — no inert/aria-modal on document
- `lazyMount` — content is not in the DOM until first opened
- Escape `stopPropagation` — closes Combobox without closing a parent Dialog

See [popup-policy.md](../../docs/popup-policy.md).