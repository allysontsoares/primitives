"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  D,
  DateField,
  DatePicker,
  DateRangePicker,
  InlineCalendar,
} from "../kairo/primitives";

const CheckIcon = () => (
  <span
    className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent"
    aria-hidden
  >
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </span>
);

function HighlightDemoFrame({ children }: { children: ReactNode }) {
  return (
    <div className="home-highlight-demo flex min-h-[188px] w-full items-center justify-center overflow-hidden p-4 sm:min-h-[200px]">
      <div className="max-w-full min-w-0">{children}</div>
    </div>
  );
}

function HighlightCalendar() {
  return (
    <HighlightDemoFrame>
      <InlineCalendar size="compact" defaultValue={D.today()} />
    </HighlightDemoFrame>
  );
}

function HighlightDatePicker() {
  return (
    <HighlightDemoFrame>
      <DatePicker label="Pick a date" size="compact" />
    </HighlightDemoFrame>
  );
}

function HighlightRangePicker() {
  return (
    <HighlightDemoFrame>
      <DateRangePicker label="Trip dates" presets={false} size="compact" />
    </HighlightDemoFrame>
  );
}

function HighlightDateField() {
  return (
    <HighlightDemoFrame>
      <div className="w-full max-w-[240px]">
        <DateField label="Birth date" />
      </div>
    </HighlightDemoFrame>
  );
}

type Highlight = {
  slug: string;
  title: string;
  desc: string;
  demo: ReactNode;
};

const HIGHLIGHTS: Highlight[] = [
  {
    slug: "calendar",
    title: "Calendar",
    desc: "Month grid on the WAI-ARIA pattern with roving focus, range preview, and keyboard navigation.",
    demo: <HighlightCalendar />,
  },
  {
    slug: "date-picker",
    title: "Date Picker",
    desc: "Composable input, trigger, and popover — you own every className on each part.",
    demo: <HighlightDatePicker />,
  },
  {
    slug: "date-range-picker",
    title: "Date Range Picker",
    desc: "Start and end selection with live in-range styling across the grid.",
    demo: <HighlightRangePicker />,
  },
  {
    slug: "date-field",
    title: "Date Field",
    desc: "Locale-aware segmented input with spinbutton semantics — no popover required.",
    demo: <HighlightDateField />,
  },
];

const QUALITIES = [
  {
    title: "Full keyboard navigation",
    desc: "Move across days with arrow keys, Home/End, and Page Up/Down. Segmented fields support spinbutton keys and typing.",
  },
  {
    title: "WAI-ARIA grid semantics",
    desc: "Calendar cells use role=\"grid\" / gridcell, roving tabindex, and aria-selected — not a pile of unlabeled buttons.",
  },
  {
    title: "Locale-aware by default",
    desc: "Week start, segment order, separators, and labels come from Intl. Pass any BCP 47 tag — no manual format strings.",
  },
  {
    title: "Assistive technology ready",
    desc: "Meaningful labels, aria-expanded on triggers, and spinbutton segments so screen readers announce each part correctly.",
  },
  {
    title: "Range selection built in",
    desc: "Highlight in-range days, merge start/end states, and wire hover preview without inventing selection math yourself.",
  },
  {
    title: "Unstyled and lightweight",
    desc: "Zero CSS ships with the package. Import only the parts you render — no theme runtime or specificity battles.",
  },
  {
    title: "Composable parts",
    desc: "Label, Input, Trigger, Grid, and Cell are separate primitives. Build a picker, a bare calendar, or a field-only flow.",
  },
  {
    title: "Focus management",
    desc: "Popovers move focus into the calendar on open and return it to the trigger on dismiss — override when you need custom behavior.",
  },
] as const;

