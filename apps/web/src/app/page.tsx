"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoDatePicker } from "../components/DemoDatePicker";

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("pnpm add @at5/kairo");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Dynamic Aero Ambient Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-24 text-center z-10 flex flex-col items-center">
        {/* Release Pill */}
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md animate-fade-in shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
          Kairo 0.1.0 · Now in Open Beta
        </span>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.1] max-w-3xl">
          Date primitives
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(99,102,241,0.15)]">
            done right
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Kairo is a headless, unstyled React primitive library for building highly accessible, locale-aware date pickers, calendar grids, and scheduling interfaces.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full max-w-sm sm:max-w-none">
          <Link
            href="/docs/getting-started"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Get started
          </Link>
          <Link
            href="/docs/api"
            className="w-full sm:w-auto rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md transition-all duration-200"
          >
            Explore API
          </Link>
        </div>

        {/* Copyable Installation Terminal */}
        <button
          onClick={handleCopy}
          className="mt-10 flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700/80 px-5 py-3.5 font-mono text-xs text-zinc-300 w-fit cursor-pointer transition-all duration-200 shadow-lg active:scale-98 select-none"
        >
          <span className="text-zinc-500">$</span>
          <span>pnpm add @at5/kairo</span>
          <span className="h-4 w-[1px] bg-zinc-800 mx-1" />
          <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 min-w-[50px] text-right">
            {copied ? "Copied! ✓" : "Copy"}
          </span>
        </button>
      </section>

      {/* Bring your own styles section (Interactive Demo) */}
      <section className="relative mx-auto max-w-6xl px-6 py-24 z-10 border-t border-zinc-900/80 bg-zinc-950/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">Bring your own styles</h2>
          <p className="mt-4 text-base text-zinc-400">
            Kairo ships zero CSS. Apply Tailwind, CSS modules, or native CSS. Wire up popovers, animations, and layouts exactly as you envision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Interactive Preview Container */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-8 flex flex-col items-center justify-center min-h-[420px] backdrop-blur-xl shadow-xl hover:border-zinc-800 transition-colors">
            <DemoDatePicker />
          </div>

          {/* Core Snippet Code Box */}
          <div className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-center h-full max-h-[420px] overflow-hidden select-text">
            <div className="absolute top-4 left-6 flex gap-1.5 select-none">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <pre className="overflow-y-auto mt-6 text-[11px] leading-relaxed text-zinc-300 custom-scrollbar select-text">
              <code>{EXAMPLE}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Feature Highlight Grid */}
      <section className="relative border-t border-zinc-900/80 bg-zinc-950/50 py-24 z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-zinc-900 bg-zinc-950 p-8 hover:-translate-y-1 hover:border-zinc-800/80 hover:bg-zinc-900/20 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/80 border border-zinc-850 group-hover:border-zinc-800 group-hover:bg-zinc-900 text-2xl mb-6 shadow-inner transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-450 group-hover:text-zinc-400 transition-colors">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 text-center z-10 border-t border-zinc-900/80">
        <h2 className="text-3xl font-bold text-white">Ready to compose?</h2>
        <p className="mt-4 text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
          Kairo empowers you with low-level state machines, focus traps, and keyboard grids, so you can focus entirely on your unique design aesthetics.
        </p>
        <div className="mt-8">
          <Link
            href="/docs"
            className="inline-flex rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 hover:text-white transition-all active:scale-98 shadow-md"
          >
            Start Reading the Docs
          </Link>
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: "🎨",
    title: "Unstyled by default",
    description:
      "Ships with zero opinionated CSS styles. Apply Tailwind, CSS Modules, or any styling approach without overriding defaults.",
  },
  {
    icon: "♿",
    title: "Fully accessible",
    description:
      "Adheres strictly to the WAI-ARIA grid pattern, incorporating automatic keyboard focus management and screen-reader tags.",
  },
  {
    icon: "🌍",
    title: "Locale-aware",
    description:
      "Segment sorting, visual calendars, weekday formatting, and month labeling adjust automatically to any Intl locale.",
  },
  {
    icon: "📅",
    title: "Three selection modes",
    description:
      "Engineered to facilitate Single date selection, Date Range pickers, and Multi-select grids under a unified codebase.",
  },
  {
    icon: "🔧",
    title: "Low-level API",
    description:
      "Features fine-grained components like ViewControl, PrevTrigger, Day, and YearGrid to let you craft custom layouts.",
  },
  {
    icon: "📦",
    title: "Lightweight footprint",
    description:
      "No thick external date engines required. Kairo works directly on native Date APIs, keeping bundle sizes optimized.",
  },
];

const EXAMPLE = `import { DatePicker } from "@at5/kairo";

export function CustomPicker() {
  return (
    <DatePicker.Root mode="single" locale="en-US">
      <DatePicker.Label>Date</DatePicker.Label>

      <div className="picker-input-group">
        <DatePicker.Input className="my-input" />
        <DatePicker.Trigger>📅</DatePicker.Trigger>
      </div>

      <DatePicker.Content className="my-popover">
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}`;
