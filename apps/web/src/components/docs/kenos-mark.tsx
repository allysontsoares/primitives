import { KENOS_MARK_PATHS } from "@/lib/kenos-mark-paths";

type KenosMarkProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
};

/** Open-container corner mark — stroke-based for favicon/hero scaling */
export function KenosMark({ className, size = 24, strokeWidth = 2.5 }: KenosMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {KENOS_MARK_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      ))}
    </svg>
  );
}
