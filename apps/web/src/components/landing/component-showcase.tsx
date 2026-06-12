import Image from "next/image";
import Link from "next/link";

const SHOWCASES = [
  {
    tag: "single",
    title: "Segmented input + popover",
    description:
      "DatePicker.Input gives users a native-feeling segmented editor (month / day / year) that respects the locale's order and separators. Pair it with Trigger and Content for a complete picker.",
    accent: "#6366f1",
    art: "/streak-amber.png",
    gradient: "from-indigo-600/20 via-indigo-500/5 to-[#09090b]/80",
    dots: ["#6366f1", "#818cf8", "#a5b4fc"],
    code: `import { DatePicker } from "@kenos-ui/react-datepicker";

<DatePicker.Root value={date} onValueChange={setDate}>
  <DatePicker.Label>Pick a date</DatePicker.Label>
  <DatePicker.Input />
  <DatePicker.Trigger>📅</DatePicker.Trigger>
  <DatePicker.Content portal>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  },
  {
    tag: "range",
    title: "Date range with hover preview",
    description:
      "Range mode includes live hover preview between start and end. Use two segmented inputs with index={0} and index={1}, or compose a custom summary trigger.",
    accent: "#f59e0b",
    art: "/streak-green.png",
    gradient: "from-amber-500/25 via-emerald-500/10 to-[#09090b]/80",
    dots: ["#f59e0b", "#fbbf24", "#34d399"],
    code: `import { DatePicker, type DateRange } from "@kenos-ui/react-datepicker";

const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DatePicker.Root mode="range" value={range} onValueChange={setRange}>
  <DatePicker.Input index={0} />
  <DatePicker.Input index={1} />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  },
  {
    tag: "composition",
    title: "Full calendar composition",
    description:
      "Use DatePicker.Calendar as a shorthand, or take full control with ViewControl, Grid, Day, MonthGrid, and YearGrid — including render props on Day for custom cell rendering.",
    accent: "#a78bfa",
    art: "/streak-purple.png",
    gradient: "from-violet-500/25 via-fuchsia-500/10 to-[#09090b]/80",
    dots: ["#a78bfa", "#c084fc", "#e879f9"],
    code: `<DatePicker.Root>
  <DatePicker.ViewControl>
    <DatePicker.PrevTrigger />
    <DatePicker.ViewTrigger />
    <DatePicker.NextTrigger />
  </DatePicker.ViewControl>
  <DatePicker.View view="day">
    <DatePicker.Grid header={<DatePicker.WeekDays />}>
      {({ weeks }) => weeks.map((week, i) => (
        <tr key={i}>
          {week.map((d, j) => (
            <DatePicker.Day key={j} date={d}>
              {({ isSelected }) => (
                <span className={isSelected ? "selected" : ""}>
                  {d.getDate()}
                </span>
              )}
            </DatePicker.Day>
          ))}
        </tr>
      ))}
    </DatePicker.Grid>
  </DatePicker.View>
</DatePicker.Root>`,
  },
] as const;

const ROOT_PROPS = [
  { name: "mode", value: '"single" | "range" | "multiple"', accent: "#6366f1" },
  { name: "locale", value: "Intl.Locale string", accent: "#f59e0b" },
  { name: "minDate / maxDate", value: "bounds", accent: "#34d399" },
  { name: "disabled / unavailable", value: "per-date callbacks", accent: "#f472b6" },
  { name: "modal", value: "opt-in focus trap", accent: "#a78bfa" },
  { name: "closeOnSelect", value: "popover behavior", accent: "#38bdf8" },
] as const;

export function LandingComponentShowcase() {
  return (
    <section id="api" className="border-b border-white/[0.07]">
      <div className="mx-auto max-w-[1200px] border-x border-white/[0.07]">
        <div className="border-b border-white/[0.07] px-6 py-12">
          <p className="kenos-landing-label mb-4">{"// 02 — API"}</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl">
            One compound API, three selection modes
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-zinc-500">
            Everything documented in the package README — from quick start to advanced calendar
            composition and Floating UI positioning.
          </p>
        </div>

        <div>
          {SHOWCASES.map((item, index) => (
            <article
              key={item.tag}
              className="group grid grid-cols-1 border-b border-white/[0.07] last:border-b-0 lg:grid-cols-2"
            >
              <div
                className={`flex flex-col p-8 lg:border-white/[0.07] ${index % 2 === 0 ? "lg:border-r" : "lg:order-2"}`}
              >
                <div className="mb-5 flex items-center gap-2 font-mono text-[11px]">
                  <span
                    className="rounded border px-1.5 py-0.5"
                    style={{
                      color: item.accent,
                      borderColor: `${item.accent}40`,
                      background: `${item.accent}18`,
                    }}
                  >
                    {item.tag}
                  </span>
                  <span className="text-zinc-500">@kenos-ui/react-datepicker</span>
                </div>

                <h3 className="mb-3 text-2xl font-bold">{item.title}</h3>
                <p className="max-w-md text-sm leading-relaxed text-zinc-500">{item.description}</p>
              </div>

              <div
                className={`relative min-h-[280px] overflow-hidden ${index % 2 === 0 ? "" : "lg:order-1 lg:border-r lg:border-white/[0.07]"}`}
              >
                <Image
                  src={item.art}
                  alt=""
                  fill
                  className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                <div className="relative flex h-full items-center p-6">
                  <div
                    className="w-full overflow-hidden rounded-lg border bg-[#0a0a10]/85 shadow-2xl backdrop-blur-sm"
                    style={{ borderColor: `${item.accent}30` }}
                  >
                    <div
                      className="flex items-center gap-1.5 border-b px-3 py-2"
                      style={{
                        borderColor: `${item.accent}20`,
                        background: `${item.accent}08`,
                      }}
                    >
                      {item.dots.map((dot) => (
                        <span
                          key={dot}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: dot }}
                        />
                      ))}
                      <span
                        className="ml-2 font-mono text-[11px]"
                        style={{ color: `${item.accent}99` }}
                      >
                        {item.tag}.tsx
                      </span>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-100/90">
                      {item.code}
                    </pre>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="border-t border-white/[0.07] px-6 py-10">
          <p className="kenos-landing-label mb-6">{"// key props on Root"}</p>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {ROOT_PROPS.map((prop) => (
              <div
                key={prop.name}
                className="flex items-baseline justify-between gap-4 bg-zinc-900 px-4 py-3"
              >
                <span className="font-mono text-sm" style={{ color: prop.accent }}>
                  {prop.name}
                </span>
                <span className="font-mono text-[11px] text-zinc-500">{prop.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-8">
          <p className="font-mono text-xs text-zinc-500">
            {"// Content supports side, align, portal, forceMount, avoidCollisions"}
          </p>
          <Link
            href="/docs/date-picker"
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.07] px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            Full API reference
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
