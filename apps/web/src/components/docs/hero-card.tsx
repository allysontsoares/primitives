import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroCircles } from "./hero-circles";
import { KenosMark } from "./kenos-mark";

const ArrowRight = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const HERO_PILLS = [
  "Unstyled by design",
  "WAI-ARIA compliant",
  "Fully composable",
  "React 19 compatible",
] as const;

export function DocsHeroCard() {
  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-indigo-50/40 via-white to-zinc-100 shadow-lg dark:border-zinc-800 dark:from-indigo-950/30 dark:via-zinc-950 dark:to-zinc-900"
      aria-labelledby="home-hero-title"
    >
      <HeroCircles />
      <div className="relative z-10 p-6 sm:p-9">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(140px,220px)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-14">
          <div className="min-w-0">
            <Badge variant="beta" className="mb-4">
              Beta
            </Badge>
            <p className="mb-3 font-mono text-[13px] font-medium tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
              kenos
            </p>
            <h1
              id="home-hero-title"
              className="mb-4 max-w-[16ch] text-[length:var(--text-hero)] font-bold leading-[1.02] tracking-[-0.04em] text-zinc-900 text-balance dark:text-zinc-100"
            >
              The space before design.
            </h1>
            <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-zinc-500 sm:text-[17px] dark:text-zinc-400">
              Composable, accessible and unstyled React components. Start with structure. Finish
              with style.
            </p>
          </div>

          <div className="hidden items-start justify-center sm:flex lg:justify-end lg:pt-4">
            <div className="kenos-corner-mark shrink-0 text-[var(--kenos-mark)] opacity-90">
              <KenosMark size={200} strokeWidth={3} />
            </div>
          </div>
        </div>

        <ul className="mb-8 flex flex-wrap gap-2" aria-label="Highlights">
          {HERO_PILLS.map((label) => (
            <li key={label}>
              <Badge variant="pill">{label}</Badge>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/docs/installation"
            className={cn(buttonVariants({ variant: "brand", size: "lg" }), "w-full sm:w-auto")}
          >
            Get started <ArrowRight />
          </Link>
          <Link
            href="/docs/date-picker"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            Components
          </Link>
        </div>
      </div>
    </section>
  );
}
