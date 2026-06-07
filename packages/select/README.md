# @kenos-ui/react-select

Headless, accessible, composable Select primitive for React.

## Installation

```bash
pnpm add @kenos-ui/react-select
```

## Usage

```tsx
import { Select } from '@kenos-ui/react-select';

<Select.Root name="framework" onValueChange={setValue}>
  <Select.Label>Framework</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Choose..." />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content>
    <Select.List>
      <Select.Item value="react">
        <Select.ItemText>React</Select.ItemText>
        <Select.ItemIndicator>✓</Select.ItemIndicator>
      </Select.Item>
      <Select.Item value="vue">
        <Select.ItemText>Vue</Select.ItemText>
        <Select.ItemIndicator>✓</Select.ItemIndicator>
      </Select.Item>
    </Select.List>
  </Select.Content>
  <Select.HiddenSelect />
</Select.Root>
```

## API

| Part | Description |
|------|-------------|
| `Root` | Context + state provider |
| `Label` | Associated `<label>` |
| `Trigger` | Button that opens the listbox |
| `Value` | Displays the selected label or placeholder |
| `Icon` | Chevron slot |
| `Content` | Listbox container (floating, lazyMount) |
| `List` | `role="listbox"` wrapper |
| `Item` | `role="option"` — registers value/label |
| `ItemText` | Option label slot |
| `ItemIndicator` | Shown when the option is selected |
| `Group` | Groups options (`role="group"`) |
| `GroupLabel` | Label for a group |
| `HiddenSelect` | Native `<select>` for form submission |

## Popup defaults (interop-first)

- `modal={false}` — no inert/aria-modal on document
- `portal={false}` — listbox renders inline (safe inside any Dialog)
- `lazyMount` — content is not in the DOM until first opened
- Escape `stopPropagation` — closes Select without closing a parent Dialog

See [popup-policy.md](../../docs/popup-policy.md).
