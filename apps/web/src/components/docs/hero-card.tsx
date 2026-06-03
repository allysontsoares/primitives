import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroCircles } from "./hero-circles";

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
  "WAI-ARIA grid",
  "Zero CSS shipped",
  "Intl locales",
  "React 19 compatible",
] as const;

export function DocsHeroCard() {
  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 shadow-lg dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900"
      aria-labelledby="home-hero-title"
    >
      <HeroCircles />
      <div className="relative z-10 p-6 sm:p-9">
        <Badge variant="beta" className="mb-4">
          Beta
        </Badge>
        <h1
          id="home-hero-title"
          className="mb-4 max-w-[14ch] text-[length:var(--text-hero)] font-bold leading-[1.02] tracking-[-0.04em] text-zinc-900 text-balance dark:text-zinc-100"
        >
          Headless{" "}
          <span className="bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
            Date Picker
          </span>
        </h1>
        <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-zinc-500 sm:text-[17px] dark:text-zinc-400">
          Bring your own styles! Kairo is a Unstyled, accessible, composable React primitives for calendars, pickers, and segmented
          fields — built for design systems that need locale-aware scheduling without the CSS
          baggage.
        </p>
        <ul className="mb-8 flex flex-wrap gap-2" aria-label="Highlights">
          {HERO_PILLS.map((label) => (
            <li key={label}>
              <Badge variant="pill">{label}</Badge>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/installation"
            className={cn(buttonVariants({ variant: "brand", size: "lg" }), "w-full sm:w-auto")}
          >
            Get started <ArrowRight />
          </Link>
          <Link
            href="/quickstart"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
          >
            Quick start
          </Link>
        </div>
      </div>
    </section>
  );
}