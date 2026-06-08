import Image from "next/image";
import Link from "next/link";

const COMPONENTS = [
  {
    name: "Date Picker",
    slug: "date-picker",
    tag: "input",
    description:
      "Input + popover calendar with segmented fields, floating positioning, and full keyboard navigation. The common case ships as DatePicker.Calendar.",
    accent: "#fafafa",
    art: "/streak-amber.png",
    code: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root onValueChange={setDate}>
  <DatePicker.Label>Pick a date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  },
  {
    name: "Date Range",
    slug: "date-range-picker",
    tag: "range",
    description:
      "Dual-endpoint selection with live hover preview, optional presets, and in-range styling hooks for your design system.",
    accent: "#a1a1aa",
    art: "/streak-purple.png",
    code: `<DatePicker.Root mode="range" onValueChange={setRange}>
  <DatePicker.Input index={0} />
  <DatePicker.Input index={1} />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  },
  {
    name: "Date Field",
    slug: "date-field",
    tag: "segmented",
    description:
      "Spinbutton segments for day, month, and year — no calendar required. Ideal for birth dates and compact forms.",
    accent: "#d4d4d8",
    art: "/streak-green.png",
    code: `<DatePicker.Root>
  <DatePicker.Label>Date of birth</DatePicker.Label>
  <DatePicker.Input />
</DatePicker.Root>`,
  },
  {
    name: "Select",
    slug: "select",
    tag: "listbox",
    description:
      "Combobox + listbox with dialog-safe defaults, native form submission via HiddenSelect, and optional portal positioning.",
    accent: "#e4e4e7",
    art: "/streak-amber.png",
    code: `import { Select } from "@kenos-ui/react-select";

<Select.Root name="framework" defaultValue="react">
  <Select.Label>Framework</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Choose…" />
    <Select.Icon />
  </Select.Trigger>
  <Select.Content sameWidth>
    <Select.List>
      <Select.Item value="react">
        <Select.ItemText>React</Select.ItemText>
      </Select.Item>
    </Select.List>
  </Select.Content>
  <Select.HiddenSelect />
</Select.Root>`,
  },
];

export function LandingComponentShowcase() {
  return (
    <section id="primitives" className="border-b border-white/[0.07]">
      <div className="mx-auto max-w-[1200px] border-x border-white/[0.07]">
        <div className="border-b border-white/[0.07] px-6 py-12">
          <p className="kenos-landing-label mb-4">{"// 02 — primitives"}</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl">
            Five primitives. One coherent system.
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-zinc-500">
            Calendar, Date Picker, Range Picker, Date Field, and Select — each documented, typed, and
            ready for your CSS.
          </p>
        </div>

        <div>
          {COMPONENTS.map((comp) => (
            <article
              key={comp.name}
              className="group grid grid-cols-1 border-b border-white/[0.07] last:border-b-0 lg:grid-cols-2"
            >
              <div className="flex flex-col border-white/[0.07] p-8 lg:border-r">
                <div className="mb-5 flex items-center gap-2 font-mono text-[11px]">
                  <span
                    className="rounded border px-1.5 py-0.5"
                    style={{
                      color: comp.accent,
                      borderColor: `${comp.accent}40`,
                      background: `${comp.accent}12`,
                    }}
                  >
                    {comp.tag}
                  </span>
                  <span className="text-zinc-500">kenos/{comp.slug}</span>
                </div>

                <h3 className="mb-3 text-2xl font-bold">{comp.name}</h3>
                <p className="max-w-md text-sm leading-relaxed text-zinc-500">{comp.description}</p>

                <div className="mt-auto flex items-center gap-6 pt-8">
                  <Link
                    href={`/docs/${comp.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-100 transition-all hover:gap-2.5"
                  >
                    Explore {comp.name}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[280px] overflow-hidden">
                <Image src={comp.art} alt="" fill className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#09090b]/20 to-[#09090b]/70" />
                <div className="relative flex h-full items-center p-6">
                  <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#0a0a10]/85 shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="ml-2 font-mono text-[11px] text-white/40">{comp.slug}.tsx</span>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100/90">
                      {comp.code}
                    </pre>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-8">
          <p className="font-mono text-xs text-zinc-500">{"// calendar + guides in docs"}</p>
          <Link
            href="/docs/calendar"
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.07] px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-zinc-100/30 hover:bg-zinc-900"
          >
            View all primitives
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}