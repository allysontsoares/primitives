"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./code-block";
import { DocsProse, docsTableClass } from "./docs-prose";
import { Eyebrow, PageIntro, PageTitle, Lead, H2, InlineCode, P } from "./pages";
import { DemoStage } from "./blocks";
import { DateField, InlineCalendar, DatePicker } from "./demos";

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
          Kenos UI ships headless primitives with no runtime dependencies. React 19 and React DOM 19 are
          peer dependencies.
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
            label: "Aggregator",
            lang: "bash",
            code: "pnpm add @kenos-ui/react",
          },
        ]}
      />
      <Callout icon={<InfoIcon />}>
        Kenos has <strong className="font-semibold text-zinc-900 dark:text-zinc-100">zero CSS</strong>. Nothing renders
        styled out of the box — you attach classes to each part. See the{" "}
        <Link
          href="/docs/styling"
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-zinc-500 hover:decoration-accent"
        >
          Styling guide
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
        code={`import { DatePicker } from "@kenos-ui/react-datepicker";\nimport { Select } from "@kenos-ui/react-select";\n// or: import { DatePicker, Select } from "@kenos-ui/react";\n\n// <DatePicker.Root> ... <DatePicker.Calendar />\n// <Select.Root name="x"> ... <Select.HiddenSelect />`}
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
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-zinc-500 hover:decoration-accent"
        >
          primitive
        </Link>{" "}
        or read the{" "}
        <Link
          href="/docs/accessibility"
          className="text-zinc-900 dark:text-zinc-100 underline decoration-line-strong underline-offset-[3px] hover:text-zinc-500 hover:decoration-accent"
        >
          accessibility guide
        </Link>
        .
      </Callout>
    </>
  );
}

