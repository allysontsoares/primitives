"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./code-block";
import { DocsProse, docsTableClass } from "./docs-prose";
import { Eyebrow, PageIntro, PageTitle, Lead, H2, InlineCode, P } from "./pages";
import { DemoStage } from "./blocks";
import { DatePicker } from "./demos";

const Callout = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="my-5 flex gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 px-[18px] py-4 text-sm text-zinc-500 dark:text-zinc-400">
    <span className="mt-px shrink-0 text-zinc-500 dark:text-zinc-400">{icon ?? "→"}</span>
    <div>{children}</div>
  </div>
);
const InfoIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
);

export function Installation() {
  return (
    <>
      <PageIntro>
        <Eyebrow>Get Started</Eyebrow>
        <PageTitle>Installation</PageTitle>
        <Lead>
          Kenos UI ships headless primitives with no runtime dependencies. React 19 and React DOM 19
          are peer dependencies.
        </Lead>
      </PageIntro>
      <H2 id="install">Install a package</H2>
      <P>
        Install per primitive, or use the aggregator <InlineCode>@kenos-ui/react</InlineCode> for
        multiple primitives in one dependency.
      </P>
      <CodeBlock
        tabs={[
          {
            label: "DatePicker",
            lang: "bash",
            code: "pnpm add @kenos-ui/react-datepicker",
          },
          {
            label: "Select",
            lang: "bash",
            code: "pnpm add @kenos-ui/react-select",
          },
          {
            label: "Combobox",
            lang: "bash",
            code: "pnpm add @kenos-ui/react-combobox",
          },
          {
            label: "Aggregator",
            lang: "bash",
            code: "pnpm add @kenos-ui/react",
          },
        ]}
      />
      <Callout icon={<InfoIcon />}>
        Kenos has{" "}
        <strong className="font-semibold text-zinc-900 dark:text-zinc-100">zero CSS</strong>.
        Nothing renders styled out of the box — you attach classes to each part. See the{" "}
        <Link
          href="/docs/date-picker#default"
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-indigo-600 hover:decoration-accent dark:hover:text-indigo-400"
        >
          Date Picker examples
        </Link>
        .
      </Callout>
      <H2 id="peers">Peer dependencies</H2>
      <table className={docsTableClass}>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>react</td>
            <td>≥ 19.0.0</td>
          </tr>
          <tr>
            <td>react-dom</td>
            <td>≥ 19.0.0</td>
          </tr>
        </tbody>
      </table>
      <H2 id="import">Import primitives</H2>
      <CodeBlock
        lang="jsx"
        code={`import { DatePicker } from "@kenos-ui/react-datepicker";\nimport { Select } from "@kenos-ui/react-select";\nimport { Combobox } from "@kenos-ui/react-combobox";\n// or: import { DatePicker, Select, Combobox } from "@kenos-ui/react";\n\n// <DatePicker.Root> ... <DatePicker.Calendar />\n// <Select.Root name="x"> ... <Select.HiddenSelect />\n// <Combobox.Root> ... <Combobox.Input /> ... <Combobox.Empty />`}
      />
    </>
  );
}

export function QuickStart() {
  return (
    <>
      <PageIntro>
        <Eyebrow>Get Started</Eyebrow>
        <PageTitle>Quick Start</PageTitle>
        <Lead>Build an accessible, fully-styled date picker in a couple of minutes.</Lead>
      </PageIntro>
      <H2 id="compose">1. Compose the parts</H2>
      <P>
        Every primitive is a set of composable parts. Render only what you need and attach your own
        classes.
      </P>
      <CodeBlock
        lang="jsx"
        code={`import { DatePicker } from "@kenos-ui/react-datepicker";\nimport "./date-picker.css";\n\nexport function MyDatePicker() {\n  return (\n    <DatePicker.Root onValueChange={(d) => console.log(d)}>\n      <DatePicker.Label className="label">Pick a date</DatePicker.Label>\n      <div className="control">\n        <DatePicker.Input className="input" />\n        <DatePicker.Trigger className="trigger">📅</DatePicker.Trigger>\n      </div>\n      <DatePicker.Content className="popover">\n        <DatePicker.Calendar />\n      </DatePicker.Content>\n    </DatePicker.Root>\n  );\n}`}
      />
      <H2 id="style">2. Bring your CSS</H2>
      <P>
        Style parts directly, or target the <InlineCode>[data-*]</InlineCode> attributes Kenos sets
        for state (<InlineCode>[data-selected]</InlineCode>, <InlineCode>[data-today]</InlineCode>,{" "}
        <InlineCode>[data-disabled]</InlineCode>).
      </P>
      <CodeBlock
        lang="css"
        code={`.day[data-selected] { background: var(--accent); color: #fff; }\n.day[data-today]    { font-weight: 700; }\n.day[data-disabled] { opacity: .4; pointer-events: none; }`}
      />
      <H2 id="result">3. Result</H2>
      <DemoStage tall>
        <DatePicker label="Pick a date" />
      </DemoStage>
      <Callout>
        Next, explore each{" "}
        <Link
          href="/docs/date-picker"
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-indigo-600 hover:decoration-accent dark:hover:text-indigo-400"
        >
          primitive
        </Link>{" "}
        or read the{" "}
        <Link
          href="/docs/date-picker#accessibility"
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-indigo-600 hover:decoration-accent dark:hover:text-indigo-400"
        >
          accessibility section
        </Link>
        .
      </Callout>
    </>
  );
}

