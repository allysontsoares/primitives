/* ============================================================
   Site data: navigation tree, component metadata, anatomy,
   API reference, search index. Ported from the Kairo design.
   ============================================================ */

export type AnatomyNode = {
  tag: string;
  leaf?: boolean;
  note?: string;
  children?: AnatomyNode[];
};

export type ApiProp = {
  name: string;
  type?: string;
  def?: string;
  required?: boolean;
  desc: string;
};

export type ApiGroup = {
  group: string;
  attrs?: boolean;
  keys?: boolean;
  props: ApiProp[];
};

export type ComponentMeta = {
  name: string;
  eyebrow: string;
  desc: string;
  demo: DemoKind;
  parts: AnatomyNode[];
};

export type DemoKind = "calendar" | "date-picker" | "date-range-picker" | "date-field";

export type NavItem = { label: string; route: string };
export type NavGroup = { title: string; badge?: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: "Get Started",
    items: [
      { label: "Overview", route: "" },
      { label: "Installation", route: "installation" },
      { label: "Quick Start", route: "quickstart" },
      { label: "Changelog", route: "changelog" },
    ],
  },
  {
    title: "Primitives",
    badge: "New",
    items: [
      { label: "Calendar", route: "calendar" },
      { label: "Date Picker", route: "date-picker" },
      { label: "Date Range Picker", route: "date-range-picker" },
      { label: "Date Field", route: "date-field" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Localization", route: "localization" },
      { label: "Accessibility", route: "accessibility" },
      { label: "Styling", route: "styling" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "Calendar API", route: "calendar/api" },
      { label: "Date Picker API", route: "date-picker/api" },
      { label: "Date Range API", route: "date-range-picker/api" },
      { label: "Date Field API", route: "date-field/api" },
    ],
  },
];

