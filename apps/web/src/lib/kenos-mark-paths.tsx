/** Shared KenosMark geometry for favicon / OG ImageResponse assets */

export const KENOS_VOID = "#09090b";
export const KENOS_MARK = "#fafafa";
export const KENOS_MUTED = "#a1a1aa";
export const KENOS_BORDER = "rgba(255, 255, 255, 0.08)";
export const KENOS_GRID = "rgba(255, 255, 255, 0.06)";

export const KENOS_MARK_PATHS = [
  "M4 10V4h6",
  "M14 4h6v6",
  "M20 14v6h-6",
  "M10 20H4v-6",
] as const;

type KenosMarkSvgProps = {
  size: number;
  strokeWidth: number;
  color?: string;
};

export function KenosMarkSvg({
  size,
  strokeWidth,
  color = KENOS_MARK,
}: KenosMarkSvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {KENOS_MARK_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      ))}
    </svg>
  );
}