export function HeroCircles() {
  return (
    <div
      className="pointer-events-none absolute -right-[8%] -top-[28%] z-0 h-[min(88%,380px)] w-[min(72%,340px)] opacity-90"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-800/80" />
      <div className="absolute inset-[14%] rounded-full border border-zinc-200 dark:border-zinc-800/60" />
      <div className="absolute inset-[28%] rounded-full border border-orange-500/25 bg-orange-500/[0.04]" />
    </div>
  );
}