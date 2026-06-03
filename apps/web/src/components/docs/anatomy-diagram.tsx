import type { ReactNode } from "react";
import "./anatomy/anatomy-theme.css";

export function AnatomyDiagram({ children }: { children: ReactNode }) {
  return (
    <div className="anatomy-diagram my-[18px] overflow-hidden rounded-xl">{children}</div>
  );
}

type LabelProps = { x: number; y: number; children: ReactNode };

export function AnatomyLabel({ x, y, children }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill="var(--anatomy-label)"
      fontSize={13}
      fontWeight={600}
      fontFamily="var(--font-mono)"
    >
      {children}
    </text>
  );
}

export function AnatomyLeader({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="var(--anatomy-leader)"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}