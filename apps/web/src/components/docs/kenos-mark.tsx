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
      <path d="M4 10V4h6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" />
      <path d="M14 4h6v6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" />
      <path
        d="M20 14v6h-6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
      <path
        d="M10 20H4v-6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
}
