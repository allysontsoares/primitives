import Link from "next/link";

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
  "React 19",
] as const;

export function DocsHeroCard() {
  return (
    <section className="landing-hero" aria-labelledby="home-hero-title">
      <div className="landing-hero-inner">
        <div className="mb-4 inline-flex items-center gap-2 text-[13px] text-ink2">
          <span
            className="h-[7px] w-[7px] rounded-full bg-[#36c46a] shadow-[0_0_0_3px_color-mix(in_srgb,#36c46a_22%,transparent)]"
            aria-hidden
          />
          v1.0 · Headless date primitives
        </div>
        <h1
          id="home-hero-title"
          className="mb-4 max-w-[14ch] text-[length:var(--text-hero)] font-bold leading-[1.02] tracking-[-0.04em] text-ink text-balance"
        >
          Headless{" "}
          <span className="landing-hero-accent">Date Picker</span>
        </h1>
        <p className="mb-6 max-w-[42ch] text-base leading-relaxed text-ink2 sm:text-[17px]">
          Unstyled, accessible, composable React primitives for calendars, pickers, and segmented
          fields — built for design systems that need locale-aware scheduling without the CSS
          baggage.
        </p>
        <ul className="mb-8 flex flex-wrap gap-2" aria-label="Highlights">
          {HERO_PILLS.map((label) => (
            <li key={label}>
              <span className="inline-flex min-h-8 items-center rounded-full border border-line bg-card px-3 text-[12.5px] font-medium text-ink2">
                {label}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/installation"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[11px] bg-ink px-[18px] text-sm font-semibold text-bg transition-[opacity,transform] duration-200 ease-[var(--ease-smooth)] hover:opacity-90 active:scale-[0.98] motion-reduce:active:scale-100 sm:w-auto"
          >
            Get started <ArrowRight />
          </Link>
          <Link
            href="/quickstart"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[11px] border border-line-strong px-[18px] text-sm font-semibold text-ink transition-colors duration-200 hover:bg-hover sm:w-auto"
          >
            Quick start
          </Link>
        </div>
      </div>
    </section>
  );
}