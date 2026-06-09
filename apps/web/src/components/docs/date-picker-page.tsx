"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DATE_PICKER_A11Y_ROLES,
  DATE_PICKER_API,
  DATE_PICKER_FEATURES,
  DATE_PICKER_IMPORT,
  DATE_PICKER_INSTALL,
  DATE_PICKER_SNIPPETS,
} from "@/lib/date-picker-docs-data";
import { EXAMPLE_SNIPPETS, type ExampleSnippets } from "@/lib/example-snippets";
import { useEffect, useState } from "react";
import { ActionRow, ApiReference, CopyPage, Example, PageNav } from "./blocks";
import { CodeBlock } from "./code-block";
import {
  DateField,
  DatePicker,
  DatePickerComposed,
  DatePickerControlledDemo,
  DatePickerDisabledDemo,
  DatePickerMinMaxDemo,
  DatePickerMultipleDemo,
  DatePickerRangeRHFFormDemo,
  DatePickerRangeTanStackFormDemo,
  DatePickerRHFFormDemo,
  DatePickerTanStackFormDemo,
  DateRangePicker,
  InlineCalendar,
} from "./demos";
import { docsTableClass } from "./docs-prose";
import { Eyebrow, H2, H3, InlineCode, Lead, P, PageIntro, PageTitle } from "./pages";

const DATE_PICKER_SNIPPET_SET = EXAMPLE_SNIPPETS["date-picker"] as ExampleSnippets;
const DATE_PICKER_COMPOSITION_SNIPPETS = EXAMPLE_SNIPPETS[
  "date-picker-composition"
] as ExampleSnippets;
const DATE_PICKER_FIELD_SNIPPETS = EXAMPLE_SNIPPETS["date-picker-field"] as ExampleSnippets;
const DATE_PICKER_INLINE_SNIPPETS = EXAMPLE_SNIPPETS["date-picker-inline"] as ExampleSnippets;

const localeOpts: [string, string][] = [
  ["en-US", "English (US)"],
  // ["en-GB", "English (UK)"],
  ["pt-BR", "Português (BR)"],
  ["ja-JP", "日本語"],
  ["de-DE", "Deutsch"],
  ["ar-EG", "العربية"],
];

const COMPOSABLES_TAB_ALIASES: Record<string, string> = {
  "date-field": "date-field",
  inline: "inline",
};

