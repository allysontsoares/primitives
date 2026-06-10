export { POPUP_POLICY_DEFAULTS, type PopupPolicyDefaults } from "./popup-policy";

export {
  useFloating,
  type UseFloatingOptions,
  type UseFloatingReturn,
  type FloatingSide,
  type FloatingAlign,
} from "./floating/use-floating";

export {
  usePresence,
  type UsePresenceOptions,
  type UsePresenceReturn,
} from "./presence/use-presence";

export { useClickOutside, type UseClickOutsideOptions } from "./dismiss/use-click-outside";
export { useEscapeKey, type UseEscapeKeyOptions } from "./dismiss/use-escape-key";

export { useFocusTrap } from "./focus/use-focus-trap";
export {
  getFocusableElements,
  type GetFocusableElementsOptions,
} from "./focus/get-focusable-elements";
export { restoreFocus, type RestoreFocusOptions, type OpenSource } from "./focus/restore-focus";
export { focusWithoutScrolling, captureActiveElement } from "./focus/focus-without-scrolling";
export {
  createFocusManager,
  type FocusManager,
  type FocusManagerOptions,
} from "./focus/create-focus-manager";
export { useFocusWithin, type UseFocusWithinOptions } from "./focus/use-focus-within";
export { useRovingTabindex } from "./focus/use-roving-tabindex";

export {
  useListNavigation,
  type UseListNavigationOptions,
  type ListNavigationItem,
} from "./composite/use-list-navigation";

export {
  useTypeahead,
  type UseTypeaheadOptions,
  type TypeaheadItem,
} from "./composite/use-typeahead";

export {
  useSelectCollection,
  type UseSelectCollectionOptions,
  type SelectCollectionItem,
  type SelectCollectionFilterFn,
} from "./composite/use-select-collection";

export {
  useGridNavigation,
  type UseGridNavigationOptions,
  type GridNavigationKey,
} from "./composite/use-grid-navigation";

export {
  useKeyboardShortcuts,
  type UseKeyboardShortcutsOptions,
  type KeyboardShortcutBindings,
} from "./composite/use-keyboard-shortcuts";

export { useDescription } from "./a11y/use-description";
export { useLiveAnnouncer, type LivePoliteness } from "./a11y/use-live-announcer";
