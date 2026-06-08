import type {
  ReactNode,
  RefObject,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from "react";

// ── Item registry ──────────────────────────────────────────────────────────

export interface SelectItemRecord {
  value: string;
  /** Displayed label (from ItemText child). */
  label: string;
  /** Used by typeahead. Defaults to label. */
  textValue: string;
  disabled: boolean;
  /** The DOM element for the option — needed for aria-activedescendant. */
  ref: HTMLElement | null;
  groupId: string | null;
}

export type SelectItemEqualFn = (a: string, b: string) => boolean;

// ── Store state ────────────────────────────────────────────────────────────

export interface SelectStoreState {
  open: boolean;
  openSource: "trigger" | null;
  value: string | string[] | null;
  highlightedValue: string | null;
  /** Item registry: populated as Select.Item mounts. */
  items: Map<string, SelectItemRecord>;
}

// ── Root props ─────────────────────────────────────────────────────────────

interface SelectRootPropsBase {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Fires when open transitions finish (including presence exit). */
  onOpenChangeComplete?: ((open: boolean) => void) | undefined;
  /** Native <select> name for form submission. */
  name?: string | undefined;
  disabled?: boolean | undefined;
  required?: boolean | undefined;
  readOnly?: boolean | undefined;
  /**
   * When true, a focus trap + aria-modal is applied.
   * **Default: false** (interop-first per popup-policy).
   */
  modal?: boolean | undefined;
  /** Unique id prefix (auto-generated when omitted). */
  id?: string | undefined;
  /**
   * Static value→label map for Value/HiddenSelect when items are not mounted.
   * Registry labels take precedence when both exist.
   */
  items?: Record<string, string> | undefined;
  /** Custom equality for value matching. Default: strict `===`. */
  isItemEqualToValue?: SelectItemEqualFn | undefined;
  /**
   * When true, focusing the trigger opens the listbox.
   * **Default: false**
   */
  openOnFocus?: boolean | undefined;
}

export interface SelectRootPropsSingle extends SelectRootPropsBase {
  multiple?: false | undefined;
  /** Controlled value. */
  value?: string | null | undefined;
  /** Uncontrolled default value. */
  defaultValue?: string | null | undefined;
  onValueChange?: ((value: string | null) => void) | undefined;
}

export interface SelectRootPropsMultiple extends SelectRootPropsBase {
  multiple: true;
  /** Controlled value. */
  value?: string[] | undefined;
  /** Uncontrolled default value. */
  defaultValue?: string[] | undefined;
  onValueChange?: ((value: string[]) => void) | undefined;
}

export type SelectRootProps = SelectRootPropsSingle | SelectRootPropsMultiple;

// ── Portal container ───────────────────────────────────────────────────────

export type SelectPortalContainer =
  | HTMLElement
  | RefObject<HTMLElement | null>
  | null;

// ── Portal props ─────────────────────────────────────────────────────────────

export interface SelectPortalProps {
  children?: ReactNode;
  /** Portal mount target. Defaults to `document.body`. */
  container?: SelectPortalContainer | undefined;
}

// ── Positioner props ───────────────────────────────────────────────────────

export interface SelectPositionerProps {
  children?: ReactNode;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  align?: "start" | "center" | "end" | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  /** Match the trigger's width. Default: false. */
  sameWidth?: boolean | undefined;
  /**
   * When true, positions content to cover the trigger.
   * For `side="bottom"`, aligns the top of content with the top of the trigger.
   * **Default: false**
   */
  alignItemWithTrigger?: boolean | undefined;
}

// ── Backdrop props ─────────────────────────────────────────────────────────

export interface SelectBackdropProps extends HTMLAttributes<HTMLDivElement> {}

// ── ClearTrigger props ─────────────────────────────────────────────────────

export interface SelectClearTriggerProps extends HTMLAttributes<HTMLSpanElement> {}

// ── Scroll button props ──────────────────────────────────────────────────────

export interface SelectScrollButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "up" | "down";
  /**
   * Keep the button in the DOM when the list is not scrollable in this direction.
   * **Default: false**
   */
  keepMounted?: boolean | undefined;
}

export type SelectScrollUpButtonProps = Omit<SelectScrollButtonProps, "direction">;
export type SelectScrollDownButtonProps = Omit<SelectScrollButtonProps, "direction">;

// ── scrollToIndex ────────────────────────────────────────────────────────────

export type ScrollToIndexAlign = "auto" | "start" | "end" | "center" | "nearest";

export interface ScrollToIndexOptions {
  align?: ScrollToIndexAlign | undefined;
}

// ── Content props ──────────────────────────────────────────────────────────

export interface SelectContentProps {
  children?: ReactNode;
  /** Force content to stay in the DOM even when closed. */
  forceMount?: boolean | undefined;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  align?: "start" | "center" | "end" | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  /**
   * When true, the content renders in a portal appended to document.body.
   * **Default: false** (interop-first per popup-policy).
   */
  portal?: boolean | undefined;
  /**
   * Portal mount target when `portal` is true.
   * Defaults to `document.body`. Ignored when nested inside `<Select.Portal>`.
   */
  container?: SelectPortalContainer | undefined;
  /** Match the trigger's width. Default: false. */
  sameWidth?: boolean | undefined;
  /**
   * When true, positions content to cover the trigger.
   * For `side="bottom"`, aligns the top of content with the top of the trigger.
   * **Default: false**
   */
  alignItemWithTrigger?: boolean | undefined;
  /** Skip DOM until first open. Default: true. */
  lazyMount?: boolean | undefined;
  /** Remove from DOM when closed. Default: false. */
  unmountOnExit?: boolean | undefined;
  /**
   * Fires when open transitions finish (including presence exit).
   * Prefer `onOpenChangeComplete` on `<Select.Root>`; this prop overrides the root callback.
   */
  onOpenChangeComplete?: ((open: boolean) => void) | undefined;
}