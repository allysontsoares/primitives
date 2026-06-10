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
  /** Type-to-filter example section (combobox). */
  filter?: boolean;
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

export type DemoKind = "date-picker" | "select" | "combobox";

export type NavItem = { label: string; route: string; soon?: boolean };
export type NavGroup = { title: string; badge?: string; items: NavItem[] };

/** Component doc routes that appear in nav but are not published yet. */
export const SOON_ROUTES = ["select", "combobox"] as const;
export type SoonRoute = (typeof SOON_ROUTES)[number];

export function isSoonRoute(route: string): route is SoonRoute {
  return (SOON_ROUTES as readonly string[]).includes(route);
}

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
      { label: "Date Picker", route: "date-picker" },
      { label: "Select", route: "select", soon: true },
      { label: "Combobox", route: "combobox", soon: true },
    ],
  },
];

export const COMPONENTS: Record<string, ComponentMeta> = {
  "date-picker": {
    name: "Date Picker",
    eyebrow: "Primitive",
    desc: "Headless date primitives — segmented input, popover calendar, range and multiple selection, time granularity, presets, unavailable dates, HiddenInput, RTL keyboard. Built on Intl, timescape, and Floating UI. Zero CSS shipped.",
    demo: "date-picker",
    npmPackage: "@kenos-ui/react-datepicker",
    importName: "DatePicker",
    parts: [],
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
  combobox: {
    name: "Combobox",
    eyebrow: "Primitive",
    desc: "A headless combobox with type-to-filter, aria-activedescendant list navigation, and an Empty state when nothing matches. Interop-first defaults: modal={false}, inline Content anchored to the input.",
    demo: "combobox",
    npmPackage: "@kenos-ui/react-combobox",
    importName: "Combobox",
    features: { filter: true, dialogInterop: true },
    parts: [
      {
        tag: "Combobox.Root",
        children: [
          { tag: "Combobox.Label", leaf: true },
          {
            tag: "Combobox.Input",
            note: "combobox role — typing filters the list",
          },
          { tag: "Combobox.Trigger", note: "opens list without clearing filter text" },
          {
            tag: "Combobox.Content",
            note: "floating listbox (inline, no portal)",
            children: [
              {
                tag: "Combobox.List",
                children: [{ tag: "Combobox.Item value=…", note: "registers in store" }],
              },
              { tag: "Combobox.Empty", note: "shown when filter matches nothing" },
            ],
          },
          { tag: "Combobox.Clear", note: "clears value + input text" },
        ],
      },
    ],
  },
};

const rootGroup = { group: "Root props" };

export const API: Record<string, ApiGroup[]> = {
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
        {
          name: "modal",
          type: "boolean",
          def: "false",
          desc: "Opt-in focus trap + aria-modal on Content. Renders Select.Backdrop.",
        },
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
        {
          name: "portal",
          type: "boolean",
          def: "false",
          desc: "Portal to document.body — avoid inside Dialogs.",
        },
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
  combobox: [
    {
      ...rootGroup,
      props: [
        {
          name: "value / defaultValue / onValueChange",
          type: "string | null",
          desc: "Controlled/uncontrolled selected value.",
        },
        {
          name: "inputValue / defaultInputValue / onInputValueChange",
          type: "string",
          desc: "Controlled/uncontrolled filter text in the input.",
        },
        { name: "open / defaultOpen / onOpenChange", type: "boolean", desc: "Listbox open state." },
        { name: "disabled / required / readOnly", type: "boolean", desc: "Root constraints." },
        {
          name: "modal",
          type: "boolean",
          def: "false",
          desc: "Opt-in focus trap + aria-modal on Content.",
        },
        {
          name: "items",
          type: "Record<string, string>",
          desc: "Value → label map. Resolves input display when items are not mounted.",
        },
        {
          name: "isItemEqualToValue",
          type: "(item: string, value: string) => boolean",
          desc: "Custom comparator for value matching.",
        },
        {
          name: "filter",
          type: "(item: { textValue: string }, query: string) => boolean",
          desc: "Custom filter for type-to-filter. Default: case-insensitive substring on textValue.",
        },
      ],
    },
    {
      group: "Content props",
      props: [
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
      group: "Parts",
      props: [
        {
          name: "Combobox.Empty",
          type: "div",
          desc: "Rendered when the filter matches no items. Place inside Content after List.",
        },
        {
          name: "Combobox.Clear",
          type: "span[role=button]",
          desc: "Clears value and input text without opening the listbox.",
        },
      ],
    },
    {
      group: "Data attributes",
      attrs: true,
      props: [
        { name: "[data-open]", desc: "On input/trigger when listbox is open." },
        { name: "[data-selected]", desc: "On selected option." },
        { name: "[data-highlighted]", desc: "Keyboard/hover highlight." },
        { name: "[data-disabled]", desc: "Disabled input, trigger, or option." },
      ],
    },
    {
      group: "Keyboard",
      keys: true,
      props: [
        { name: "Type characters", desc: "Filter options by textValue (substring match)." },
        {
          name: "Arrow ↑ / ↓",
          desc: "Move highlight via aria-activedescendant; skips disabled items.",
        },
        { name: "Home / End", desc: "First / last enabled option." },
        { name: "Enter", desc: "Select highlighted option; closes listbox." },
        { name: "Escape", desc: "Close listbox; stopPropagation for Dialog interop." },
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
  { title: "Date Picker", route: "date-picker", crumb: "Primitives", kind: "comp" },
  { title: "Form Integration", route: "date-picker", crumb: "Date Picker", kind: "comp" },
  { title: "Time Granularity", route: "date-picker", crumb: "Date Picker", kind: "comp" },
  { title: "Presets", route: "date-picker", crumb: "Date Picker", kind: "comp" },
  { title: "Accessibility", route: "date-picker", crumb: "Date Picker", kind: "comp" },
  { title: "Changelog", route: "changelog", crumb: "Get Started", kind: "page" },
];

/* flat route order for prev/next navigation */
export const ORDER: string[] = NAV.flatMap((g) => g.items.map((i) => i.route));
export const PUBLISHED_ROUTES: string[] = ORDER.filter((r) => !isSoonRoute(r));

export function titleForRoute(route: string): string {
  for (const g of NAV) for (const it of g.items) if (it.route === route) return it.label;
  return route;
}

/* helper: routes that map to /[slug] dynamic pages (non-component guides) */
export const GUIDE_ROUTES = ["installation", "quickstart", "changelog"];
export const COMPONENT_ROUTES = Object.keys(COMPONENTS).filter((r) => !isSoonRoute(r));