export function DatePickerPage() {
  const [locale, setLocale] = useState("en-US");
  const [composablesTab, setComposablesTab] = useState("date-field");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "quick-start") {
      document.getElementById("default")?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", "#default");
      return;
    }
    const tab = COMPOSABLES_TAB_ALIASES[hash];
    if (tab) {
      setComposablesTab(tab);
      document.getElementById("composables")?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", "#composables");
    }
  }, []);

  return (
    <>
      <PageIntro>
        <Eyebrow>Primitive</Eyebrow>
        <PageTitle action={<CopyPage />}>Date Picker</PageTitle>
        <Lead>
          Headless date primitives for React — segmented input, popover calendar, range and multiple
          selection. Built on native Intl, timescape, and Floating UI. Zero CSS shipped.
        </Lead>
        <ActionRow />
      </PageIntro>
      <H2 id="features">Features</H2>
      <ul className="mb-4 list-disc space-y-1.5 pl-5 text-zinc-600 dark:text-zinc-300">
        {DATE_PICKER_FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <H2 id="installation">Installation</H2>
      <P>
        Install the Date Picker primitive on its own, or use the aggregator{" "}
        <InlineCode>@kenos-ui/react</InlineCode> package if you already depend on other Kenos
        primitives.
      </P>
      <H3 id="install-package">Install a package</H3>
      <CodeBlock
        tabs={[
          {
            label: "@kenos-ui/react-datepicker",
            lang: "bash",
            code: DATE_PICKER_INSTALL.datepicker,
          },
          {
            label: "@kenos-ui/react",
            lang: "bash",
            code: DATE_PICKER_INSTALL.react,
          },
        ]}
      />
      <H3 id="import">Import</H3>
      <CodeBlock
        tabs={[
          {
            label: "@kenos-ui/react-datepicker",
            lang: "jsx",
            code: DATE_PICKER_IMPORT.datepicker,
          },
          {
            label: "@kenos-ui/react",
            lang: "jsx",
            code: DATE_PICKER_IMPORT.react,
          },
        ]}
      />
      <H2 id="examples">Examples</H2>
      <P>Every demo is interactive and keyboard-navigable.</P>
      <H3 id="default">Default</H3>
      <P>
        The README pattern — controlled state with <InlineCode>useState</InlineCode>, segmented{" "}
        <InlineCode>Input</InlineCode>, <InlineCode>Trigger</InlineCode>, and the{" "}
        <InlineCode>Calendar</InlineCode> shorthand. Toggle the code tabs to see unstyled, CSS,
        Tailwind, and Panda CSS approaches.
      </P>
      <P>
        Styling works with plain <InlineCode>className</InlineCode> on each part, then{" "}
        <InlineCode>data-*</InlineCode> selectors from your <InlineCode>Content</InlineCode> scope
        for calendar cells. Keep <InlineCode>display: table-cell</InlineCode> on{" "}
        <InlineCode>td[role=gridcell]</InlineCode> — do not use flex/grid on table cells.
      </P>
      <Example snippets={DATE_PICKER_SNIPPET_SET} previewTall>
        <DatePicker label="Pick a date" />
      </Example>
      <H3 id="composition">Composition</H3>
      <P>
        For full control, compose <InlineCode>ViewControl</InlineCode>,{" "}
        <InlineCode>Grid</InlineCode>, and <InlineCode>Day</InlineCode> with a render prop instead
        of the <InlineCode>Calendar</InlineCode> shorthand.
      </P>
      <Example snippets={DATE_PICKER_COMPOSITION_SNIPPETS} previewTall>
        <DatePickerComposed label="Pick a date" />
      </Example>
      <H3 id="composables">Composables</H3>
      <P>
        Use only the parts you need — input-only, calendar-only, or the full popover path in
        Default.
      </P>
      <Tabs value={composablesTab} onValueChange={setComposablesTab} className="my-4">
        <TabsList>
          <TabsTrigger value="date-field">Date field</TabsTrigger>
          <TabsTrigger value="inline">Inline calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="date-field" className="mt-4">
          <P>
            A segmented input without a calendar — omit <InlineCode>Content</InlineCode> and{" "}
            <InlineCode>Trigger</InlineCode>. Ideal for birth dates and compact forms.
          </P>
          <Example snippets={DATE_PICKER_FIELD_SNIPPETS} previewTall>
            <DateField label="Date of birth" />
          </Example>
        </TabsContent>
        <TabsContent value="inline" className="mt-4">
          <P>
            Render the calendar directly in your layout — no <InlineCode>Content</InlineCode>,{" "}
            <InlineCode>Trigger</InlineCode>, or popover.
          </P>
          <Example snippets={DATE_PICKER_INLINE_SNIPPETS} previewTall>
            <InlineCalendar defaultValue={new Date()} />
          </Example>
        </TabsContent>
      </Tabs>
      <H3 id="controlled">Controlled</H3>
      <P>
        Pass <InlineCode>value</InlineCode> and <InlineCode>onValueChange</InlineCode> on{" "}
        <InlineCode>DatePicker.Root</InlineCode> for fully controlled state.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.controlled} lang="tsx" previewTall>
        <DatePickerControlledDemo />
      </Example>
      <H3 id="range">Date Range</H3>
      <P>
        Set <InlineCode>mode="range"</InlineCode> with dual inputs (
        <InlineCode>index=&#123;0&#125;</InlineCode> and{" "}
        <InlineCode>index=&#123;1&#125;</InlineCode>). Live hover preview styles days with{" "}
        <InlineCode>data-in-range</InlineCode>.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.range} lang="tsx" previewTall>
        <DateRangePicker label="Trip dates" />
      </Example>
      <H3 id="multiple">Multiple Dates</H3>
      <P>
        <InlineCode>mode="multiple"</InlineCode> toggles dates on click. Keep the popover open with{" "}
        <InlineCode>closeOnSelect=&#123;false&#125;</InlineCode>.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.multiple} lang="tsx" previewTall>
        <DatePickerMultipleDemo />
      </Example>
      <H3 id="localization">Localization</H3>
      <P>
        Segment order, separators, weekday names, and week start derive from{" "}
        <InlineCode>Intl</InlineCode>. Pass any BCP 47 <InlineCode>locale</InlineCode> tag.
      </P>
      <Tabs value={locale} onValueChange={setLocale} className="my-4">
        <TabsList>
          {localeOpts.map(([v, l]) => (
            <TabsTrigger key={v} value={v}>
              {l}
            </TabsTrigger>
          ))}
        </TabsList>
        {localeOpts.map(([v]) => (
          <TabsContent key={v} value={v} className="mt-4">
            <Example code={DATE_PICKER_SNIPPETS.localization} lang="tsx" previewTall>
              <div className="flex flex-wrap items-start justify-center gap-6">
                <DateField locale={v} label="Date field" />
                <InlineCalendar locale={v} defaultValue={new Date()} />
              </div>
            </Example>
          </TabsContent>
        ))}
      </Tabs>
      <H3 id="min-max">Min and Max</H3>
      <P>
        Clamp the selectable range with <InlineCode>minDate</InlineCode> and{" "}
        <InlineCode>maxDate</InlineCode> on Root. Disabled dates show{" "}
        <InlineCode>data-disabled</InlineCode>.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.minMax} lang="tsx" previewTall>
        <DatePickerMinMaxDemo />
      </Example>
      <H3 id="disabled-dates">Disabled Dates</H3>
      <P>
        Pass <InlineCode>disabled=&#123;(date) =&gt; boolean&#125;</InlineCode> to disable specific
        dates — weekends in this example.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.disabled} lang="tsx" previewTall>
        <DatePickerDisabledDemo />
      </Example>
      <H3 id="presets">Range Presets</H3>
      <P>
        Presets are custom UI you compose inside <InlineCode>Content</InlineCode>. Use{" "}
        <InlineCode>useDatePickerContext</InlineCode> and <InlineCode>dispatch</InlineCode> to apply
        a range programmatically.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.presets} lang="tsx" previewTall>
        <DateRangePicker label="Stay" presets />
      </Example>
      <H3 id="year-navigation">Year Navigation</H3>
      <P>
        In year view, <InlineCode>PrevTrigger</InlineCode> / <InlineCode>NextTrigger</InlineCode>{" "}
        page through 12-year windows. <InlineCode>minDate</InlineCode> /{" "}
        <InlineCode>maxDate</InlineCode> disable out-of-range years.
      </P>
      <Example previewTall>
        <InlineCalendar defaultValue={new Date()} />
      </Example>
      <H2 id="form-integration">Form Integration</H2>
      <P>
        Bind <InlineCode>value</InlineCode> and <InlineCode>onValueChange</InlineCode> to your form
        library. All examples validate with Zod.
      </P>
      <Tabs defaultValue="tanstack" className="my-4">
        <TabsList>
          <TabsTrigger value="tanstack">TanStack Form — Single</TabsTrigger>
          <TabsTrigger value="tanstack-range">TanStack Form — Range</TabsTrigger>
          <TabsTrigger value="rhf">React Hook Form — Single</TabsTrigger>
          <TabsTrigger value="rhf-range">React Hook Form — Range</TabsTrigger>
        </TabsList>
        <TabsContent value="tanstack" className="mt-4">
          <Example code={DATE_PICKER_SNIPPETS.tanstack} lang="tsx" previewTall>
            <DatePickerTanStackFormDemo />
          </Example>
        </TabsContent>
        <TabsContent value="tanstack-range" className="mt-4">
          <Example code={DATE_PICKER_SNIPPETS.rangeTanstack} lang="tsx" previewTall>
            <DatePickerRangeTanStackFormDemo />
          </Example>
        </TabsContent>
        <TabsContent value="rhf" className="mt-4">
          <Example code={DATE_PICKER_SNIPPETS.rhf} lang="tsx" previewTall>
            <DatePickerRHFFormDemo />
          </Example>
        </TabsContent>
        <TabsContent value="rhf-range" className="mt-4">
          <Example code={DATE_PICKER_SNIPPETS.rangeRhf} lang="tsx" previewTall>
            <DatePickerRangeRHFFormDemo />
          </Example>
        </TabsContent>
      </Tabs>
      <H2 id="accessibility">Accessibility</H2>
      <P>
        Kenos implements the WAI-ARIA date picker and grid patterns. Roles, labels, and focus
        management are handled for you.
      </P>
      <H3 id="roles">Roles and state</H3>
      <table className={docsTableClass}>
        <thead>
          <tr>
            <th>Part</th>
            <th>Role / attributes</th>
          </tr>
        </thead>
        <tbody>
          {DATE_PICKER_A11Y_ROLES.map((row) => (
            <tr key={row.part}>
              <td>{row.part}</td>
              <td>
                <code className="font-mono text-xs">{row.role}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <H3 id="keyboard">Keyboard support</H3>
      <P>
        Behavior depends on which part has focus — trigger, segments, or calendar grid. Try the
        inline calendar below with arrow keys.
      </P>
      {DATE_PICKER_API.filter((g) => g.keys).map((group) => (
        <div key={group.group} className="mb-6">
          <h4 className="mb-2 text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
            {group.group.replace("Keyboard — ", "")}
          </h4>
          <table className={docsTableClass}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {group.props.map((row) => (
                <tr key={row.name}>
                  <td>
                    <span className="font-mono text-xs">{row.name}</span>
                  </td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <H2 id="api-reference">API Reference</H2>
      <P>
        Props, data attributes, and keyboard interactions. Import from{" "}
        <InlineCode>@kenos-ui/react-datepicker</InlineCode>.
      </P>
      <ApiReference groups={DATE_PICKER_API.filter((g) => !g.keys)} />
      <PageNav route="date-picker" />
    </>
  );
}
