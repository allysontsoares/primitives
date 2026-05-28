import React, { useState } from "react";
import { DatePicker } from "@at5/kairo";
import { Calendar } from "./components/Calendar";
import { Field } from "./components/Field";

const LOCALES = [
  { value: "en-US", label: "en-US" },
  { value: "en-GB", label: "en-GB" },
  { value: "pt-BR", label: "pt-BR" },
  { value: "fr-FR", label: "fr-FR" },
  { value: "ja-JP", label: "ja-JP" },
  { value: "ar", label: "ar" },
];

type Tab = "single" | "range" | "multiple";

function fmt(date: Date | null) {
  return date
    ? date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";
}

// ─── Single ──────────────────────────────────────────────────────────────────

function SingleDemo({ locale }: { locale: string }) {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <div className="space-y-4">
      <DatePicker.Root
        mode="single"
        locale={locale}
        defaultValue={new Date()}
        onValueChange={setValue}
      >
        <Field label="Date" />
        <Calendar />
      </DatePicker.Root>
      <p className="text-xs text-zinc-500">
        Selected: <span className="font-mono text-zinc-300">{fmt(value)}</span>
      </p>
    </div>
  );
}

// ─── Range ───────────────────────────────────────────────────────────────────

function RangeDemo({ locale }: { locale: string }) {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  return (
    <div className="space-y-4">
      <DatePicker.Root mode="range" locale={locale} onValueChange={setRange}>
        <div className="flex flex-wrap gap-4">
          <Field label="Start" index={0} />
          <Field label="End" index={1} />
        </div>
        <Calendar />
      </DatePicker.Root>
      <p className="text-xs text-zinc-500">
        Range:{" "}
        <span className="font-mono text-zinc-300">
          {fmt(range.start)} → {fmt(range.end)}
        </span>
      </p>
    </div>
  );
}

// ─── Multiple ─────────────────────────────────────────────────────────────────

function MultipleDemo({ locale }: { locale: string }) {
  const [dates, setDates] = useState<Date[]>([]);

  return (
    <div className="space-y-4">
      <DatePicker.Root mode="multiple" locale={locale} onValueChange={setDates}>
        <Field label="Date" />
        <Calendar />
      </DatePicker.Root>
      <p className="text-xs text-zinc-500">
        Selected ({dates.length}):{" "}
        <span className="font-mono text-zinc-300">
          {dates.length === 0 ? "none" : dates.map((d) => fmt(d)).join(", ")}
        </span>
      </p>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

const tabs: { id: Tab; label: string }[] = [
  { id: "single", label: "Single" },
  { id: "range", label: "Range" },
  { id: "multiple", label: "Multiple" },
];

export function App() {
  const [tab, setTab] = useState<Tab>("single");
  const [locale, setLocale] = useState("en-US");

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Kairo Playground</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Headless date picker primitive — zero dependencies on styling.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-zinc-800 p-0.5 gap-0.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 focus:border-blue-500 focus:outline-none"
          >
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Demo panel */}
        <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          {tab === "single" && <SingleDemo key={locale} locale={locale} />}
          {tab === "range" && <RangeDemo key={locale} locale={locale} />}
          {tab === "multiple" && <MultipleDemo key={locale} locale={locale} />}
        </div>
      </div>
    </div>
  );
}
