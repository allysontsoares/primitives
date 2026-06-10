import React from "react";
import { useDatePickerContext } from "./context";

export type ErrorMessageProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Visible error text for the picker. Renders `errorMessage` from the Root, but only
 * when the Root is `invalid`. It is the single source of truth for the message text.
 *
 * Accessibility is already handled by the Input group, which exposes the same message
 * to assistive tech via `aria-errormessage` → an `sr-only` `role="alert"` element.
 * To avoid a double announcement, this visible element is `aria-hidden`.
 */
export function ErrorMessage(props: ErrorMessageProps) {
  const { config } = useDatePickerContext();
  if (!config.invalid || !config.errorMessage) return null;

  return (
    <div aria-hidden="true" data-date-picker-error {...props}>
      {config.errorMessage}
    </div>
  );
}
