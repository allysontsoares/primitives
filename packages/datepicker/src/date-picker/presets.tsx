import type { ReactNode } from "react";
import { useDatePickerContext } from "./context";

export interface PresetsProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Presets({ children, className, style }: PresetsProps) {
  const { config } = useDatePickerContext();

  return (
    <div
      role="group"
      aria-label={config.messages.presets}
      data-presets=""
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
