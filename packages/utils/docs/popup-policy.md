# Popup policy

Defaults for anchored primitives (`Select.Content`, `DatePicker.Content`, `Combobox.Content`, …).

Defined in code as `POPUP_POLICY_DEFAULTS` in `packages/utils/src/popup-policy.ts`.

## Defaults

| Prop                    | Default | Rationale                                                                                           |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `modal`                 | `false` | Popups do not trap focus unless opted in. Keeps native dialog interop predictable.                  |
| `portal`                | `false` | Render inline by default; opt into `portal` when stacking context or overflow clipping requires it. |
| `lazyMount`             | `true`  | Avoid mounting popover DOM until first open (when supported by the primitive).                      |
| `unmountOnExit`         | `false` | Keep content mounted after close for exit animations (`forceMount` overrides).                      |
| `escapeStopPropagation` | `true`  | Escape handlers on the popup stop propagation so parent dialogs do not close accidentally.          |

## Modal opt-in

Set `modal={true}` on `Content` to enable:

- `aria-modal="true"` on the dialog surface
- Focus trap via `useFocusTrap`

Use for flows that must hold focus until dismissed. Avoid modal popups inside other modal dialogs unless intentional.

## Escape propagation

1. **Grid / nested scopes** — Range day grid cancels a pending anchor with Escape before the content handler closes the popover.
2. **Content** — `useEscapeKey` with `scopeRef` only runs when focus is inside the popover.
3. **Capture phase** — Document-level Escape uses capture; child handlers must call `stopPropagation` when they handle Escape without closing (e.g. cancel range anchor).

## Click outside

`useClickOutside` listens to `pointerdown` and `click`, ignores non-primary buttons (`button > 0`), and uses `composedPath()` for portal/shadow DOM targets.

## Focus restore

On close, `restoreFocus` returns focus to:

- The trigger when opened via trigger
- The input group when opened via segmented input
- `previousActiveElement` captured on open when the source is unknown

## References

- `packages/utils/src/popup-policy.ts`
- `packages/utils/src/dismiss/use-escape-key.ts`
- `packages/utils/src/dismiss/use-click-outside.ts`
- `packages/utils/src/focus/restore-focus.ts`
