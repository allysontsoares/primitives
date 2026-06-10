import { useCallback, useMemo } from "react";
import { useDatePickerContext } from "./context";
import { addDays, today } from "../utils/date";

export function useDatePickerActions() {
  const { dispatch, config } = useDatePickerContext();

  const selectDate = useCallback(
    (date: Date) => {
      dispatch({ type: "SELECT_DATE", date });
    },
    [dispatch],
  );

  const selectRange = useCallback(
    (start: Date, end: Date) => {
      dispatch({ type: "SET_RANGE", start, end });
    },
    [dispatch],
  );

  const selectDates = useCallback(
    (dates: Date[]) => {
      dispatch({ type: "SET_SELECTED_DATES", dates });
    },
    [dispatch],
  );

  const selectToday = useCallback(() => {
    selectDate(today());
  }, [selectDate]);

  const selectDaysFromToday = useCallback(
    (days: number) => {
      selectDate(addDays(today(), days));
    },
    [selectDate],
  );

  return useMemo(
    () => ({
      selectDate,
      selectRange,
      selectDates,
      selectToday,
      selectDaysFromToday,
      mode: config.mode,
    }),
    [selectDate, selectRange, selectDates, selectToday, selectDaysFromToday, config.mode],
  );
}
