export interface DatePickerMessages {
  calendar: string;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousYears: string;
  nextYears: string;
  switchToMonthView: string;
  switchToYearView: string;
  switchToDayView: string;
  startRangeSelection: string;
  finishRangeSelection: string;
  selectedDate: string;
  presets: string;
  empty: string;
}

export const DEFAULT_MESSAGES: DatePickerMessages = {
  calendar: "Open calendar",
  previousMonth: "Go to previous month",
  nextMonth: "Go to next month",
  previousYear: "Go to previous year",
  nextYear: "Go to next year",
  previousYears: "Go to previous years",
  nextYears: "Go to next years",
  switchToMonthView: "Switch to month view",
  switchToYearView: "Switch to year view",
  switchToDayView: "Switch to day view",
  startRangeSelection: "Start selecting date range",
  finishRangeSelection: "Finish selecting date range",
  selectedDate: "Selected date",
  presets: "Date presets",
  empty: "Empty",
};
