export function HeroCircles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="kenos-hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/15" />
    </div>
  );
}