export function HomeHighlights() {
  return (
    <section className="mt-14 sm:mt-16" aria-labelledby="home-highlights-title">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="landing-eyebrow mb-1">Primitives</p>
          <h2
            id="home-highlights-title"
            className="text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink"
          >
            See what ships in the box
          </h2>
        </div>
        <Link
          href="/calendar"
          className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
        >
          View all docs
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="home-highlights-track -mx-5 px-5 sm:-mx-0 sm:px-0">
        <div className="home-highlights-scroll flex gap-4 pb-2">
          {HIGHLIGHTS.map((h) => (
            <article
              key={h.slug}
              className="home-highlight-card isolate flex w-[min(100%,320px)] shrink-0 flex-col sm:w-[280px]"
            >
              <div className="overflow-hidden rounded-t-card border border-b-0 border-line bg-subtle">
                {h.demo}
              </div>
              <div className="flex flex-1 flex-col rounded-b-card border border-line bg-card p-5">
                <h3 className="mb-1 text-[17px] font-[650] tracking-[-0.01em] text-ink">
                  {h.title}
                </h3>
                <p className="mb-4 flex-1 text-[13.5px] leading-normal text-muted">{h.desc}</p>
                <Link
                  href={`/${h.slug}`}
                  className="text-[13px] font-semibold text-ink transition-colors hover:text-accent"
                >
                  Documentation →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeQualities() {
  return (
    <section className="landing-qualities relative mt-20 overflow-hidden sm:mt-24" aria-labelledby="home-qualities-title">
      <div className="relative z-[1]">
        <p className="landing-eyebrow mb-1">Accessible by default</p>
        <h2
          id="home-qualities-title"
          className="mb-3 max-w-[20ch] text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink text-balance"
        >
          Built for real scheduling UI
        </h2>
        <p className="mb-10 max-w-[52ch] text-[15px] leading-relaxed text-ink2">
          Date components are easy to get wrong. Kairo handles semantics, keyboard support, and
          locale rules so your team can focus on visual design.{" "}
          <Link href="/accessibility" className="font-semibold text-ink underline-offset-2 hover:underline">
            Accessibility guide →
          </Link>
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
          {QUALITIES.map((q) => (
            <li key={q.title} className="flex gap-3">
              <CheckIcon />
              <div className="min-w-0">
                <h3 className="mb-1 text-[15px] font-[650] text-ink">{q.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted">{q.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeWhySection() {
  const items = [
    {
      title: "Ship faster",
      body: "Date UI is deceptively hard — locales, ranges, focus traps, and grid semantics eat weeks. Kairo handles the behavior so your team styles once and moves on.",
    },
    {
      title: "Focus on your product",
      body: "No theme to fight. Primitives expose parts and props; you wire Tailwind, CSS modules, or tokens from your design system without overriding library CSS.",
    },
  ];
  return (
    <section className="mt-20 sm:mt-24" aria-labelledby="home-why-title">
      <p className="landing-eyebrow mb-1">Why Kairo</p>
      <h2
        id="home-why-title"
        className="mb-8 max-w-[22ch] text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink text-balance"
      >
        Spend less time on undifferentiated date logic
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {items.map((item) => (
          <div key={item.title}>
            <h3 className="mb-2 text-[17px] font-[650] text-ink">{item.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink2">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeCtaBand() {
  return (
    <section
      className="landing-cta mt-20 rounded-lg2 border border-line bg-card p-8 sm:mt-24 sm:p-10"
      aria-labelledby="home-cta-title"
    >
      <h2 id="home-cta-title" className="mb-2 text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink">
        Ready to adopt?
      </h2>
      <p className="mb-6 max-w-[48ch] text-[15px] leading-relaxed text-ink2">
        Install from npm, follow the quick start, then browse per-primitive examples and API
        reference.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/installation"
          className="inline-flex min-h-11 items-center justify-center rounded-[11px] bg-ink px-5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          Installation
        </Link>
        <Link
          href="/date-picker"
          className="inline-flex min-h-11 items-center justify-center rounded-[11px] border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-hover"
        >
          Browse primitives
        </Link>
      </div>
    </section>
  );
}