export const COMPONENTS: Record<string, ComponentMeta> = {
  calendar: {
    name: "Calendar",
    eyebrow: "Primitive",
    desc: "A composable month grid built on the WAI-ARIA grid pattern, with full keyboard navigation and roving focus.",
    demo: "calendar",
    parts: [
      {
        tag: "Calendar.Root",
        children: [
          {
            tag: "Calendar.Header",
            children: [
              { tag: "Calendar.PrevTrigger", leaf: true },
              { tag: "Calendar.Heading", leaf: true },
              { tag: "Calendar.NextTrigger", leaf: true },
            ],
          },
          {
            tag: "Calendar.Grid",
            children: [
              { tag: "Calendar.GridHead", leaf: true, note: "row of weekday labels" },
              {
                tag: "Calendar.GridBody",
                children: [
                  {
                    tag: "Calendar.Cell",
                    note: "role=gridcell · one per day",
                    children: [{ tag: "Calendar.CellTrigger", leaf: true }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "date-picker": {
    name: "Date Picker",
    eyebrow: "Primitive",
    desc: "An input paired with a popover calendar for selecting a single date. Renders only semantic HTML — you control every pixel.",
    demo: "date-picker",
    parts: [
      {
        tag: "DatePicker.Root",
        children: [
          { tag: "DatePicker.Label", leaf: true },
          {
            tag: "DatePicker.Control",
            children: [
              { tag: "DatePicker.Input", leaf: true },
              { tag: "DatePicker.Trigger", leaf: true },
            ],
          },
          {
            tag: "DatePicker.Positioner",
            children: [
              {
                tag: "DatePicker.Content",
                note: "the popover",
                children: [{ tag: "Calendar.Root", leaf: true, note: "nested calendar parts" }],
              },
            ],
          },
        ],
      },
    ],
  },
  "date-range-picker": {
    name: "Date Range Picker",
    eyebrow: "Primitive",
    desc: "Select a start and end date with live range preview, optional presets, and dual-segment input.",
    demo: "date-range-picker",
    parts: [
      {
        tag: "RangePicker.Root",
        children: [
          { tag: "RangePicker.Label", leaf: true },
          {
            tag: "RangePicker.Control",
            children: [
              { tag: "RangePicker.Input", note: "index={0} start", leaf: true },
              { tag: "RangePicker.Input", note: "index={1} end", leaf: true },
              { tag: "RangePicker.Trigger", leaf: true },
            ],
          },
          {
            tag: "RangePicker.Positioner",
            children: [
              {
                tag: "RangePicker.Content",
                children: [
                  { tag: "Calendar.Root", leaf: true, note: "range mode" },
                  { tag: "RangePicker.Presets", leaf: true },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "date-field": {
    name: "Date Field",
    eyebrow: "Primitive",
    desc: "A segmented text input where each part (day, month, year) is independently editable and locale-aware — no calendar required.",
    demo: "date-field",
    parts: [
      {
        tag: "DateField.Root",
        children: [
          { tag: "DateField.Label", leaf: true },
          {
            tag: "DateField.Control",
            note: "role=group",
            children: [
              { tag: "DateField.Segment", note: "role=spinbutton · repeats per part", leaf: true },
              { tag: "DateField.Literal", note: "separators from Intl", leaf: true },
            ],
          },
        ],
      },
    ],
  },
};

const rootGroup = { group: "Root props" };

export const API: Record<string, ApiGroup[]> = {
  calendar: [
    {
      ...rootGroup,
      props: [
        { name: "value", type: "Date | null", def: "null", desc: "The selected date in controlled mode." },
        { name: "defaultValue", type: "Date | null", def: "null", desc: "The initial selected date in uncontrolled mode." },
        { name: "onValueChange", type: "(date: Date) => void", desc: "Called when the user selects a date." },
        { name: "locale", type: "string", def: '"en-US"', desc: "Any BCP 47 tag. Drives weekday/month labels and week start." },
        { name: "weekStartsOn", type: "0 – 6", def: "derived from locale", desc: "Override the first day of the week (0 = Sunday)." },
        { name: "min", type: "Date", desc: "Earliest selectable date. Earlier days are disabled." },
        { name: "max", type: "Date", desc: "Latest selectable date." },
        { name: "isDateUnavailable", type: "(date: Date) => boolean", desc: "Return true to disable an individual date." },
        { name: "numberOfMonths", type: "number", def: "1", desc: "Render multiple month panels side by side." },
      ],
    },
    {
      group: "Data attributes",
      attrs: true,
      props: [
        { name: "[data-selected]", type: "CellTrigger", desc: "Present on the selected day." },
        { name: "[data-today]", type: "CellTrigger", desc: "Present on the current date." },
        { name: "[data-outside-range]", type: "CellTrigger", desc: "Day belongs to an adjacent month." },
        { name: "[data-disabled]", type: "CellTrigger", desc: "Day is unavailable or out of min/max." },
      ],
    },
  ],
  "date-picker": [
    {
      ...rootGroup,
      props: [
        { name: "value", type: "Date | null", def: "null", desc: "Selected date (controlled)." },
        { name: "defaultValue", type: "Date | null", def: "null", desc: "Initial date (uncontrolled)." },
        { name: "onValueChange", type: "(date: Date | null) => void", desc: "Fires on selection or input parse." },
        { name: "open", type: "boolean", desc: "Controls popover visibility." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Called when the popover opens or closes." },
        { name: "locale", type: "string", def: '"en-US"', desc: "Locale tag for parsing, segments and labels." },
        { name: "format", type: "Intl.DateTimeFormatOptions", desc: "Override how the input renders the value." },
        { name: "closeOnSelect", type: "boolean", def: "true", desc: "Close the popover after a date is chosen." },
        { name: "placement", type: '"bottom-start" | "bottom-end" | …', def: '"bottom-start"', desc: "Popover placement relative to the control." },
      ],
    },
    {
      group: "Keyboard",
      keys: true,
      props: [
        { name: "Space / Enter", desc: "Open the popover · select the focused day." },
        { name: "Arrow keys", desc: "Move focus by day (←→) or week (↑↓) within the grid." },
        { name: "PageUp / PageDown", desc: "Previous / next month. Hold Shift for a year." },
        { name: "Home / End", desc: "First / last day of the focused week." },
        { name: "Escape", desc: "Close the popover and return focus to the trigger." },
      ],
    },
  ],
  "date-range-picker": [
    {
      ...rootGroup,
      props: [
        { name: "value", type: "[Date, Date] | null", desc: "Selected range (controlled)." },
        { name: "defaultValue", type: "[Date, Date] | null", desc: "Initial range (uncontrolled)." },
        { name: "onValueChange", type: "(range) => void", desc: "Fires once both endpoints are set." },
        { name: "minNights", type: "number", def: "0", desc: "Minimum nights enforced between endpoints." },
        { name: "maxNights", type: "number", desc: "Maximum selectable span." },
        { name: "presets", type: "Preset[]", desc: "Quick-select shortcuts rendered in the footer." },
        { name: "locale", type: "string", def: '"en-US"', desc: "Locale tag." },
      ],
    },
  ],
  "date-field": [
    {
      ...rootGroup,
      props: [
        { name: "value", type: "Date | null", desc: "Parsed value (controlled)." },
        { name: "defaultValue", type: "Date | null", desc: "Initial value (uncontrolled)." },
        { name: "onValueChange", type: "(date: Date | null) => void", desc: "Fires when all segments are complete." },
        { name: "locale", type: "string", def: '"en-US"', desc: "Determines segment order and separators." },
        { name: "granularity", type: '"day" | "month" | "year"', def: '"day"', desc: "Smallest editable segment." },
        { name: "min", type: "Date", desc: "Clamp segment values to this lower bound." },
        { name: "max", type: "Date", desc: "Clamp segment values to this upper bound." },
      ],
    },
    {
      group: "Keyboard",
      keys: true,
      props: [
        { name: "0–9", desc: "Type into the focused segment; auto-advances when full." },
        { name: "Arrow ↑ / ↓", desc: "Increment / decrement the focused segment." },
        { name: "Arrow ← / →", desc: "Move between segments." },
        { name: "Backspace", desc: "Clear the focused segment." },
      ],
    },
  ],
};

export type SearchEntry = {
  title: string;
  route: string;
  crumb: string;
  kind: "page" | "comp" | "api";
};

export const SEARCH: SearchEntry[] = [
  { title: "Overview", route: "", crumb: "Get Started", kind: "page" },
  { title: "Installation", route: "installation", crumb: "Get Started", kind: "page" },
  { title: "Quick Start", route: "quickstart", crumb: "Get Started", kind: "page" },
  { title: "Calendar", route: "calendar", crumb: "Primitives", kind: "comp" },
  { title: "Date Picker", route: "date-picker", crumb: "Primitives", kind: "comp" },
  { title: "Date Range Picker", route: "date-range-picker", crumb: "Primitives", kind: "comp" },
  { title: "Date Field", route: "date-field", crumb: "Primitives", kind: "comp" },
  { title: "Localization", route: "localization", crumb: "Guides", kind: "page" },
  { title: "Accessibility", route: "accessibility", crumb: "Guides", kind: "page" },
  { title: "Styling", route: "styling", crumb: "Guides", kind: "page" },
  { title: "Calendar API", route: "calendar/api", crumb: "Reference", kind: "api" },
  { title: "Date Picker API", route: "date-picker/api", crumb: "Reference", kind: "api" },
  { title: "Date Range API", route: "date-range-picker/api", crumb: "Reference", kind: "api" },
  { title: "Date Field API", route: "date-field/api", crumb: "Reference", kind: "api" },
  { title: "Changelog", route: "changelog", crumb: "Get Started", kind: "page" },
];

/* flat route order for prev/next navigation */
export const ORDER: string[] = NAV.flatMap((g) => g.items.map((i) => i.route));

export function titleForRoute(route: string): string {
  for (const g of NAV) for (const it of g.items) if (it.route === route) return it.label;
  return route;
}

/* helper: routes that map to /[slug] dynamic pages (non-component guides) */
export const GUIDE_ROUTES = ["installation", "quickstart", "changelog", "localization", "accessibility", "styling"];
export const COMPONENT_ROUTES = Object.keys(COMPONENTS);
