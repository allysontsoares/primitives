"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { COMPONENTS, API, type DemoKind } from "../../lib/docs-data";
import { CodeBlock } from "./CodeBlock";
import { DocsHeroCard } from "./HeroCard";
import { HomeCtaBand, HomeHighlights, HomeQualities, HomeWhySection } from "./HomeHighlights";
import { ActionRow, Anatomy, ApiReference, CopyPage, DemoStage, Example, PageNav } from "./blocks";
import {
  DateField,
  InlineCalendar,
  DatePicker,
  DateRangePicker,
  LiveDemo,
  D,
} from "../kairo/primitives";

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
  <p className="mb-5 max-w-[62ch] text-[length:var(--text-fluid-lg,1.125rem)] leading-[1.55] text-ink2">
    {children}
  </p>
);
export const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2
    id={id}
    className="mt-14 mb-4 scroll-mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.025em] text-ink"
  >
    {children}
  </h2>
);
export const H3 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h3
    id={id}
    className="mt-9 mb-3 scroll-mt-20 text-[19px] font-[650] tracking-[-0.015em] text-ink"
  >
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
        You can explore the <InlineCode>{slug}</InlineCode> primitive in the following curated
        examples. Every demo below is fully interactive and keyboard-navigable.
      </P>

      <H3 id="default">Default</H3>
      <Example code={SAMPLE[slug] ?? ""} lang="jsx">
        <DemoStage tall>
          <LiveDemo kind={c.demo as DemoKind} />
        </DemoStage>
      </Example>

      <H3 id="localized">Locale-aware</H3>
      <P>
        Segment order, separators, weekday names and the first day of the week all derive from{" "}
        <InlineCode>Intl</InlineCode>. Switch the locale to see the same primitive adapt.
      </P>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {localeOpts.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setLocale(v)}
            className={`min-h-9 rounded-lg border px-3 text-[12.5px] transition-colors ${
              v === locale
                ? "border-accent text-accent"
                : "border-line text-ink2 hover:border-line-strong"
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
      <P>
        Import the parts and compose exactly what your design needs. Each part is a separate,
        unstyled primitive.
      </P>
      <Anatomy parts={c.parts} />

      <H2 id="api-reference">API Reference</H2>
      <P>
        The full list of props, data attributes and keyboard interactions lives on the dedicated
        reference page.
      </P>
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
        Props, data attributes and keyboard interactions for every <InlineCode>{c.name}</InlineCode>{" "}
        part.
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
export function Overview() {
  return (
    <>
      <DocsHeroCard />
      <HomeHighlights />
      <HomeWhySection />
      <HomeQualities />
      <HomeCtaBand />
      <PageNav route="" />
    </>
  );
}

/* re-exports for guide pages */
export {
  InlineCode,
  P,
  DemoStage,
  CodeBlock,
  DateField,
  InlineCalendar,
  DatePicker,
  DateRangePicker,
  D,
};
