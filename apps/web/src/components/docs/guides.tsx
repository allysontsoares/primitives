"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { Eyebrow, PageTitle, Lead, H2, InlineCode, P } from "./pages";
import { DemoStage } from "./blocks";
import { DateField, InlineCalendar, DatePicker, D } from "../kairo/primitives";

const Callout = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="my-5 flex gap-3 rounded-card border border-line bg-subtle px-[18px] py-4 text-sm text-ink2">
    <span className="mt-px shrink-0 text-muted">{icon ?? "→"}</span>
    <div>{children}</div>
  </div>
);
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5M12 16h.01" />
  </svg>
);

export function Installation() {
  return (
    <>
      <Eyebrow>Get Started</Eyebrow>
      <PageTitle>Installation</PageTitle>
      <Lead>
        Kairo ships as a single package with no runtime dependencies. React 19 and React DOM 19 are peer dependencies.
      </Lead>
      <H2 id="install">Install the package</H2>
      <CodeBlock
        tabs={[
          { label: "npm", lang: "bash", code: "npm install @at5/kairo" },
          { label: "pnpm", lang: "bash", code: "pnpm add @at5/kairo" },
          { label: "yarn", lang: "bash", code: "yarn add @at5/kairo" },
          { label: "bun", lang: "bash", code: "bun add @at5/kairo" },
        ]}
      />
      <Callout icon={<InfoIcon />}>
        Kairo has <strong className="font-semibold text-ink">zero CSS</strong>. Nothing renders styled out of the box —
        you attach classes to each part. See the{" "}
        <Link href="/styling" className="text-ink underline decoration-line-strong underline-offset-[3px] hover:text-accent hover:decoration-accent">
          Styling guide
        </Link>
        .
      </Callout>
      <H2 id="peers">Peer dependencies</H2>
      <table className="data-table">
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
      <CodeBlock lang="jsx" code={`import {\n  Calendar,\n  DatePicker,\n  RangePicker,\n  DateField,\n} from "@at5/kairo";`} />
    </>
  );
}

