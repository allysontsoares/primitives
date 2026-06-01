"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { COMPONENTS, API, type DemoKind } from "../../lib/docs-data";
import { CodeBlock } from "./CodeBlock";
import { ActionRow, Anatomy, ApiReference, CopyPage, DemoStage, Example, PageNav } from "./blocks";
import { CalIcon, DateField, InlineCalendar, DatePicker, DateRangePicker, LiveDemo, D } from "../kairo/primitives";

/* ---------------- shared typography ---------------- */
export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="mb-3.5 text-[13px] font-semibold tracking-[0.01em] text-muted">{children}</div>
);
export const PageTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <h1 className="mb-2 text-[length:var(--text-page)] font-bold leading-[1.04] tracking-[-0.035em] text-ink text-balance">
      {children}
    </h1>
    {action}
  </div>
);
export const Lead = ({ children }: { children: ReactNode }) => (
  <p className="mb-5 max-w-[62ch] text-[length:var(--text-fluid-lg,1.125rem)] leading-[1.55] text-ink2">{children}</p>
);
export const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2 id={id} className="mt-14 mb-4 scroll-mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.025em] text-ink">
    {children}
  </h2>
);
export const H3 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h3 id={id} className="mt-9 mb-3 scroll-mt-20 text-[19px] font-[650] tracking-[-0.015em] text-ink">
    {children}
  </h3>
);
const InlineCode = ({ children }: { children: ReactNode }) => (
  <code className="rounded-[5px] bg-accent-soft px-[5px] py-px font-mono text-[0.86em] font-medium text-accent">
    {children}
  </code>
);
const P = ({ children }: { children: ReactNode }) => <p className="mb-4 text-ink2">{children}</p>;

/* ---------------- code samples ---------------- */
const SAMPLE: Record<string, string> = {
  "date-picker": `import { DatePicker, Calendar } from "@at5/kairo";

function Birthday() {
  return (
    <DatePicker.Root locale="en-US" onValueChange={console.log}>
      <DatePicker.Label className="label">Pick a date</DatePicker.Label>
      <DatePicker.Control className="control">
        <DatePicker.Input className="input" />
        <DatePicker.Trigger className="trigger">📅</DatePicker.Trigger>
      </DatePicker.Control>

      <DatePicker.Positioner>
        <DatePicker.Content className="popover">
          <Calendar.Root>
            <Calendar.Header>
              <Calendar.PrevTrigger>‹</Calendar.PrevTrigger>
              <Calendar.Heading />
              <Calendar.NextTrigger>›</Calendar.NextTrigger>
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHead />
              <Calendar.GridBody>
                {(day) => (
                  <Calendar.Cell date={day}>
                    <Calendar.CellTrigger className="day" />
                  </Calendar.Cell>
                )}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar.Root>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </DatePicker.Root>
  );
}`,
  calendar: `import { Calendar } from "@at5/kairo";

<Calendar.Root locale="fr-FR" value={value} onValueChange={setValue}>
  <Calendar.Header>
    <Calendar.PrevTrigger>‹</Calendar.PrevTrigger>
    <Calendar.Heading />
    <Calendar.NextTrigger>›</Calendar.NextTrigger>
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHead />
    <Calendar.GridBody>
      {(day) => (
        <Calendar.Cell date={day}>
          <Calendar.CellTrigger className="day" />
        </Calendar.Cell>
      )}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar.Root>`,
  "date-range-picker": `import { RangePicker, Calendar } from "@at5/kairo";

<RangePicker.Root onValueChange={([from, to]) => save(from, to)}>
  <RangePicker.Label>Trip dates</RangePicker.Label>
  <RangePicker.Control>
    <RangePicker.Input index={0} />
    <RangePicker.Input index={1} />
    <RangePicker.Trigger>📅</RangePicker.Trigger>
  </RangePicker.Control>
  <RangePicker.Positioner>
    <RangePicker.Content>
      <Calendar.Root mode="range">{/* …cells… */}</Calendar.Root>
      <RangePicker.Presets items={presets} />
    </RangePicker.Content>
  </RangePicker.Positioner>
</RangePicker.Root>`,
  "date-field": `import { DateField } from "@at5/kairo";

// Segment order + separators come from the locale automatically.
<DateField.Root locale="en-GB" granularity="day">
  <DateField.Label>Date of birth</DateField.Label>
  <DateField.Control>
    {(segment) =>
      segment.type === "literal"
        ? <DateField.Literal segment={segment} />
        : <DateField.Segment segment={segment} className="seg" />
    }
  </DateField.Control>
</DateField.Root>`,
};

