import { useDatePickerContext } from "./context";
import { formatDate, formatDateTime } from "../utils/locale";

export interface HiddenInputProps {
  name?: string;
}

export function HiddenInput({ name: nameProp }: HiddenInputProps) {
  const { state, config } = useDatePickerContext();
  const name = nameProp ?? config.name;
  if (!name) return null;

  const formatValue = (date: Date) =>
    config.granularity === "day"
      ? formatDate(date, config.locale)
      : formatDateTime(date, config.locale, config.granularity, config.hourCycle);

  const value =
    config.mode === "single"
      ? state.selectedDate
        ? formatValue(state.selectedDate)
        : ""
      : config.mode === "range"
        ? state.rangeStart && state.rangeEnd
          ? `${formatValue(state.rangeStart)}/${formatValue(state.rangeEnd)}`
          : ""
        : state.selectedDates.map((d) => formatValue(d)).join(",");

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
