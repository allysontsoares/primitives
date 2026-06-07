import { KenosMark } from "./kenos-mark";

export function HeroCircles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="kenos-hero-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-[4%] top-[8%] flex h-[min(72%,320px)] w-[min(58%,280px)] items-center justify-center">
        <div className="kenos-corner-mark text-[var(--kenos-mark)] opacity-90">
          <KenosMark size={200} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}