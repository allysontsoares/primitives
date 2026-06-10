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
  DatePickerFormNativeDemo,
  DatePickerGranularityDemo,
  DatePickerInvalidDemo,
  DatePickerMinMaxDemo,
  DatePickerMultipleDemo,
  DatePickerNonContiguousRangeDemo,
  DatePickerRangeEscapeDemo,
  DatePickerRTLDemo,
  DatePickerUnavailableDemo,
  DatePickerRangeRHFFormDemo,
  DatePickerRangeTanStackFormDemo,
  DatePickerRHFFormDemo,
  DatePickerTanStackFormDemo,
  DateRangePicker,
  InlineCalendar,
  LocalizedDatePickerDemo,
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
        <InlineCode>data-in-range</InlineCode>. Press <InlineCode>Escape</InlineCode> after picking
        a start date to cancel the pending anchor without closing the popover.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.range} lang="tsx" previewTall>
        <DateRangePicker label="Trip dates" />
      </Example>
      <Example code={DATE_PICKER_SNIPPETS.range} lang="tsx" previewTall>
        <DatePickerRangeEscapeDemo />
      </Example>
      <H3 id="multiple">Multiple Dates</H3>
      <P>
        <InlineCode>mode="multiple"</InlineCode> toggles dates on click. Pass{" "}
        <InlineCode>value</InlineCode> and <InlineCode>onValueChange</InlineCode> for fully
        controlled sync — programmatic updates and form resets stay in step with the calendar. Keep
        the popover open with <InlineCode>closeOnSelect=&#123;false&#125;</InlineCode>.
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
                <LocalizedDatePickerDemo locale={v} label="Date" />
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
        dates — weekends in this example. Disabled cells receive no focus and use{" "}
        <InlineCode>aria-disabled</InlineCode>.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.disabled} lang="tsx" previewTall>
        <DatePickerDisabledDemo />
      </Example>
      <H3 id="unavailable-dates">Unavailable Dates</H3>
      <P>
        Use <InlineCode>unavailable</InlineCode> when dates should stay focusable for keyboard users
        but must not be selected — e.g. booked slots. Cells expose{" "}
        <InlineCode>data-unavailable</InlineCode> and rich <InlineCode>aria-label</InlineCode> text.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.unavailable} lang="tsx" previewTall>
        <DatePickerUnavailableDemo />
      </Example>
      <H3 id="form-native">Form Native</H3>
      <P>
        Add <InlineCode>DatePicker.HiddenInput</InlineCode> with <InlineCode>name</InlineCode> on
        Root for native <InlineCode>&lt;form&gt;</InlineCode> submission. Pair with{" "}
        <InlineCode>required</InlineCode> for browser validation.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.formNative} lang="tsx" previewTall>
        <DatePickerFormNativeDemo />
      </Example>
      <H3 id="invalid">Invalid State</H3>
      <P>
        Set <InlineCode>invalid</InlineCode> and <InlineCode>errorMessage</InlineCode> on Root to
        wire <InlineCode>aria-invalid</InlineCode> and <InlineCode>aria-errormessage</InlineCode> on
        the input group. Style with <InlineCode>data-invalid</InlineCode> on Root.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.invalid} lang="tsx" previewTall>
        <DatePickerInvalidDemo />
      </Example>
      <H3 id="rtl">RTL</H3>
      <P>
        Pass <InlineCode>dir="rtl"</InlineCode> (or rely on <InlineCode>document.dir</InlineCode>)
        to mirror arrow-key navigation in day, month, and year grids.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.rtl} lang="tsx" previewTall>
        <DatePickerRTLDemo />
      </Example>
      <H3 id="using-presets">Presets</H3>
      <P>
        Wrap shortcut buttons in <InlineCode>DatePicker.Presets</InlineCode> inside{" "}
        <InlineCode>Content</InlineCode>. Use <InlineCode>useDatePickerActions()</InlineCode> for{" "}
        <InlineCode>selectDate</InlineCode>, <InlineCode>selectRange</InlineCode>,{" "}
        <InlineCode>selectToday</InlineCode>, and related helpers — no manual dispatch wiring.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.presets} lang="tsx" previewTall>
        <DateRangePicker label="Stay" presets />
      </Example>
      <H3 id="granularity">Time Granularity</H3>
      <P>
        Set <InlineCode>granularity</InlineCode> to <InlineCode>"hour"</InlineCode>,{" "}
        <InlineCode>"minute"</InlineCode>, or <InlineCode>"second"</InlineCode> to add time segments
        via timescape. Use <InlineCode>hourCycle=&#123;12 | 24&#125;</InlineCode> to force 12h or
        24h display. Calendar selection updates the date portion and preserves the current time.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.granularity} lang="tsx" previewTall>
        <DatePickerGranularityDemo />
      </Example>
      <H3 id="non-contiguous-range">Non-contiguous Ranges</H3>
      <P>
        By default, completing a range fails when unavailable dates sit between start and end. Set{" "}
        <InlineCode>allowsNonContiguousRanges</InlineCode> on <InlineCode>mode="range"</InlineCode>{" "}
        to allow booking-style ranges that skip unavailable days (weekends, blocked slots).
      </P>
      <Example code={DATE_PICKER_SNIPPETS.nonContiguousRange} lang="tsx" previewTall>
        <DatePickerNonContiguousRangeDemo />
      </Example>
      <H3 id="page-behavior">Page Behavior</H3>
      <P>
        <InlineCode>pageBehavior="visible"</InlineCode> (default) changes the visible month on
        PageUp/PageDown. <InlineCode>pageBehavior="single"</InlineCode> moves focus by one month
        without changing the month header while the target day is still rendered in the grid —
        useful for future multi-month layouts.
      </P>
      <CodeBlock code={DATE_PICKER_SNIPPETS.pageBehavior} lang="tsx" />
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
      <H2 id="styling">Styling</H2>
      <P>
        Target <InlineCode>data-*</InlineCode> on Root and day cells. Root exposes{" "}
        <InlineCode>data-open</InlineCode>, <InlineCode>data-invalid</InlineCode>,{" "}
        <InlineCode>data-focus-within</InlineCode>, and more for field-level states.
      </P>
      <Example code={DATE_PICKER_SNIPPETS.styling} lang="css" previewTall>
        <DatePicker label="Styled field" defaultOpen />
      </Example>
      <H2 id="accessibility">Accessibility</H2>
      <P>
        Kenos implements the WAI-ARIA date picker and grid patterns. Roles, labels, and focus
        management are handled for you. <strong>Disabled</strong> dates are removed from the tab
        order; <strong>unavailable</strong> dates remain focusable with descriptive labels.
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
