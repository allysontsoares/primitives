"use client";

import { useState, type ReactNode } from "react";
import { COMPONENTS, API, type DemoKind } from "../../lib/docs-data";
import { EXAMPLE_SNIPPETS } from "../../lib/example-snippets";
import { CodeBlock } from "./code-block";
import { DocsHeroCard } from "./hero-card";
import { HomeCtaBand, HomeHighlights, HomeQualities, HomeWhySection } from "./home-highlights";
import { ActionRow, Anatomy, ApiReference, CopyPage, DemoStage, Example, PageNav } from "./blocks";
import {
  DateField,
  InlineCalendar,
  DatePicker,
  DateRangePicker,
  LiveDemo,
  ComboboxDialogDemo,
  ComboboxFilterDemo,
  SelectDialogDemo,
  SelectFormDemo,
  SelectMultipleDemo,
  SelectPortalDemo,
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

const DIALOG_INTEROP_SNIPPET = `import { Select } from "@kenos-ui/react-select";

// Inside any Dialog.Content — keep portal={false} (default)
<Dialog.Content>
  <Select.Root name="country">
    <Select.Label>Country</Select.Label>
    <Select.Trigger>
      <Select.Value placeholder="Choose…" />
    </Select.Trigger>
    <Select.Content>
      <Select.List>
        <Select.Item value="pt">Portugal</Select.Item>
        <Select.Item value="br">Brazil</Select.Item>
      </Select.List>
    </Select.Content>
    <Select.HiddenSelect />
  </Select.Root>
</Dialog.Content>`;

const SELECT_FORMS_SNIPPET = `import { Select } from "@kenos-ui/react-select";

<form action="/api/profile" method="post">
  <Select.Root name="framework" required>
    <Select.Trigger>
      <Select.Value placeholder="Framework" />
    </Select.Trigger>
    <Select.Content>
      <Select.List>
        <Select.Item value="react">React</Select.Item>
      </Select.List>
    </Select.Content>
    <Select.HiddenSelect />
  </Select.Root>
  <button type="submit">Save</button>
</form>`;

const SELECT_MULTIPLE_SNIPPET = `import { Select } from "@kenos-ui/react-select";

<Select.Root name="tags" multiple defaultValue={["react"]}>
  <Select.Trigger>
    <Select.Value placeholder="Choose frameworks…" />
  </Select.Trigger>
  <Select.Content>
    <Select.List>
      <Select.Item value="react">React</Select.Item>
      <Select.Item value="vue">Vue</Select.Item>
    </Select.List>
  </Select.Content>
  <Select.HiddenSelect />
</Select.Root>`;

const COMBOBOX_FILTER_SNIPPET = `import { Combobox } from "@kenos-ui/react-combobox";

<Combobox.Root defaultValue="ts">
  <Combobox.Label>Language</Combobox.Label>
  <Combobox.Input placeholder="Search languages…" />
  <Combobox.Trigger>▼</Combobox.Trigger>
  <Combobox.Content>
    <Combobox.List>
      <Combobox.Item value="ts">
        <Combobox.ItemText>TypeScript</Combobox.ItemText>
      </Combobox.Item>
      <Combobox.Item value="js">
        <Combobox.ItemText>JavaScript</Combobox.ItemText>
      </Combobox.Item>
    </Combobox.List>
    <Combobox.Empty>No languages found</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>`;

const COMBOBOX_DIALOG_SNIPPET = `import { Combobox } from "@kenos-ui/react-combobox";

// Inside any Dialog.Content — Content stays inline (no portal)
<Dialog.Content>
  <Combobox.Root defaultValue="js">
    <Combobox.Label>Language</Combobox.Label>
    <Combobox.Input placeholder="Search…" />
    <Combobox.Trigger>▼</Combobox.Trigger>
    <Combobox.Content>
      <Combobox.List>
        <Combobox.Item value="ts">
          <Combobox.ItemText>TypeScript</Combobox.ItemText>
        </Combobox.Item>
      </Combobox.List>
      <Combobox.Empty>No matches</Combobox.Empty>
    </Combobox.Content>
  </Combobox.Root>
</Dialog.Content>`;

const SELECT_PORTAL_SNIPPET = `import { useRef } from "react";
import { Select } from "@kenos-ui/react-select";

const containerRef = useRef<HTMLDivElement>(null);

<Dialog.Content ref={containerRef}>
  <Select.Root name="country">
    <Select.Trigger>
      <Select.Value placeholder="Choose…" />
    </Select.Trigger>
    <Select.Content portal container={containerRef}>
      <Select.List>
        <Select.Item value="pt">Portugal</Select.Item>
      </Select.List>
    </Select.Content>
  </Select.Root>
</Dialog.Content>`;

/* ================= COMPONENT PAGE ================= */
export function ComponentPage({ slug }: { slug: string }) {
  const c = COMPONENTS[slug];
  const [locale, setLocale] = useState("en-US");
  if (!c) return null;

  const features = c.features ?? {};

  return (
    <>
      <PageIntro>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <PageTitle action={<CopyPage />}>{c.name}</PageTitle>
        <Lead>{c.desc}</Lead>
        <ActionRow />
      </PageIntro>

      <H2 id="anatomy">Anatomy</H2>
      <P>
        <InlineCode>{c.name}</InlineCode> is composed of independent parts. Import{" "}
        <InlineCode>{`{ ${c.importName} }`}</InlineCode> from{" "}
        <InlineCode>{c.npmPackage}</InlineCode> (or <InlineCode>@kenos-ui/react</InlineCode>) and
        assemble only the pieces you need.
      </P>
      <Anatomy slug={slug} parts={c.parts} />

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

      {features.localeExamples && (
        <>
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
        </>
      )}

      {features.dialogInterop && slug === "select" && (
        <>
          <H3 id="dialog-interop">Inside a Dialog</H3>
          <P>
            Kenos defaults to <InlineCode>portal=&#123;false&#125;</InlineCode> and{" "}
            <InlineCode>modal=&#123;false&#125;</InlineCode> so the listbox stays in the Dialog
            subtree. Escape closes the Select only (<InlineCode>stopPropagation</InlineCode>) — the
            parent dialog stays open.
          </P>
          <Example code={DIALOG_INTEROP_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <SelectDialogDemo />
            </DemoStage>
          </Example>
        </>
      )}

      {features.filter && slug === "combobox" && (
        <>
          <H3 id="filter">Type to filter</H3>
          <P>
            Typing in <InlineCode>Combobox.Input</InlineCode> filters options by{" "}
            <InlineCode>textValue</InlineCode> (defaults to the item label). Pass a custom{" "}
            <InlineCode>filter</InlineCode> on <InlineCode>Combobox.Root</InlineCode> to change the
            matching logic. <InlineCode>Combobox.Empty</InlineCode> renders when nothing matches.
          </P>
          <Example code={COMBOBOX_FILTER_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <ComboboxFilterDemo />
            </DemoStage>
          </Example>
        </>
      )}

      {features.dialogInterop && slug === "combobox" && (
        <>
          <H3 id="dialog-interop">Inside a Dialog</H3>
          <P>
            Combobox Content is inline by default with <InlineCode>modal=&#123;false&#125;</InlineCode>{" "}
            so the listbox stays in the Dialog subtree. Escape closes the Combobox only (
            <InlineCode>stopPropagation</InlineCode>) — the parent dialog stays open.
          </P>
          <Example code={COMBOBOX_DIALOG_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <ComboboxDialogDemo />
            </DemoStage>
          </Example>
        </>
      )}

      {features.forms && slug === "select" && (
        <>
          <H3 id="forms">Forms</H3>
          <P>
            Add <InlineCode>name</InlineCode> on <InlineCode>Select.Root</InlineCode> and render{" "}
            <InlineCode>Select.HiddenSelect</InlineCode> for native HTML submit and constraint
            validation. Works with React Hook Form and TanStack Form via controlled{" "}
            <InlineCode>value</InlineCode> + <InlineCode>onValueChange</InlineCode>.
          </P>
          <Example code={SELECT_FORMS_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <SelectFormDemo />
            </DemoStage>
          </Example>
        </>
      )}

      {features.multiple && slug === "select" && (
        <>
          <H3 id="multiple">Multiple selection</H3>
          <P>
            Pass <InlineCode>multiple</InlineCode> on <InlineCode>Select.Root</InlineCode> to enable
            multi-select. Items toggle on click and the listbox stays open. Value shape becomes{" "}
            <InlineCode>string[]</InlineCode>.
          </P>
          <Example code={SELECT_MULTIPLE_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <SelectMultipleDemo />
            </DemoStage>
          </Example>
        </>
      )}

      {features.portal && slug === "select" && (
        <>
          <H3 id="portal">Portal &amp; container</H3>
          <P>
            Use <InlineCode>portal=&#123;true&#125;</InlineCode> on{" "}
            <InlineCode>Select.Content</InlineCode> when clipping is an issue. Inside a Dialog,
            pass a <InlineCode>container</InlineCode> ref to keep the listbox in the Dialog subtree
            while escaping <InlineCode>overflow: hidden</InlineCode>.
          </P>
          <Example code={SELECT_PORTAL_SNIPPET} lang="tsx" previewTall>
            <DemoStage tall>
              <SelectPortalDemo />
            </DemoStage>
          </Example>
        </>
      )}

      <H2 id="api-reference">API Reference</H2>
      <P>
        Props, data attributes, and keyboard interactions for <InlineCode>{c.name}</InlineCode>.
        Import from <InlineCode>{c.npmPackage}</InlineCode>; parts use{" "}
        <InlineCode>data-part</InlineCode> and <InlineCode>data-*</InlineCode> attributes for styling.
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
