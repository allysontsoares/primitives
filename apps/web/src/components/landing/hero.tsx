"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function LandingHero() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText("npm install @kenos-ui/react-datepicker");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      <div className="relative mx-auto max-w-[1200px] border-x border-white/[0.07]">
        <div className="kenos-landing-dot-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 bg-indigo-500/10 blur-[140px]" />

        <div className="relative flex flex-col items-center px-6 pb-10 pt-16 text-center">
          <div className="mb-10 flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-zinc-900 px-2.5 py-1 text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              unstyled primitives
            </span>
            <span className="text-zinc-600">/</span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              React 19+
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            The space before
            <br />
            <span className="text-zinc-500">design.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-500 md:text-lg">
            Composable, accessible and unstyled React primitives for date and form UI. Start with
            structure. Finish with style — Tailwind, Panda, or your own CSS.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/docs/installation" className="kenos-cta">
              Get Started
            </Link>
            <button
              type="button"
              onClick={handleCopy}
              className="group flex items-center gap-2 rounded-md border border-white/[0.07] px-4 py-3 font-mono text-sm text-zinc-500 transition-all duration-200 hover:border-white/15 hover:bg-zinc-900"
            >
              <span className="text-zinc-300">$</span>
              <span>npm install @kenos-ui/react-datepicker</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="ml-1 h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100"
              >
                {copied ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <>
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="relative border-t border-white/[0.07]">
          <div className="grid grid-cols-1 items-center md:grid-cols-[1fr_auto_1fr]">
            <div className="hidden flex-col items-end gap-6 p-8 font-mono text-[11px] text-zinc-500 md:flex">
              <ConnectorLabel symbol="┌" name="@kenos-ui/react-datepicker" side="right" />
              <ConnectorLabel symbol="{}" name="compound parts" side="right" />
              <ConnectorLabel symbol="</>" name="@kenos-ui/react" side="right" />
            </div>

            <div className="relative flex items-center justify-center py-6">
              <div className="absolute h-[200px] w-[300px] bg-zinc-100/10 blur-[80px]" />
              <Image
                src="/hero-iso.png"
                alt="Kenos layered primitive architecture diagram"
                width={360}
                height={300}
                className="relative h-auto w-[280px] select-none md:w-[340px]"
                priority
              />
            </div>

            <div className="hidden flex-col items-start gap-6 p-8 font-mono text-[11px] text-zinc-500 md:flex">
              <ConnectorLabel symbol="◇" name="zero default CSS" side="left" accent />
              <ConnectorLabel symbol="⚡" name="Intl + timescape" side="left" />
              <ConnectorLabel symbol="✓" name="WAI-ARIA" side="left" accent />
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07]">
          <div className="flex flex-col items-center md:flex-row">
            <div className="kenos-landing-label w-full whitespace-nowrap border-b border-white/[0.07] px-6 py-5 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500 md:w-auto md:border-b-0 md:border-r md:text-left">
              {"// built for scheduling UI"}
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 opacity-50">
              {["Calendar", "Date Picker", "Range Picker", "Date Field", "Select"].map((item) => (
                <span key={item} className="text-sm font-semibold text-zinc-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectorLabel({
  symbol,
  name,
  side,
  accent,
}: {
  symbol: string;
  name: string;
  side: "left" | "right";
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${side === "right" ? "flex-row" : "flex-row-reverse"}`}
    >
      <span
        className={`rounded border border-white/[0.07] bg-zinc-900 px-1.5 py-0.5 ${accent ? "border-indigo-500/30 text-indigo-300" : "text-zinc-400"}`}
      >
        {symbol}
      </span>
      <span>{name}</span>
      <span className="h-px w-8 bg-white/[0.07]" />
    </div>
  );
}
