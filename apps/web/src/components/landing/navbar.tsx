"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KenosMark } from "@/components/docs/kenos-mark";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Primitives", href: "/#primitives" },
    { label: "Docs", href: "/docs" },
    { label: "GitHub", href: "https://github.com/allysontsoares/kenos-ui" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full border-b border-white/[0.07] bg-[#09090b] text-[11px] font-mono">
        <div className="mx-auto flex h-8 max-w-[1200px] items-center justify-between px-4 text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-zinc-300">{"//"}</span>
            <span className="hidden sm:inline">@kenos-ui/react-datepicker — published on npm</span>
            <span className="sm:hidden">@kenos-ui/react-datepicker</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            <span>registry / synced</span>
          </div>
        </div>
      </div>

      <div
        className={`w-full border-b border-white/[0.07] transition-colors duration-300 ${
          scrolled ? "bg-[#09090b]/85 backdrop-blur-md" : "bg-[#09090b]"
        }`}
      >
        <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between border-x border-white/[0.07] px-4">
          <Link href="/" className="group flex h-full items-center gap-2.5 pr-4">
            <span className="text-zinc-100">
              <KenosMark size={28} strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-100">kenos</span>
          </Link>

          <div className="hidden h-full items-center md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex h-full items-center border-l border-white/[0.07] px-4 text-[13px] text-zinc-500 transition-colors hover:text-zinc-100"
                {...(item.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden h-full items-center border-l border-white/[0.07] md:flex">
            <Link
              href="https://www.npmjs.com/org/kenos-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-center border-r border-white/[0.07] px-3 text-zinc-500 transition-colors hover:text-zinc-100"
              aria-label="npm"
            >
              <NpmIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/installation"
              className="flex h-full items-center bg-indigo-600 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="p-2 text-zinc-500 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="border-b border-white/[0.07] bg-[#09090b] px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block border-b border-white/[0.07] px-2 py-2.5 text-sm text-zinc-500 hover:text-zinc-100"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/docs/installation"
            className="mt-3 block rounded-md bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

export function GithubIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`fill-current ${className}`} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function NpmIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  );
}
