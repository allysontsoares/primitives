"use client";

import { useState, type ReactNode } from "react";
import { COMPONENTS, API, type DemoKind } from "../../lib/docs-data";
import { EXAMPLE_SNIPPETS } from "../../lib/example-snippets";
import { CodeBlock } from "./code-block";
import { DocsHeroCard } from "./hero-card";
import { HomeCtaBand, HomeHighlights, HomeQualities, HomeWhySection } from "./home-highlights";
import { ActionRow, ApiReference, CopyPage, DemoStage, Example, PageNav } from "./blocks";
import {
  DateField,
  InlineCalendar,
  DatePicker,
  DateRangePicker,
  LiveDemo,
} from "./demos";

/* ---------------- shared typography ---------------- */
export const PageIntro = ({ children }: { children: ReactNode }) => (
  <header className="relative isolate mb-6 overflow-hidden border-b border-zinc-200 pb-7 dark:border-zinc-800">
    <div
      className="pointer-events-none absolute -top-[55%] -right-[12%] h-[165%] w-[min(72%,520px)] opacity-80 [mask-image:linear-gradient(to_left,#000_0%,#000_42%,transparent_88%)] dark:opacity-95"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_100%_0%,transparent_0,transparent_66px,rgb(228_228_231/0.45)_67px,transparent_68px)] dark:bg-[repeating-radial-gradient(circle_at_100%_0%,transparent_0,transparent_66px,rgb(39_39_42/0.55)_67px,transparent_68px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_100%_0%,rgb(24_24_27/0.06),transparent_58%)] dark:bg-[radial-gradient(ellipse_95%_85%_at_100%_0%,rgb(244_244_245/0.07),transparent_58%)]" />
    </div>
    <div className="relative z-1">{children}</div>
  </header>
);
export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="mb-3.5 text-[13px] font-semibold tracking-[0.01em] text-zinc-500 dark:text-zinc-400">{children}</div>
);
export const PageTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <h1 className="mb-2 text-[length:var(--text-page)] font-bold leading-[1.04] tracking-[-0.035em] text-zinc-900 dark:text-zinc-100 text-balance">
      {children}
    </h1>
    {action}
  </div>
);
export const Lead = ({ children }: { children: ReactNode }) => (
  <p className="mb-5 max-w-[62ch] text-[length:var(--text-fluid-lg,1.125rem)] leading-[1.55] text-zinc-500 dark:text-zinc-400">
    {children}
  </p>
);
export const H2 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h2
    id={id}
    className="mt-14 mb-4 scroll-mt-20 text-[length:var(--text-section)] font-bold tracking-[-0.025em] text-zinc-900 dark:text-zinc-100"
  >
    {children}
  </h2>
);
export const H3 = ({ id, children }: { id: string; children: ReactNode }) => (
  <h3
    id={id}
    className="mt-9 mb-3 scroll-mt-20 text-[19px] font-[650] tracking-[-0.015em] text-zinc-900 dark:text-zinc-100"
  >
    {children}
  </h3>
);
const InlineCode = ({ children }: { children: ReactNode }) => (
  <code className="rounded-md bg-zinc-500/10 px-1.5 py-0.5 font-mono text-[0.86em] font-medium text-zinc-800 dark:text-zinc-200 dark:bg-zinc-500/15 dark:text-zinc-200">
    {children}
  </code>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-zinc-600 dark:text-zinc-300">{children}</p>
);

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
      <PageIntro>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <PageTitle action={<CopyPage />}>{c.name}</PageTitle>
        <Lead>{c.desc}</Lead>
        <ActionRow />
      </PageIntro>

      <H2 id="examples">Examples</H2>
      <P>
        You can explore the <InlineCode>{slug}</InlineCode> primitive in the following curated
        examples. Every demo below is fully interactive and keyboard-navigable.
      </P>

      <H3 id="default">Default</H3>
      {EXAMPLE_SNIPPETS[slug] ? (
        <Example snippets={EXAMPLE_SNIPPETS[slug]} previewTall>
          <LiveDemo kind={c.demo as DemoKind} />
        </Example>
      ) : (
        <Example previewTall>
          <DemoStage tall>
            <LiveDemo kind={c.demo as DemoKind} />
          </DemoStage>
        </Example>
      )}

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
                ? "border-zinc-400 text-zinc-500"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <DemoStage tall key={locale}>
        <LiveDemo kind={c.demo as DemoKind} locale={locale} />
      </DemoStage>

      <H2 id="api-reference">API Reference</H2>
      <P>
        Props, data attributes, and keyboard interactions for <InlineCode>{c.name}</InlineCode>. Import from{" "}
        <InlineCode>@kenos-ui/react-datepicker</InlineCode>; parts use <InlineCode>data-part</InlineCode> and{" "}
        <InlineCode>data-*</InlineCode> attributes for styling.
      </P>
      <ApiReference groups={API[slug] || []} />

      <PageNav route={slug} />
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
};