const CHANGELOG_TAG_VARIANT = {
  Unreleased: "beta",
  Minor: "brand",
  Patch: "secondary",
  Beta: "beta",
} as const;

export function Changelog() {
  const rel = [
    {
      v: "Unreleased",
      date: "Jun 2026",
      tag: "Unreleased" as const,
      items: [
        "DatePicker — time granularity (hour/minute segments), Presets, pageBehavior, allowsNonContiguousRanges, and controlled multiple selection.",
        "DatePicker — Grid navigation refactor via useGridNavigation; range drag selection, range re-anchor, and Ctrl/Cmd+click toggle in multiple mode.",
        "DatePicker — useDatePickerAnnouncer for month, selection, and range-complete screen reader updates.",
        "DatePicker — CLDR-based week start lookup fixes SSR hydration mismatches for locales such as ar-EG.",
        "DatePicker — Arrow keys in day/month/year grids call preventDefault so the page no longer scrolls alongside grid focus.",
        "DatePicker — Portaled Content waits for client mount before rendering (SSR-safe popovers).",
        "@kenos-ui/utils — useGridNavigation: getNextIndex override, GridNavigationKey export, optional onEscape.",
        "Docs — Date Picker API reference, interactive demos, and updated snippets.",
        "Docs — Indigo accent branding on landing, shell, CTAs, and overview quality checks.",
        "Docs — Keyboard tables expanded (Page Up/Down, Tab/Shift+Tab for header controls).",
      ],
    },
    {
      v: "0.4.2",
      date: "Jun 2026",
      tag: "Patch" as const,
      items: [
        "Sync controlled single value into reducer state (SET_SELECTED_DATE) so external value changes update the segmented input and focused month.",
      ],
    },
    {
      v: "0.4.1",
      date: "May 2026",
      tag: "Minor" as const,
      items: [
        "First Kenos UI DatePicker feature release: single, range, and multiple modes with unified DatePicker.Root.",
        "Segmented Input via timescape — locale-aware segments, bidirectional calendar sync, dual inputs for range.",
        "Compound parts: ViewControl, Grid, Day (render prop), MonthGrid, YearGrid, Calendar shorthand.",
        "Floating UI Content (portal, collision, forceMount, modal opt-in) with dialog-safe Escape handling.",
        "Intl locale: week start, segment order, month/year labels; weekStartsOn override.",
        "WAI-ARIA grid + spinbutton patterns, keyboard suite, vitest-axe, and Storybook stories.",
      ],
    },
  ];
  return (
    <>
      <PageIntro>
        <Eyebrow>Get Started</Eyebrow>
        <PageTitle>Changelog</PageTitle>
        <Lead>
          Release notes for <InlineCode>@kenos-ui/react-datepicker</InlineCode> and this
          documentation site. Package versions follow{" "}
          <a
            href="https://github.com/allysontsoares/kenos-ui/blob/main/packages/datepicker/CHANGELOG.md"
            className="font-semibold underline decoration-line-strong underline-offset-[3px] hover:text-indigo-600 hover:decoration-accent dark:hover:text-indigo-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            packages/datepicker/CHANGELOG.md
          </a>
          .
        </Lead>
      </PageIntro>
      {rel.map((r) => (
        <div key={r.v} className="border-t border-zinc-200 dark:border-zinc-800 py-[22px]">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {r.v === "Unreleased" ? "Unreleased" : `v${r.v}`}
            </span>
            <Badge variant={CHANGELOG_TAG_VARIANT[r.tag]} className="h-5 px-1.5 py-0 text-[10px]">
              {r.tag}
            </Badge>
            <span className="ml-auto text-[13px] text-zinc-500 dark:text-zinc-400">{r.date}</span>
          </div>
          <DocsProse>
            <ul>
              {r.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </DocsProse>
        </div>
      ))}
    </>
  );
}
