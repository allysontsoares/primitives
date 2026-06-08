/* ============================================================
   Site data: navigation tree, component metadata, anatomy,
   API reference, search index. Kenos UI documentation site data.
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

export type ComponentDocFeatures = {
  /** Show locale switcher + localized demo (datepicker family). */
  localeExamples?: boolean;
  /** Dialog interop example section (inline Content inside a modal). */
  dialogInterop?: boolean;
  /** Native form + HiddenSelect example. */
  forms?: boolean;
  /** Multiple selection example section. */
  multiple?: boolean;
  /** Portal + custom container example section. */
  portal?: boolean;
};

export type ComponentMeta = {
  name: string;
  eyebrow: string;
  desc: string;
  demo: DemoKind;
  parts: AnatomyNode[];
  /** npm package for install/import copy. */
  npmPackage: string;
  /** Public namespace (DatePicker, Select, …). */
  importName: string;
  features?: ComponentDocFeatures;
};

export type DemoKind = "calendar" | "date-picker" | "date-range-picker" | "date-field" | "select";

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
      { label: "Select", route: "select" },
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
];

export const COMPONENTS: Record<string, ComponentMeta> = {
  calendar: {
    name: "Calendar",
    eyebrow: "Primitive",
    desc: "A composable month grid built on the WAI-ARIA grid pattern (via DatePicker.Root + calendar parts), with full keyboard navigation and roving focus. Use inside DatePicker.Root (even for standalone use).",
    demo: "calendar",
    npmPackage: "@kenos-ui/react-datepicker",
    importName: "DatePicker",
    features: { localeExamples: true },
    parts: [
      {
        tag: "DatePicker.Root",
        note: "state owner (mode, locale, value etc.)",
        children: [
          {
            tag: "DatePicker.ViewControl",
            children: [
              { tag: "DatePicker.PrevTrigger", leaf: true },
              { tag: "DatePicker.ViewTrigger", leaf: true },
              { tag: "DatePicker.NextTrigger", leaf: true },
            ],
          },
          {
            tag: "DatePicker.View view=\"day\"",
            children: [
              {
                tag: "DatePicker.Grid",
                note: "table[role=grid]",
                children: [
                  { tag: "DatePicker.WeekDays", leaf: true },
                  {
                    tag: "DatePicker.Day (render prop)",
                    note: "the cell (td[role=gridcell] with data-*); use children for custom content",
                  },
                ],
              },
            ],
          },
          { tag: "DatePicker.View view=\"month\"", note: "MonthGrid + MonthCell" },
          { tag: "DatePicker.View view=\"year\"", note: "YearGrid + YearCell" },
        ],
      },
    ],
  },
  "date-picker": {
    name: "Date Picker",
    eyebrow: "Primitive",
    desc: "An input (segmented) paired with a popover calendar. Use DatePicker.Root + Input + Trigger + Content (positioning & state built-in). Zero CSS shipped.",
    demo: "date-picker",
    npmPackage: "@kenos-ui/react-datepicker",
    importName: "DatePicker",
    features: { localeExamples: true, dialogInterop: true },
    parts: [
      {
        tag: "DatePicker.Root (mode=\"single\")",
        children: [
          { tag: "DatePicker.Label", leaf: true },
          { tag: "DatePicker.Input", note: "the segmented field (timescape)" },
          { tag: "DatePicker.Trigger", leaf: true },
          {
            tag: "DatePicker.Content",
            note: "popover (floating + focus trap + portal)",
            children: [
              { tag: "DatePicker.Calendar", note: "shorthand, or manual ViewControl + Grid + Day etc." },
            ],
          },
        ],
      },
    ],
  },
  "date-range-picker": {
    name: "Date Range Picker",
    eyebrow: "Primitive",
    desc: "Select a start and end date with live range preview and dual-segment input (mode=\"range\" on the same Root). Presets are custom UI you compose.",
    demo: "date-range-picker",
    npmPackage: "@kenos-ui/react-datepicker",
    importName: "DatePicker",
    features: { localeExamples: true },
    parts: [
      {
        tag: "DatePicker.Root mode=\"range\"",
        children: [
          { tag: "DatePicker.Label", leaf: true },
          { tag: "DatePicker.Input index={0}", note: "start segment" },
          { tag: "DatePicker.Input index={1}", note: "end segment" },
          { tag: "DatePicker.Trigger", leaf: true },
          {
            tag: "DatePicker.Content",
            note: "popover",
            children: [
              { tag: "DatePicker.Calendar", note: "range preview via hover + data-in-range etc." },
            ],
          },
        ],
      },
    ],
  },
  select: {
    name: "Select",
    eyebrow: "Primitive",
    desc: "A headless select with combobox + listbox pattern. Interop-first defaults: modal={false}, portal={false}. Supports single and multiple selection, items prop for label maps, and Select.HiddenSelect for native form submission.",
    demo: "select",
    npmPackage: "@kenos-ui/react-select",
    importName: "Select",
    features: { dialogInterop: true, forms: true, multiple: true, portal: true },
    parts: [
      {
        tag: "Select.Root",
        children: [
          { tag: "Select.Label", leaf: true },
          {
            tag: "Select.Trigger",
            children: [
              { tag: "Select.Value", leaf: true },
              { tag: "Select.Icon", leaf: true },
              { tag: "Select.ClearTrigger", note: "clears value without opening listbox" },
            ],
          },
          {
            tag: "Select.Portal",
            note: "optional — portal to body or custom container",
            children: [
              {
                tag: "Select.Positioner",
                note: "floating-ui anchor (side, align, sameWidth)",
                children: [
                  {
                    tag: "Select.Content",
                    note: "listbox container (inline when Portal omitted)",
                    children: [
                      { tag: "Select.Backdrop", note: "only when modal={true}" },
                      { tag: "Select.ScrollUpButton", note: "long lists" },
                      {
                        tag: "Select.List",
                        children: [{ tag: "Select.Item value=…", note: "registers in store" }],
                      },
                      { tag: "Select.ScrollDownButton", note: "long lists" },
                    ],
                  },
                ],
              },
            ],
          },
          { tag: "Select.HiddenSelect", note: "native <select> for forms" },
        ],
      },
    ],
  },
  "date-field": {
    name: "Date Field",
    eyebrow: "Primitive",
    desc: "A segmented text input (powered by DatePicker.Input inside a minimal Root). Locale-aware order/separators via Intl. No calendar required — just omit Content/Trigger.",
    demo: "date-field",
    npmPackage: "@kenos-ui/react-datepicker",
    importName: "DatePicker",
    features: { localeExamples: true },
    parts: [
      {
        tag: "DatePicker.Root",
        children: [
          { tag: "DatePicker.Label", leaf: true },
          { tag: "DatePicker.Input", note: "segmented spinbuttons (data-segment, role=spinbutton)" },
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
        {
          name: "value / defaultValue / onValueChange",
          type: "Date | null (single) or DateRange / Date[] (range/multiple)",
          desc: "Controlled/uncontrolled value. Use on the Root (mode controls shape).",
        },
        {
          name: "locale",
          type: "string",
          def: '"en-US" or navigator.language',
          desc: "BCP 47 tag. Drives segment order, separators, weekday/month names, and week start.",
        },
        {
          name: "weekStartsOn",
          type: "0 – 6",
          def: "derived from locale via Intl",
          desc: "Override first day of week.",
        },
        { name: "minDate / maxDate", type: "Date", desc: "Clamp the selectable range." },
        {
          name: "disabled",
          type: "boolean | (date: Date) => boolean",
          desc: "Disable specific dates or the whole picker.",
        },
        { name: "readOnly", type: "boolean", desc: "Prevent edits via segments or grid." },
        { name: "mode", type: '"single" | "range" | "multiple"', def: '"single"', desc: "Selection mode (affects value shape and Input index usage)." },
      ],
    },
    {
      group: "Data attributes (on Day / gridcell)",
      attrs: true,
      props: [
        { name: "[data-selected]", desc: "Selected day(s)." },
        { name: "[data-today]", desc: "Current date." },
        { name: "[data-outside-month]", desc: "Day belongs to adjacent month." },
        { name: "[data-disabled]", desc: "Unavailable (min/max or disabled fn)." },
        { name: "[data-in-range]", desc: "Inside current range selection (range mode)." },
        { name: "[data-range-start] / [data-range-end]", desc: "Endpoints of range." },
      ],
    },
  ],
  "date-picker": [
    {
      ...rootGroup,
      props: [
        { name: "value / defaultValue / onValueChange", type: "Date | null (single) etc.", desc: "Controlled value. Shape depends on mode." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", desc: "Popover control (also auto via trigger/input)." },
        { name: "locale", type: "string", def: '"en-US"', desc: "Drives segments order, separators, labels, week start." },
        { name: "closeOnSelect", type: "boolean", def: "true for single", desc: "Auto-close after pick (false for range)." },
        { name: "minDate / maxDate / disabled / readOnly", desc: "Standard constraints." },
        { name: "mode", type: '"single" | "range" | "multiple"', desc: "Affects Input (index) and behavior." },
      ],
    },
    {
      group: "Keyboard",
      keys: true,
      props: [
        { name: "Digits in segments", desc: "Type; auto-advance when full." },
        { name: "Arrow ↑/↓ in segment", desc: "Inc/dec focused segment." },
        { name: "Arrows in grid", desc: "Move focus by day/week." },
        { name: "PageUp/Down, Home/End", desc: "Month/year nav in grid." },
        { name: "Escape", desc: "Close popover, return focus to trigger." },
      ],
    },
  ],
  "date-range-picker": [
    {
      ...rootGroup,
      props: [
        { name: "value / defaultValue / onValueChange", type: "DateRange {start,end}", desc: "Controlled range (mode=\"range\" on Root)." },
        { name: "locale / minDate / maxDate / disabled / readOnly", desc: "Same as single + range preview on hover." },
        { name: "closeOnSelect", type: "boolean", def: "false for range", desc: "Keep open until both ends chosen." },
      ],
    },
  ],
  select: [
    {
      ...rootGroup,
      props: [
        {
          name: "value / defaultValue / onValueChange",
          type: "string | null | string[]",
          desc: "Controlled/uncontrolled selected value. string[] when multiple={true}.",
        },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", desc: "Listbox open state." },
        { name: "name", type: "string", desc: "Forwarded to Select.HiddenSelect for form submit." },
        { name: "disabled / required / readOnly", type: "boolean", desc: "Root constraints." },
        { name: "modal", type: "boolean", def: "false", desc: "Opt-in focus trap + aria-modal on Content. Renders Select.Backdrop." },
        {
          name: "multiple",
          type: "boolean",
          def: "false",
          desc: "Multi-select mode. Toggle items on click; listbox stays open.",
        },
        {
          name: "items",
          type: "Record<string, string>",
          desc: "Value → label map. Resolves Select.Value labels without rendering every Item.",
        },
        {
          name: "isItemEqualToValue",
          type: "(item: string, value: string) => boolean",
          desc: "Custom comparator for non-string or object-like values.",
        },
        {
          name: "openOnFocus",
          type: "boolean",
          def: "false",
          desc: "Open the listbox when the trigger receives focus (keyboard users).",
        },
      ],
    },
    {
      group: "Content props",
      props: [
        { name: "portal", type: "boolean", def: "false", desc: "Portal to document.body — avoid inside Dialogs." },
        {
          name: "alignItemWithTrigger",
          type: "boolean",
          def: "false",
          desc: "Align popup edge with trigger (covers trigger on bottom side).",
        },
        {
          name: "container",
          type: "HTMLElement | RefObject<HTMLElement>",
          desc: "Custom portal target (e.g. Dialog.Content ref). Requires portal={true}.",
        },
        { name: "side / align / sameWidth", desc: "Floating UI positioning via @kenos-ui/utils." },
        { name: "lazyMount", type: "boolean", def: "true", desc: "Skip DOM until first open." },
        {
          name: "onOpenChangeComplete",
          type: "(open: boolean) => void",
          desc: "Fires when open transitions finish, including presence exit.",
        },
      ],
    },
    {
      group: "Parts (Tier 2–4)",
      props: [
        {
          name: "Select.ClearTrigger",
          type: "span[role=button]",
          desc: "Clears the current value without opening the listbox. Place inside Trigger.",
        },
        {
          name: "Select.ScrollUpButton / ScrollDownButton",
          type: "button",
          desc: "Scroll the list when options overflow. Auto-hidden when not needed.",
        },
        {
          name: "scrollToIndex(index)",
          type: "context method",
          desc: "Programmatically scroll the list to an item index.",
        },
      ],
    },
    {
      group: "Data attributes",
      attrs: true,
      props: [
        { name: "[data-open]", desc: "On trigger when listbox is open." },
        { name: "[data-selected]", desc: "On selected option." },
        { name: "[data-highlighted]", desc: "Keyboard/hover highlight." },
        { name: "[data-disabled]", desc: "Disabled trigger or option." },
      ],
    },
    {
      group: "Keyboard",
      keys: true,
      props: [
        { name: "Arrow ↑ / ↓", desc: "Move highlight; skips disabled items." },
        { name: "Home / End", desc: "First / last enabled option." },
        { name: "Type characters", desc: "Typeahead match on textValue." },
        { name: "Enter / Space", desc: "Select highlighted option." },
        { name: "Escape", desc: "Close listbox; stopPropagation for Dialog interop." },
      ],
    },
  ],
  "date-field": [
    {
      ...rootGroup,
      props: [
        { name: "value / defaultValue / onValueChange", type: "Date | null", desc: "Use on Root; Input commits when segments are valid." },
        { name: "locale", type: "string", desc: "Order + separator from Intl (e.g. en-GB = DD/MM/YYYY)." },
        { name: "minDate / maxDate / disabled / readOnly", desc: "Constraints flow to the segments." },
      ],
    },
    {
      group: "Keyboard (on segments)",
      keys: true,
      props: [
        { name: "0–9", desc: "Type; auto-advance on full segment." },
        { name: "Arrow ↑ / ↓", desc: "Inc/dec the focused segment (wraps)." },
        { name: "Arrow ← / → / Tab", desc: "Move between segments." },
        { name: "Backspace", desc: "Clear focused segment." },
        { name: "Escape", desc: "If popover open, closes it." },
      ],
    },
  ],
};

export type SearchEntry = {
  title: string;
  route: string;
  crumb: string;
  kind: "page" | "comp";
};

export const SEARCH: SearchEntry[] = [
  { title: "Overview", route: "", crumb: "Get Started", kind: "page" },
  { title: "Installation", route: "installation", crumb: "Get Started", kind: "page" },
  { title: "Quick Start", route: "quickstart", crumb: "Get Started", kind: "page" },
  { title: "Calendar", route: "calendar", crumb: "Primitives", kind: "comp" },
  { title: "Date Picker", route: "date-picker", crumb: "Primitives", kind: "comp" },
  { title: "Date Range Picker", route: "date-range-picker", crumb: "Primitives", kind: "comp" },
  { title: "Date Field", route: "date-field", crumb: "Primitives", kind: "comp" },
  { title: "Select", route: "select", crumb: "Primitives", kind: "comp" },
  { title: "Localization", route: "localization", crumb: "Guides", kind: "page" },
  { title: "Accessibility", route: "accessibility", crumb: "Guides", kind: "page" },
  { title: "Styling", route: "styling", crumb: "Guides", kind: "page" },
  { title: "Changelog", route: "changelog", crumb: "Get Started", kind: "page" },
];

/* flat route order for prev/next navigation */
export const ORDER: string[] = NAV.flatMap((g) => g.items.map((i) => i.route));

export function titleForRoute(route: string): string {
  for (const g of NAV) for (const it of g.items) if (it.route === route) return it.label;
  return route;
}

/* helper: routes that map to /[slug] dynamic pages (non-component guides) */
export const GUIDE_ROUTES = [
  "installation",
  "quickstart",
  "changelog",
  "localization",
  "accessibility",
  "styling",
];
export const COMPONENT_ROUTES = Object.keys(COMPONENTS);
