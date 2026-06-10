import { useDatePickerContext } from "./context";
import { formatDate } from "../utils/locale";

export interface HiddenInputProps {
  name?: string;
}

export function HiddenInput({ name: nameProp }: HiddenInputProps) {
  const { state, config } = useDatePickerContext();
  const name = nameProp ?? config.name;
  if (!name) return null;

  const value =
    config.mode === "single"
      ? state.selectedDate
        ? formatDate(state.selectedDate, config.locale)
        : ""
      : config.mode === "range"
        ? state.rangeStart && state.rangeEnd
          ? `${formatDate(state.rangeStart, config.locale)}/${formatDate(state.rangeEnd, config.locale)}`
          : ""
        : state.selectedDates.map((d) => formatDate(d, config.locale)).join(",");

  return (
    <input
      type="hidden"
      name={name}
      value={value}
      required={config.required}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
