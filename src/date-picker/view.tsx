import React from 'react';
import { useDatePickerContext } from './context';
import { DatePickerViewContext } from './context';
import type { ViewMode } from '../types';

export interface ViewProps {
  view: ViewMode;
  children: React.ReactNode;
}

export function View({ view, children }: ViewProps) {
  const { state } = useDatePickerContext();
  if (state.view !== view) return null;
  return (
    <DatePickerViewContext.Provider value={{ view }}>
      {children}
    </DatePickerViewContext.Provider>
  );
}
