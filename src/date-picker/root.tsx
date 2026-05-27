import React from 'react';
import { DatePickerContext } from './context';
import { useDatePicker } from './use-date-picker';
import type { DatePickerRootProps } from '../types';

export type RootProps = DatePickerRootProps & { children: React.ReactNode };

export function Root(props: RootProps) {
  const { children, ...pickerProps } = props;
  const picker = useDatePicker(pickerProps as DatePickerRootProps);

  return (
    <DatePickerContext.Provider
      value={{
        state: picker.state,
        dispatch: picker.dispatch,
        config: picker.config,
        ids: picker.ids,
      }}
    >
      {children}
    </DatePickerContext.Provider>
  );
}
