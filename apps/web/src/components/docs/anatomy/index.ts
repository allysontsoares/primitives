import type { ComponentType } from "react";
import { CalendarAnatomy } from "./calendar";
import { DatePickerAnatomy } from "./date-picker";
import { DateRangePickerAnatomy } from "./date-range-picker";
import { DateFieldAnatomy } from "./date-field";

export const ANATOMY_DIAGRAMS: Record<string, ComponentType> = {
  calendar: CalendarAnatomy,
  "date-picker": DatePickerAnatomy,
  "date-range-picker": DateRangePickerAnatomy,
  "date-field": DateFieldAnatomy,
};