import React from "react";
import { useDatePickerContext } from "./context";

export type NextTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">;

export function NextTrigger({ children, onClick, ...props }: NextTriggerProps) {
  const { state, dispatch, config } = useDatePickerContext();
  const labels: Record<string, string> = {
    day: config.messages.nextMonth,
    month: config.messages.nextYear,
    year: config.messages.nextYears,
  };

  return (
    <button
      type="button"
      aria-label={labels[state.view]}
      onClick={(e) => {
        dispatch({ type: "NAV_NEXT" });
        onClick?.(e);
      }}
      {...props}
    >
      {children ?? "›"}
    </button>
  );
}
