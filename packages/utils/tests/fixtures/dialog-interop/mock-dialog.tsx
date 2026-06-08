import React, { useEffect, useState, type ReactNode } from "react";

export interface MockDialogProps {
  children: ReactNode;
  label?: string;
  /**
   * When true, a document-level Escape listener closes this mock dialog.
   * Simulates Radix/Ark Dialog — inner popups must stopPropagation to survive.
   */
  closeOnEscape?: boolean;
  onClose?: () => void;
}

/**
 * Lightweight parent Dialog fixture for popup-policy interop tests.
 * Shared by datepicker + select dialog-interop suites.
 */
export function MockDialog({
  children,
  label = "Dialog",
  closeOnEscape = true,
  onClose,
}: MockDialogProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!closeOnEscape) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeOnEscape, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-testid="mock-dialog"
      data-state="open"
    >
      {children}
    </div>
  );
}

/** Inline body slot — popup-policy default composition (portal=false). */
export function MockDialogBody({
  children,
  testId = "dialog-body",
}: {
  children: ReactNode;
  testId?: string;
}) {
  return <div data-testid={testId}>{children}</div>;
}

/** Decoy focus target for Tab-out interop matrix. */
export function MockDialogNextField({ label = "Next field" }: { label?: string }) {
  return (
    <button type="button" data-testid="next-field">
      {label}
    </button>
  );
}