export function Localization() {
  const [locale, setLocale] = useState("ja-JP");
  const opts = ["en-US", "en-GB", "fr-FR", "de-DE", "ja-JP", "ar-EG", "pt-BR"];
  return (
    <>
      <PageIntro>
        <Eyebrow>Guides</Eyebrow>
        <PageTitle>Localization</PageTitle>
        <Lead>
          Pass any BCP 47 locale tag and Kenos derives everything from the platform{" "}
          <InlineCode>Intl</InlineCode> APIs — no locale data to bundle.
        </Lead>
      </PageIntro>
      <H2 id="what">What adapts</H2>
      <DocsProse>
        <ul>
          <li>
            <strong>Segment order</strong> —{" "}
            <span className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <InlineCode>mm/dd/yyyy</InlineCode>
              <span className="text-zinc-500 dark:text-zinc-400">vs</span>
              <InlineCode>dd.mm.yyyy</InlineCode>
              <span className="text-zinc-500 dark:text-zinc-400">vs</span>
              <InlineCode>yyyy/mm/dd</InlineCode>
            </span>
            .
          </li>
          <li>
            <strong>Separators</strong> — slashes, dots, hyphens, or locale-specific literals.
          </li>
          <li>
            <strong>Weekday &amp; month names</strong> — short and long forms.
          </li>
          <li>
            <strong>First day of week</strong> — Sunday, Monday or Saturday by region.
          </li>
        </ul>
      </DocsProse>
      <H2 id="try">Try a locale</H2>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {opts.map((v) => (
          <button
            key={v}
            onClick={() => setLocale(v)}
            className={`min-h-9 rounded-lg border px-3 font-mono text-[12.5px] transition-colors ${
              v === locale
                ? "border-zinc-400 text-zinc-500"
                : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <DemoStage tall key={locale}>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <DateField locale={locale} label="Date field" />
          <InlineCalendar locale={locale} defaultValue={new Date()} />
        </div>
      </DemoStage>
      <H2 id="api">Usage</H2>
      <CodeBlock
        lang="jsx"
        code={`<DatePicker.Root locale="ja-JP"><DatePicker.Input />  {/* → yyyy年mm月dd日 */}\n<DatePicker.Root locale="en-GB"><DatePicker.Input />  {/* → dd/mm/yyyy   */}\n<DatePicker.Root locale="de-DE"><DatePicker.Input />  {/* → dd.mm.yyyy   */}`}
      />
    </>
  );
}

export function Accessibility() {
  return (
    <>
      <PageIntro>
        <Eyebrow>Guides</Eyebrow>
        <PageTitle>Accessibility</PageTitle>
        <Lead>
          Kenos implements the WAI-ARIA grid pattern. Roles, labels, selection state and focus
          management are handled for you.
        </Lead>
      </PageIntro>
      <H2 id="roles">Roles &amp; state</H2>
      <table className={docsTableClass}>
        <thead>
          <tr>
            <th>Part</th>
            <th>Role / Attr</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DatePicker.Grid + Day</td>
            <td>role=grid</td>
          </tr>
          <tr>
            <td>DatePicker.Day (gridcell)</td>
            <td>role=gridcell</td>
          </tr>
          <tr>
            <td>DatePicker.Day (the gridcell)</td>
            <td>aria-selected · aria-current=date · aria-label</td>
          </tr>
          <tr>
            <td>DatePicker.Input (segments inside)</td>
            <td>role=spinbutton · aria-valuenow · aria-valuetext (data-segment, data-placeholder, data-separator on children)</td>
          </tr>
        </tbody>
      </table>
      <H2 id="keyboard">Keyboard navigation</H2>
      <table className={docsTableClass}>
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["← → ↑ ↓", "Move focus by day or week (roving tabindex)."],
            ["PageUp / PageDown", "Previous / next month. Shift for a year."],
            ["Home / End", "Start / end of the focused week."],
            ["Enter / Space", "Select the focused date."],
            ["Esc", "Close the popover, restore focus to the trigger."],
          ].map(([k, v]) => (
            <tr key={k}>
              <td>
                <span className="font-mono text-xs">{k}</span>
              </td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Callout icon="✓">Try it: focus the calendar below and navigate with the arrow keys.</Callout>
      <DemoStage tall>
        <InlineCalendar defaultValue={new Date()} />
      </DemoStage>
    </>
  );
}

export function Styling() {
  return (
    <>
      <PageIntro>
        <Eyebrow>Guides</Eyebrow>
        <PageTitle>Styling</PageTitle>
        <Lead>
          Kenos ships no CSS. Style parts however you like — plain CSS, CSS Modules, Tailwind, or
          styled-components.
        </Lead>
      </PageIntro>
      <H2 id="classname">className &amp; style</H2>
      <P>
        Every part forwards <InlineCode>className</InlineCode>, <InlineCode>style</InlineCode> and
        the rest of its DOM props.
      </P>
      <CodeBlock
        lang="jsx"
        code={`<DatePicker.Day\n  date={day}\n  className="day"\n  style={{ borderRadius: 8 }}\n/>`}
      />
      <H2 id="data-attrs">Styling by state</H2>
      <P>
        Each part exposes its state as data attributes so you can style without wiring up props.
      </P>
      <CodeBlock
        lang="css"
        code={`.day { width: 36px; height: 36px; border-radius: 8px; }\n.day[data-today]         { font-weight: 700; }\n.day[data-selected]      { background: #ff5b29; color: #fff; }\n.day[data-in-range]      { background: #ff5b2922; }\n.day[data-outside-month] { color: #888; }\n.day[data-disabled]      { opacity: .4; pointer-events: none; }`}
      />
      <H2 id="tailwind">Tailwind</H2>
      <CodeBlock
        lang="jsx"
        code={`<DatePicker.Day\n  date={day}\n  className="size-9 rounded-lg hover:bg-zinc-800\n             data-[selected]:bg-zinc-100\n             data-[today]:font-bold" />`}
      />
    </>
  );
}

export function Changelog() {
  const rel = [
    {
      v: "1.0.0",
      date: "May 2026",
      tag: "Stable",
      items: ["First stable release.", "React 19 peer dependency.", "Range support via mode=\"range\" + presets in examples."],
    },
    {
      v: "0.9.0",
      date: "Apr 2026",
      tag: "RC",
      items: ["DateField segment spinbuttons.", "Saturday week-start for RTL locales."],
    },
    {
      v: "0.8.0",
      date: "Mar 2026",
      tag: "Beta",
      items: ["Calendar month/year panes.", "isDateUnavailable callback."],
    },
  ];
  return (
    <>
      <PageIntro>
        <Eyebrow>Get Started</Eyebrow>
        <PageTitle>Changelog</PageTitle>
        <Lead>
          Notable changes to <InlineCode>@kenos-ui/react-datepicker</InlineCode>.
        </Lead>
      </PageIntro>
      {rel.map((r) => (
        <div key={r.v} className="border-t border-zinc-200 dark:border-zinc-800 py-[22px]">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">v{r.v}</span>
            <Badge
              variant={r.tag === "Beta" ? "beta" : "secondary"}
              className="h-5 px-1.5 py-0 text-[10px]"
            >
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
