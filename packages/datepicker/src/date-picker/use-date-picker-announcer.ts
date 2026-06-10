import { useEffect, useRef } from "react";
import { useLiveAnnouncer } from "@kenos-ui/utils";
import { formatMonthYear, formatDate } from "../utils/locale";
import type { DatePickerState } from "./reducer";
import type { DatePickerConfig } from "../types";

function isGridFocused(): boolean {
  const role = document.activeElement?.getAttribute("role");
  return role === "gridcell" || role === "grid";
}

export function useDatePickerAnnouncer(
  state: DatePickerState,
  config: DatePickerConfig,
  isOpen: boolean,
) {
  const { announce, liveRegionProps } = useLiveAnnouncer();
  const prevMonthRef = useRef<string | null>(null);
  const prevSelectedRef = useRef<number | null>(null);
  const prevRangeEndRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || state.view !== "day") return;
    const label = formatMonthYear(
      new Date(state.focusedYear, state.focusedMonth, 1),
      config.locale,
    );
    if (prevMonthRef.current === label) return;
    if (isGridFocused()) {
      prevMonthRef.current = label;
      return;
    }
    prevMonthRef.current = label;
    announce(label);
  }, [isOpen, state.view, state.focusedMonth, state.focusedYear, config.locale, announce]);

  useEffect(() => {
    if (!isOpen || config.mode !== "single") return;
    const t = state.selectedDate?.getTime() ?? null;
    if (prevSelectedRef.current === t) return;
    prevSelectedRef.current = t;
    if (!state.selectedDate) return;
    announce(`${config.messages.selectedDate}: ${formatDate(state.selectedDate, config.locale)}`);
  }, [
    isOpen,
    config.mode,
    config.locale,
    config.messages.selectedDate,
    state.selectedDate,
    announce,
  ]);

  useEffect(() => {
    if (!isOpen || config.mode !== "range") return;
    const endT = state.rangeEnd?.getTime() ?? null;
    if (prevRangeEndRef.current === endT) return;
    prevRangeEndRef.current = endT;
    if (!state.rangeStart || !state.rangeEnd) return;
    announce(
      `${formatDate(state.rangeStart, config.locale)} – ${formatDate(state.rangeEnd, config.locale)}`,
    );
  }, [isOpen, config.mode, config.locale, state.rangeStart, state.rangeEnd, announce]);

  return liveRegionProps;
}
