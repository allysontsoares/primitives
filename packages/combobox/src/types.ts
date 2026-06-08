import type { ReactNode, HTMLAttributes } from "react";
import type { SelectCollectionFilterFn } from "@kenos-ui/utils";

// ── Item registry ──────────────────────────────────────────────────────────

export interface ComboboxItemRecord {
  value: string;
  /** Displayed label (from ItemText child). */
  label: string;
  /** Used for filtering. Defaults to label. */
  textValue: string;
  disabled: boolean;
  /** The DOM element for the option — needed for aria-activedescendant. */
  ref: HTMLElement | null;
}

export type ComboboxItemEqualFn = (a: string, b: string) => boolean;

// ── Store state ────────────────────────────────────────────────────────────

export interface ComboboxStoreState {
  open: boolean;
  openSource: "input" | "trigger" | null;
  value: string | null;
  inputValue: string;
  highlightedValue: string | null;
  /** Item registry: populated as Combobox.Item mounts. */
  items: Map<string, ComboboxItemRecord>;
}

// ── Root props ─────────────────────────────────────────────────────────────

export interface ComboboxRootProps {
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Fires when open transitions finish (including presence exit). */
  onOpenChangeComplete?: ((open: boolean) => void) | undefined;
  /** Controlled value. */
  value?: string | null | undefined;
  /** Uncontrolled default value. */
  defaultValue?: string | null | undefined;
  onValueChange?: ((value: string | null) => void) | undefined;
  /** Controlled input text. */
  inputValue?: string | undefined;
  /** Uncontrolled default input text. */
  defaultInputValue?: string | undefined;
  onInputValueChange?: ((inputValue: string) => void) | undefined;
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
   * Static value→label map for display when items are not mounted.
   * Registry labels take precedence when both exist.
   */
  items?: Record<string, string> | undefined;
  /** Custom equality for value matching. Default: strict `===`. */
  isItemEqualToValue?: ComboboxItemEqualFn | undefined;
  /** Custom filter for type-to-filter. Default: case-insensitive substring. */
  filter?: SelectCollectionFilterFn | undefined;
}

// ── Content props ──────────────────────────────────────────────────────────

export interface ComboboxContentProps {
  children?: ReactNode;
  /** Force content to stay in the DOM even when closed. */
  forceMount?: boolean | undefined;
  side?: "top" | "bottom" | "left" | "right" | undefined;
  align?: "start" | "center" | "end" | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
  avoidCollisions?: boolean | undefined;
  collisionPadding?: number | undefined;
  /** Match the input's width. Default: false. */
  sameWidth?: boolean | undefined;
  /** Skip DOM until first open. Default: true. */
  lazyMount?: boolean | undefined;
  /** Remove from DOM when closed. Default: false. */
  unmountOnExit?: boolean | undefined;
  /**
   * Fires when open transitions finish (including presence exit).
   * Prefer `onOpenChangeComplete` on `<Combobox.Root>`; this prop overrides the root callback.
   */
  onOpenChangeComplete?: ((open: boolean) => void) | undefined;
}

// ── Clear props ────────────────────────────────────────────────────────────

export interface ComboboxClearProps extends HTMLAttributes<HTMLSpanElement> {}