import type { ReactNode } from "react";

export function MockDialog({
  children,
  label = "Dialog",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label={label} data-testid="mock-dialog">
      {children}
    </div>
  );
}