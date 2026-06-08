import React from "react";
import { useComboboxContext } from "../context";
import { useComboboxStore } from "../store";
import { useComboboxCollection } from "../collection-context";

export type EmptyProps = React.HTMLAttributes<HTMLDivElement>;

export function Empty({ children = "No results found", ...props }: EmptyProps) {
  const { store } = useComboboxContext();
  const open = useComboboxStore(store, (s) => s.open);
  const { isEmpty } = useComboboxCollection();

  if (!open || !isEmpty) {
    return null;
  }

  return (
    <div role="status" aria-live="polite" data-empty="true" {...props}>
      {children}
    </div>
  );
}