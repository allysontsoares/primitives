---
"@kenos-ui/utils": major
---

- Extend `useGridNavigation` with `getNextIndex`, `GridNavigationKey` export, and optional Escape handling (`onEscape` may return `false` to defer). `getNextIndex` returning `null` now means the consumer handled navigation (preventDefault + stop).
- Add `packages/utils/docs/popup-policy.md` documenting `POPUP_POLICY_DEFAULTS` and dismiss/focus behavior.
- Add unit tests for `useGridNavigation`.