const localeOpts: [string, string][] = [
  ["en-US", "English (US)"],
  ["en-GB", "English (UK)"],
  ["fr-FR", "Français"],
  ["ja-JP", "日本語"],
  ["de-DE", "Deutsch"],
  ["ar-EG", "العربية"],
];

/* ================= COMPONENT PAGE ================= */
export function ComponentPage({ slug }: { slug: string }) {
  const c = COMPONENTS[slug];
  const [locale, setLocale] = useState("en-US");
  if (!c) return null;

  return (
    <>
      <Eyebrow>{c.eyebrow}</Eyebrow>
      <PageTitle action={<CopyPage />}>{c.name}</PageTitle>
      <Lead>{c.desc}</Lead>
      <ActionRow />

      <H2 id="examples">Examples</H2>
      <P>
        You can explore the <InlineCode>{slug}</InlineCode> primitive in the following curated examples. Every demo
        below is fully interactive and keyboard-navigable.
      </P>

      <H3 id="default">Default</H3>
      <Example code={SAMPLE[slug] ?? ""} lang="jsx">
        <DemoStage tall>
          <LiveDemo kind={c.demo as DemoKind} />
        </DemoStage>
      </Example>

      <H3 id="localized">Locale-aware</H3>
      <P>
        Segment order, separators, weekday names and the first day of the week all derive from <InlineCode>Intl</InlineCode>.
        Switch the locale to see the same primitive adapt.
      </P>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {localeOpts.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setLocale(v)}
            className={`min-h-9 rounded-lg border px-3 text-[12.5px] transition-colors ${
              v === locale ? "border-accent text-accent" : "border-line text-ink2 hover:border-line-strong"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <DemoStage tall key={locale}>
        <LiveDemo kind={c.demo as DemoKind} locale={locale} />
      </DemoStage>

      <H2 id="anatomy">Anatomy</H2>
      <P>Import the parts and compose exactly what your design needs. Each part is a separate, unstyled primitive.</P>
      <Anatomy parts={c.parts} />

      <H2 id="api-reference">API Reference</H2>
      <P>The full list of props, data attributes and keyboard interactions lives on the dedicated reference page.</P>
      <Link
        href={`/${slug}/api`}
        className="inline-flex min-h-10 items-center gap-2 rounded-[11px] border border-line-strong px-4 text-sm font-semibold text-ink transition-colors hover:bg-hover"
      >
        Open {c.name} API Reference →
      </Link>

      <PageNav route={slug} />
    </>
  );
}

/* ================= API PAGE ================= */
export function ApiPage({ slug }: { slug: string }) {
  const c = COMPONENTS[slug];
  const groups = API[slug] || [];
  if (!c) return null;
  return (
    <>
      <Eyebrow>API Reference</Eyebrow>
      <PageTitle action={<CopyPage />}>{c.name} API</PageTitle>
      <Lead>
        Props, data attributes and keyboard interactions for every <InlineCode>{c.name}</InlineCode> part.
      </Lead>
      <Link
        href={`/${slug}`}
        className="mb-3 inline-flex min-h-9 items-center rounded-[9px] border border-line-strong px-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hover"
      >
        ← Back to {c.name}
      </Link>

      <ApiReference groups={groups} />

      <Link
        href={`/${slug}`}
        className="mt-7 inline-flex min-h-10 items-center rounded-[11px] border border-line-strong px-4 text-sm font-semibold text-ink transition-colors hover:bg-hover"
      >
        ← Back to {c.name} overview
      </Link>
    </>
  );
}

/* ================= OVERVIEW (home / landing) ================= */
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Overview() {
  const cards = [
    { route: "calendar", title: "Calendar", desc: "Month grid on the WAI-ARIA grid pattern with roving focus.", k: "role", v: "grid" },
    { route: "date-picker", title: "Date Picker", desc: "Input + popover calendar for a single date.", k: "parts", v: "6" },
    { route: "date-range-picker", title: "Date Range Picker", desc: "Start/end selection with live range preview.", k: "mode", v: "range" },
    { route: "date-field", title: "Date Field", desc: "Segmented, locale-aware input — no calendar needed.", k: "role", v: "spinbutton" },
  ];
  const principles = [
    { t: "Unstyled", d: "Kairo renders only semantic HTML. You control every pixel via className and style props — zero CSS ships." },
    { t: "Composable", d: "Each part of the UI is a separate primitive: Label, Input, Trigger, Grid, Day. Compose exactly what you need." },
    { t: "Locale-aware", d: "Segment order, separators, weekday names and month labels all derive from Intl. Pass any BCP 47 tag." },
    { t: "Accessible", d: "ARIA roles, aria-selected, keyboard navigation and focus management are handled for you." },
  ];
  return (
    <>
      {/* hero card */}
      <div className="grid items-center gap-9 rounded-[18px] border border-line bg-card p-6 sm:p-[38px] lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 text-[13px] text-ink2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#36c46a] shadow-[0_0_0_3px_color-mix(in_srgb,#36c46a_22%,transparent)]" />
            v1.0 · React 19
          </div>
          <h1 className="mb-4 text-[length:var(--text-hero)] font-bold leading-[1.02] tracking-[-0.04em] text-ink text-balance">
            Date primitives, <span className="font-normal text-muted">headless.</span>
          </h1>
          <p className="mb-6 max-w-[38ch] text-[16.5px] text-ink2">
            A composable React library for date and scheduling UI. Zero CSS, no styling opinions, built on the WAI-ARIA
            grid pattern.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quickstart"
              className="inline-flex min-h-11 items-center gap-2 rounded-[11px] bg-ink px-[18px] text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              Quick Start <ArrowRight />
            </Link>
            <Link
              href="/date-picker"
              className="inline-flex min-h-11 items-center gap-2 rounded-[11px] border border-line-strong px-[18px] text-sm font-semibold text-ink transition-colors hover:bg-hover"
            >
              Browse primitives
            </Link>
          </div>
        </div>
        <div>
          <CodeBlock
            tabs={[
              { label: "Install", lang: "bash", code: "npm install @at5/kairo" },
              { label: "Usage", lang: "jsx", code: SAMPLE["date-field"] ?? "" },
            ]}
          />
        </div>
      </div>

      {/* primitives */}
      <h2 id="primitives" className="mb-6 mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink">
        Primitives
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.route}
            href={`/${c.route}`}
            className="flex min-h-[168px] flex-col rounded-card border border-line bg-card p-[22px] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-line-strong"
          >
            <div className="mb-1.5 flex items-start justify-between">
              <div className="text-[17px] font-[650] tracking-[-0.01em] text-ink">{c.title}</div>
              <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-line bg-card2 text-ink2">
                <CalIcon />
              </span>
            </div>
            <div className="text-[13.5px] leading-normal text-muted">{c.desc}</div>
            <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-[12.5px]">
              <span className="text-muted">{c.k}</span>
              <span className="font-mono text-xs text-ink">{c.v}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* try it */}
      <h2 id="try-it" className="mb-6 mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink">
        Try it
      </h2>
      <P>
        Headless means you bring the CSS — here&apos;s the Date Picker primitive with a dark skin. Click the field, use
        arrow keys, type a date.
      </P>
      <DemoStage tall>
        <DatePicker label="Pick a date" />
      </DemoStage>

      {/* principles */}
      <h2 id="design-principles" className="mb-6 mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.03em] text-ink">
        Design principles
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {principles.map((p) => (
          <div key={p.t} className="rounded-card border border-line bg-card p-[22px]">
            <div className="mb-2 text-[17px] font-[650] text-ink">{p.t}</div>
            <div className="text-[13.5px] leading-normal text-muted">{p.d}</div>
          </div>
        ))}
      </div>

      <PageNav route="" />
    </>
  );
}

/* re-exports for guide pages */
export { InlineCode, P, DemoStage, CodeBlock, DateField, InlineCalendar, DatePicker, DateRangePicker, D };
