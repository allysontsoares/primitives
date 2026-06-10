"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [start, target, duration]);

  return count;
}

function StatCell({
  value,
  suffix,
  label,
  sublabel,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="border-b border-white/[0.07] p-8 last:border-r-0 sm:border-b-0 sm:border-r">
      <div className="text-4xl font-bold tracking-tight md:text-5xl">
        {count.toLocaleString()}
        <span className="text-zinc-300">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-100">{label}</div>
      <div className="mt-1 font-mono text-xs text-zinc-500">{sublabel}</div>
    </div>
  );
}

function TestCount({ started }: { started: boolean }) {
  const count = useCountUp(147, 2500, started);
  return (
    <>
      <div className="text-6xl font-bold tabular-nums tracking-tighter text-zinc-100 md:text-8xl">
        {count.toLocaleString()}
      </div>
      <p className="mt-3 font-mono text-xs text-zinc-500">
        {"// unit and integration tests in the package"}
      </p>
    </>
  );
}

export function LandingStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="border-b border-white/[0.07]">
      <div className="relative mx-auto max-w-[1200px] border-x border-white/[0.07]">
        <div className="kenos-landing-dot-bg pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative border-b border-white/[0.07] px-6 py-12">
          <p className="kenos-landing-label mb-4">{"// 03 — quality"}</p>
          <h2 className="max-w-2xl text-balance text-3xl font-bold leading-tight md:text-4xl">
            Tested behavior, not just happy paths
          </h2>
        </div>

        <div ref={ref} className="relative border-b border-white/[0.07] px-6 py-12">
          <TestCount started={started} />
        </div>

        <div className="relative grid grid-cols-1 border-b border-white/[0.07] sm:grid-cols-3">
          <StatCell
            value={4}
            suffix=""
            label="Date primitives"
            sublabel="calendar through date field"
            start={started}
          />
          <StatCell
            value={0}
            suffix=" KB"
            label="Default CSS shipped"
            sublabel="bring your own styles"
            start={started}
          />
          <StatCell
            value={19}
            suffix="+"
            label="React version"
            sublabel="hooks and server components ready"
            start={started}
          />
        </div>

        <div className="relative px-6 py-12">
          <p className="max-w-3xl text-pretty text-xl leading-relaxed text-zinc-500 md:text-2xl">
            Our mission is to make scheduling UI{" "}
            <span className="font-semibold text-zinc-100">
              faster to build and harder to break.
            </span>
          </p>
          <Link
            href="/docs/date-picker#accessibility"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-all hover:gap-3 hover:text-indigo-300"
          >
            Read the accessibility guide
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5"
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
