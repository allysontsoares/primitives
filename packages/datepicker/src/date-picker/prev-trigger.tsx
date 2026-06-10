import React from "react";
import { useDatePickerContext } from "./context";

export type PrevTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

export function PrevTrigger({ children, onClick, ...props }: PrevTriggerProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const labels: Record<string, string> = {
    day: config.messages.previousMonth,
    month: config.messages.previousYear,
    year: config.messages.previousYears,
  };

  return (
    <button
      type="button"
      aria-label={labels[state.view]}
      onClick={(e) => {
        dispatch({ type: "NAV_PREV" });
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? "‹"}
    </button>
  );
}
