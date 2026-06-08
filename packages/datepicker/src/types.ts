export type ViewMode = "day" | "month" | "year";

export type SelectionMode = "single" | "range" | "multiple";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DayCellMeta {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isHovered: boolean;
}

export interface MonthItem {
  value: number;
  label: string;
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
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  closeOnSelect?: boolean;
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
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  readOnly: boolean;
  closeOnSelect: boolean;
  /** Opt-in focus trap + aria-modal. Default: false (popup-policy). */
  modal: boolean;
}
