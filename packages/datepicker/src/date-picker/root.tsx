import React, { useCallback, useMemo, useState } from "react";
import { DatePickerContext } from "./context";
import { useDatePicker } from "./use-date-picker";
import type { DatePickerRootProps } from "../types";

export type RootProps = DatePickerRootProps & { children: React.ReactNode };

export function Root(props: RootProps) {
  const { children, onFocusWithin, onBlurWithin, onFocusChange, ...pickerProps } = props;
  const picker = useDatePicker(pickerProps as DatePickerRootProps);
  const [focusWithin, setFocusWithin] = useState(false);

  const onFocus = useCallback(
    (event: React.FocusEvent) => {
      setFocusWithin((prev) => {
        if (!prev) {
          onFocusWithin?.(event);
          onFocusChange?.(true);
        }
        return true;
      });
    },
    [onFocusWithin, onFocusChange],
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      const related = event.relatedTarget as Node | null;
      const content = document.getElementById(picker.ids.content);
      if (content && related && content.contains(related)) return;
      if (event.currentTarget.contains(related)) return;

      setFocusWithin((prev) => {
        if (prev) {
          onBlurWithin?.(event);
          onFocusChange?.(false);
        }
        return false;
      });
    },
    [onBlurWithin, onFocusChange, picker.ids.content],
  );

  const contextValue = useMemo(
    () => ({
      state: picker.state,
      dispatch: picker.dispatch,
      config: picker.config,
      ids: picker.ids,
    }),
    [picker.state, picker.dispatch, picker.config, picker.ids],
  );

  const isOpen = picker.state.open;

  return (
    <DatePickerContext.Provider value={contextValue}>
      <div
        id={picker.ids.root}
        dir={picker.config.dir}
        data-open={isOpen || undefined}
        data-invalid={picker.config.invalid || undefined}
        data-focus-within={focusWithin || undefined}
        data-readonly={picker.config.readOnly || undefined}
        data-disabled={picker.config.disabled === true || undefined}
        data-required={picker.config.required || undefined}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {children}
      </div>
    </DatePickerContext.Provider>
  );
}
