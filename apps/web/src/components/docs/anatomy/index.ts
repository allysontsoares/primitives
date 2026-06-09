import type { FC } from "react";
import { DatePickerAnatomy } from "./date-picker";
import { SelectAnatomy } from "./select";
import { ComboboxAnatomy } from "./combobox";

export const ANATOMY_DIAGRAMS: Record<string, FC> = {
  "date-picker": DatePickerAnatomy,
  select: SelectAnatomy,
  combobox: ComboboxAnatomy,
};