export function QuickStart() {
  return (
    <>
      <Eyebrow>Get Started</Eyebrow>
      <PageTitle>Quick Start</PageTitle>
      <Lead>Build an accessible, fully-styled date picker in a couple of minutes.</Lead>
      <H2 id="compose">1. Compose the parts</H2>
      <P>Every primitive is a set of composable parts. Render only what you need and attach your own classes.</P>
      <CodeBlock
        lang="jsx"
        code={`import { DatePicker, Calendar } from "@at5/kairo";\nimport "./date-picker.css";\n\nexport function MyDatePicker() {\n  return (\n    <DatePicker.Root onValueChange={(d) => console.log(d)}>\n      <DatePicker.Label className="label">Pick a date</DatePicker.Label>\n      <DatePicker.Control className="control">\n        <DatePicker.Input className="input" />\n        <DatePicker.Trigger className="trigger">📅</DatePicker.Trigger>\n      </DatePicker.Control>\n      <DatePicker.Positioner>\n        <DatePicker.Content className="popover">\n          <Calendar.Root className="cal">{/* …cells… */}</Calendar.Root>\n        </DatePicker.Content>\n      </DatePicker.Positioner>\n    </DatePicker.Root>\n  );\n}`}
      />
      <H2 id="style">2. Bring your CSS</H2>
      <P>
        Style parts directly, or target the <InlineCode>[data-*]</InlineCode> attributes Kairo sets for state (
        <InlineCode>[data-selected]</InlineCode>, <InlineCode>[data-today]</InlineCode>,{" "}
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
        <Link href="/date-picker" className="text-ink underline decoration-line-strong underline-offset-[3px] hover:text-accent hover:decoration-accent">
          primitive
        </Link>{" "}
        or read the{" "}
        <Link href="/accessibility" className="text-ink underline decoration-line-strong underline-offset-[3px] hover:text-accent hover:decoration-accent">
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
      <Eyebrow>Guides</Eyebrow>
      <PageTitle>Localization</PageTitle>
      <Lead>
        Pass any BCP 47 locale tag and Kairo derives everything from the platform <InlineCode>Intl</InlineCode> APIs — no
        locale data to bundle.
      </Lead>
      <H2 id="what">What adapts</H2>
      <ul className="prose-docs mb-5">
        <li>
          <strong>Segment order</strong> — <InlineCode>mm/dd/yyyy</InlineCode> vs <InlineCode>dd.mm.yyyy</InlineCode> vs{" "}
          <InlineCode>yyyy/mm/dd</InlineCode>.
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
      <H2 id="try">Try a locale</H2>
      <div className="mb-3.5 flex flex-wrap gap-2">
        {opts.map((v) => (
          <button
            key={v}
            onClick={() => setLocale(v)}
            className={`min-h-9 rounded-lg border px-3 font-mono text-[12.5px] transition-colors ${
              v === locale ? "border-accent text-accent" : "border-line text-ink2 hover:border-line-strong"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <DemoStage tall key={locale}>
        <div className="flex flex-wrap items-start justify-center gap-6">
          <DateField locale={locale} label="Date field" />
          <InlineCalendar locale={locale} defaultValue={D.today()} />
        </div>
      </DemoStage>
      <H2 id="api">Usage</H2>
      <CodeBlock
        lang="jsx"
        code={`<DateField.Root locale="ja-JP">  {/* → yyyy年mm月dd日 */}\n<DateField.Root locale="en-GB">  {/* → dd/mm/yyyy   */}\n<DateField.Root locale="de-DE">  {/* → dd.mm.yyyy   */}`}
      />
    </>
  );
}

export function Accessibility() {
  return (
    <>
      <Eyebrow>Guides</Eyebrow>
      <PageTitle>Accessibility</PageTitle>
      <Lead>
        Kairo implements the WAI-ARIA grid pattern. Roles, labels, selection state and focus management are handled for
        you.
      </Lead>
      <H2 id="roles">Roles &amp; state</H2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Role / Attr</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Calendar.Grid</td>
            <td>role=grid</td>
          </tr>
          <tr>
            <td>Calendar.Cell</td>
            <td>role=gridcell</td>
          </tr>
          <tr>
            <td>Calendar.CellTrigger</td>
            <td>aria-selected · aria-current=date · aria-label</td>
          </tr>
          <tr>
            <td>DateField.Segment</td>
            <td>role=spinbutton · aria-valuenow · aria-valuetext</td>
          </tr>
        </tbody>
      </table>
      <H2 id="keyboard">Keyboard navigation</H2>
      <table className="data-table">
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
        <InlineCalendar defaultValue={D.today()} />
      </DemoStage>
    </>
  );
}

export function Styling() {
  return (
    <>
      <Eyebrow>Guides</Eyebrow>
      <PageTitle>Styling</PageTitle>
      <Lead>
        Kairo ships no CSS. Style parts however you like — plain CSS, CSS Modules, Tailwind, or styled-components.
      </Lead>
      <H2 id="classname">className &amp; style</H2>
      <P>
        Every part forwards <InlineCode>className</InlineCode>, <InlineCode>style</InlineCode> and the rest of its DOM
        props.
      </P>
      <CodeBlock lang="jsx" code={`<Calendar.CellTrigger\n  className="day"\n  style={{ borderRadius: 8 }}\n/>`} />
      <H2 id="data-attrs">Styling by state</H2>
      <P>Each part exposes its state as data attributes so you can style without wiring up props.</P>
      <CodeBlock
        lang="css"
        code={`.day { width: 36px; height: 36px; border-radius: 8px; }\n.day[data-today]        { font-weight: 700; }\n.day[data-selected]     { background: #ff5b29; color: #fff; }\n.day[data-in-range]     { background: #ff5b2922; }\n.day[data-outside-range]{ color: #888; }\n.day[data-disabled]     { opacity: .4; pointer-events: none; }`}
      />
      <H2 id="tailwind">Tailwind</H2>
      <CodeBlock
        lang="jsx"
        code={`<Calendar.CellTrigger\n  className="size-9 rounded-lg hover:bg-zinc-800\n             data-[selected]:bg-orange-500\n             data-[today]:font-bold" />`}
      />
    </>
  );
}

export function Changelog() {
  const rel = [
    { v: "1.0.0", date: "May 2026", tag: "Stable", items: ["First stable release.", "React 19 peer dependency.", "RangePicker presets API."] },
    { v: "0.9.0", date: "Apr 2026", tag: "RC", items: ["DateField segment spinbuttons.", "Saturday week-start for RTL locales."] },
    { v: "0.8.0", date: "Mar 2026", tag: "Beta", items: ["Calendar month/year panes.", "isDateUnavailable callback."] },
  ];
  return (
    <>
      <Eyebrow>Get Started</Eyebrow>
      <PageTitle>Changelog</PageTitle>
      <Lead>
        Notable changes to <InlineCode>@at5/kairo</InlineCode>.
      </Lead>
      {rel.map((r) => (
        <div key={r.v} className="border-t border-line py-[22px]">
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-ink">v{r.v}</span>
            <span className="rounded-full border border-accent-line px-1.5 text-[10px] font-semibold leading-normal text-accent">
              {r.tag}
            </span>
            <span className="ml-auto text-[13px] text-muted">{r.date}</span>
          </div>
          <ul className="prose-docs">
            {r.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
