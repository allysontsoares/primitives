import type { ReactNode } from "react";

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

// ── Store state ────────────────────────────────────────────────────────────

export interface SelectStoreState {
  open: boolean;
  openSource: "trigger" | null;
  value: string | null;
  highlightedValue: string | null;
  /** Item registry: populated as Select.Item mounts. */
  items: Map<string, SelectItemRecord>;
}

// ── Root props ─────────────────────────────────────────────────────────────

export interface SelectRootProps {
  children: ReactNode;
  /** Controlled value. */
  value?: string | null | undefined;
  /** Uncontrolled default value. */
  defaultValue?: string | null | undefined;
  onValueChange?: ((value: string | null) => void) | undefined;
  /** Controlled open state. */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
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
  /** Match the trigger's width. Default: false. */
  sameWidth?: boolean | undefined;
}
