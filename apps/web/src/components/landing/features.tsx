export function LandingFeatures() {
  return (
    <section className="border-b border-white/[0.07]">
      <div className="mx-auto max-w-[1200px] border-x border-white/[0.07]">
        <div className="border-b border-white/[0.07] px-6 py-12">
          <p className="kenos-landing-label mb-4">{"// 01 — capabilities"}</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl">
            Headless primitives that behave like infrastructure
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-zinc-500">
            Kenos ships date primitives with full keyboard support, locale rules, and compound
            composition — no theme to fight, no hidden magic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          <Cell className="md:col-span-2">
            <CellLabel index="H-01" name="headless" />
            <h3 className="mb-2 mt-4 text-xl font-bold">Zero default styles</h3>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-zinc-500">
              Every part is unstyled. Wire Tailwind, Panda CSS, CSS modules, or inline styles — the
              library never ships opinionated CSS you have to override.
            </p>
            <div className="space-y-3 font-mono text-xs">
              {[
                { name: "kenos.datepicker", ms: "0 KB", w: "8%", active: true },
                { name: "styled-ui-kit", ms: "~42 KB", w: "72%", active: false },
                { name: "theme-override", ms: "hours", w: "95%", active: false },
              ].map((row) => (
                <div key={row.name} className="flex items-center gap-3">
                  <span className="w-32 text-zinc-500">{row.name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={`h-full rounded-full ${row.active ? "bg-indigo-500" : "bg-zinc-700/40"}`}
                      style={{ width: row.w }}
                    />
                  </div>
                  <span className="w-14 text-right text-zinc-100">{row.ms}</span>
                </div>
              ))}
            </div>
          </Cell>

          <Cell>
            <CellLabel index="A-01" name="accessibility" accent />
            <h3 className="mb-2 mt-4 text-xl font-bold">WAI-ARIA</h3>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Grid pattern, roving tabindex, segmented spinbuttons, and focus traps tested for real
              scheduling flows.
            </p>
            <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded border border-white/[0.07] bg-white/[0.07]">
              {["keyboard", "focus-ring", "aria-roles", "contrast"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-500"
                >
                  <span className="h-1 w-1 rounded-full bg-zinc-300" />
                  {item}
                </div>
              ))}
            </div>
          </Cell>

          <Cell>
            <CellLabel index="L-01" name="locale" />
            <h3 className="mb-2 mt-4 text-xl font-bold">Intl-native</h3>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Week start, date order, and RTL scripts respect the native Intl API — no hand-rolled
              locale tables.
            </p>
            <div className="mt-auto flex gap-px">
              {["en-US", "pt-BR", "ja-JP", "ar", "fr-FR"].map((locale) => (
                <div
                  key={locale}
                  className="flex h-10 flex-1 items-center justify-center bg-zinc-900 font-mono text-[10px] text-zinc-500 first:rounded-l last:rounded-r"
                >
                  {locale}
                </div>
              ))}
            </div>
          </Cell>

          <Cell className="md:col-span-2 !p-0">
            <div className="grid h-full grid-cols-1 sm:grid-cols-2">
              <div className="border-b border-white/[0.07] p-6 sm:border-b-0 sm:border-r">
                <CellLabel index="TS-01" name="typescript" />
                <h3 className="mb-2 mt-4 text-xl font-bold">Typed compound API</h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  DatePicker.Root, .Input, .Calendar, .Day — full generics, strict props, and
                  inferred variants across every part.
                </p>
              </div>
              <div className="overflow-x-auto bg-[#0a0a10] p-5 font-mono text-xs leading-relaxed">
                <div className="mb-2 text-zinc-600">{"// compound composition"}</div>
                <div>
                  <span className="landing-code-keyword">import</span> {"{ DatePicker }"}{" "}
                  <span className="landing-code-keyword">from</span>{" "}
                  <span className="landing-code-string">
                    &quot;@kenos-ui/react-datepicker&quot;
                  </span>
                </div>
                <div className="mt-3">
                  <span className="landing-code-highlight">&lt;DatePicker.Root</span> mode=
                  <span className="landing-code-string">&quot;range&quot;</span>
                  <span className="landing-code-highlight">&gt;</span>
                </div>
                <div className="pl-3">
                  <span className="landing-code-highlight">&lt;DatePicker.Calendar /&gt;</span>
                </div>
                <div>
                  <span className="landing-code-highlight">&lt;/DatePicker.Root&gt;</span>
                </div>
              </div>
            </div>
          </Cell>
        </div>
      </div>
    </section>
  );
}

function Cell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col border-b border-white/[0.07] p-6 md:[&:nth-child(odd)]:border-r ${className}`}
    >
      {children}
    </div>
  );
}

function CellLabel({ index, name, accent }: { index: string; name: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      <span
        className={`rounded border px-1.5 py-0.5 ${
          accent
            ? "border-indigo-500/35 bg-indigo-500/10 text-indigo-300"
            : "border-zinc-100/20 bg-zinc-100/5 text-zinc-300"
        }`}
      >
        {index}
      </span>
      <span className="uppercase tracking-wide text-zinc-500">{name}</span>
    </div>
  );
}
