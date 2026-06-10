import type { FocusEvent } from "react";
import type { DatePickerMessages } from "./utils/messages";

export type ViewMode = "day" | "month" | "year";

export type SelectionMode = "single" | "range" | "multiple";

export type TextDirection = "ltr" | "rtl";

export type DateGranularity = "day" | "hour" | "minute" | "second";

export type PageBehavior = "visible" | "single";

export type HourCycle = 12 | 24;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CloseOnSelectConfig {
  single?: boolean;
  range?: boolean | "start" | "end" | "both";
  multiple?: boolean;
}

export interface DayCellMeta {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isUnavailable: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
}

export interface MonthItem {
  value: number;
  /** Full localized month name (e.g. "January"). Useful for `title`/labels. */
  label: string;
  /** Abbreviated localized month name (e.g. "Jan"). Used by the Calendar shorthand. */
  shortLabel: string;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface YearItem {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface WeekDayItem {
  label: string;
  ariaLabel: string;
}

export interface DatePickerSharedProps {
  locale?: string;
  dir?: TextDirection;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  unavailable?: (date: Date) => boolean;
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onFocusWithin?: (event: FocusEvent) => void;
  onBlurWithin?: (event: FocusEvent) => void;
  onFocusChange?: (focused: boolean) => void;
  modal?: boolean;
  closeOnSelect?: boolean | CloseOnSelectConfig;
  placeholderDate?: Date;
  granularity?: DateGranularity;
  hourCycle?: HourCycle;
  pageBehavior?: PageBehavior;
  messages?: Partial<DatePickerMessages>;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
}

export interface DatePickerSingleProps extends DatePickerSharedProps {
  mode?: "single";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
}

export interface DatePickerRangeProps extends DatePickerSharedProps {
  mode: "range";
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  allowsNonContiguousRanges?: boolean;
}

export interface DatePickerMultipleProps extends DatePickerSharedProps {
  mode: "multiple";
  value?: Date[];
  defaultValue?: Date[];
  onValueChange?: (dates: Date[]) => void;
}

export type DatePickerRootProps =
  | DatePickerSingleProps
  | DatePickerRangeProps
  | DatePickerMultipleProps;

export interface DatePickerConfig {
  mode: SelectionMode;
  locale: string;
  dir: TextDirection;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  unavailable?: (date: Date) => boolean;
  readOnly: boolean;
  closeOnSelect: boolean | CloseOnSelectConfig;
  placeholderDate?: Date;
  granularity: DateGranularity;
  hourCycle: HourCycle;
  pageBehavior: PageBehavior;
  allowsNonContiguousRanges: boolean;
  messages: DatePickerMessages;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  modal: boolean;
}
