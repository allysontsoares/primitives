import { createContext, useContext, type CSSProperties } from "react";

export interface PositionerContextValue {
  floatingStyles: CSSProperties;
  isPositioned: boolean;
  setFloating: (node: HTMLElement | null) => void;
  alignItemWithTriggerActive: boolean;
}

export const PositionerContext = createContext<PositionerContextValue | null>(null);

export function usePositionerContext(): PositionerContextValue | null {
  return useContext(PositionerContext);
}
