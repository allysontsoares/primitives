/**
 * Kenos UI popup-policy defaults — docs/popup-policy.md
 *
 * Every anchored primitive (Select.Content, DatePicker.Content, …) should
 * honor these defaults unless documented otherwise.
 */
export const POPUP_POLICY_DEFAULTS = {
  modal: false,
  portal: false,
  lazyMount: true,
  unmountOnExit: false,
  escapeStopPropagation: true,
} as const;

export type PopupPolicyDefaults = typeof POPUP_POLICY_DEFAULTS;