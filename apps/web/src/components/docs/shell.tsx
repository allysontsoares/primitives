"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Kbd } from "@/components/ui/kbd";
import { NAV, SEARCH, type SearchEntry } from "../../lib/docs-data";
import { pathToRoute, routeToHref } from "../../lib/docs-routes";
import { DocsTableOfContents } from "./docs-table-of-contents";
import { KenosMark } from "./kenos-mark";

/* ---------------- icons ---------------- */
const Search = ({ s = 16 }: { s?: number }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
  >
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);
const DocIco = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const CompIco = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const kindIco = (k: SearchEntry["kind"]) => (k === "comp" ? <CompIco /> : <DocIco />);

const topbarGithubLinkCls =
  "hidden sm:inline-flex h-7 shrink-0 items-center justify-center rounded-2xl border border-indigo-600/20 bg-indigo-600 px-3 text-sm font-medium text-white no-underline transition-colors hover:bg-indigo-500 dark:border-indigo-400/20 dark:bg-indigo-500 dark:hover:bg-indigo-400";

/* ============================ SEARCH MODAL ============================ */
function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = q.trim()
    ? SEARCH.filter(
        (s) =>
          s.title.toLowerCase().includes(q.toLowerCase()) ||
          s.crumb.toLowerCase().includes(q.toLowerCase()),
      )
    : SEARCH.slice(0, 8);

  const go = useCallback(
    (route: string) => {
      router.push(routeToHref(route));
      onClose();
    },
    [router, onClose],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        const r = results[sel];
        if (r) go(r.route);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const groups: Record<string, SearchEntry[]> = {};
  results.forEach((r) => (groups[r.crumb] = groups[r.crumb] || []).push(r));

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-fade items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="w-[min(580px,92vw)] animate-pop overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-[18px] py-4 text-zinc-500 dark:text-zinc-400">
          <Search />
          <input
            ref={inputRef}
            placeholder="Search docs…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            className="flex-1 border-none bg-transparent text-base text-zinc-900 dark:text-zinc-100 outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No results for &ldquo;{q}&rdquo;
            </div>
          ) : (
            Object.entries(groups).map(([crumb, items]) => (
              <div key={crumb}>
                <div className="px-3 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {crumb}
                </div>
                {items.map((r) => {
                  const idx = results.indexOf(r);
                  return (
                    <button
                      key={r.route + r.kind}
                      onMouseEnter={() => setSel(idx)}
                      onClick={() => go(r.route)}
                      className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left ${
                        idx === sel ? "bg-zinc-100 dark:bg-zinc-800" : ""
                      }`}
                    >
                      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        {kindIco(r.kind)}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {r.title}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                          {r.crumb}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================ TOPBAR ============================ */
function Topbar() {
  return (
    <header className="sticky top-0 z-[60] grid h-[var(--topbar-h)] grid-cols-[1fr_auto] items-center border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 px-3.5 backdrop-blur-[14px] backdrop-saturate-150 md:grid-cols-[var(--sidebar-w)_1fr_auto] md:px-[22px]">
      <Link href="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
        <span className="text-[var(--kenos-mark)]">
          <KenosMark size={22} strokeWidth={2.5} />
        </span>
        <span className="font-mono text-[16px] tracking-[0.04em] text-zinc-900 dark:text-zinc-100">
          kenos UI
        </span>
        <Badge variant="beta" className="ml-1 origin-left scale-[0.92]">
          Beta
        </Badge>
      </Link>

      <nav className="hidden items-center justify-center gap-1 md:flex">
        {[
          { label: "Docs", href: "/docs" },
          {
            label: "npm",
            href: "https://www.npmjs.com/package/@kenos-ui/react-datepicker",
          },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-self-end gap-2.5">
        <a
          href="https://github.com/allysontsoares/kenos-ui/tree/main/packages/datepicker"
          target="_blank"
          rel="noopener noreferrer"
          className={topbarGithubLinkCls}
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

const sidebarItemCls = (on: boolean, disabled?: boolean) =>
  `flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-[13.5px] transition-colors ${
    disabled
      ? "cursor-not-allowed text-zinc-400 opacity-60 dark:text-zinc-500"
      : on
        ? "bg-indigo-500/10 font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300"
        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
  }`;

/* ============================ SIDEBAR ============================ */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const route = pathToRoute(pathname) ?? "";
  return (
    <nav
      aria-label="Documentation"
      className={`sticky top-[var(--topbar-h)] z-50 h-[calc(100vh-var(--topbar-h))] overflow-y-auto border-r border-zinc-200 dark:border-zinc-800 py-6 pl-[22px] pr-4 max-md:fixed max-md:left-0 max-md:w-[280px] max-md:bg-white dark:bg-zinc-950 max-md:transition-transform ${
        open ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      } md:block`}
    >
      {NAV.map((group) => (
        <div key={group.title} className="mb-[22px]">
          <div className="mb-1 flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {group.title}
            {group.badge && (
              <Badge variant="status" className="h-5 px-2 text-[10px]">
                {group.badge}
              </Badge>
            )}
          </div>
          {group.items.map((item) => {
            const active = route === item.route;
            if (item.soon) {
              return (
                <span key={item.route} aria-disabled="true" className={sidebarItemCls(false, true)}>
                  <span className="flex-1">{item.label}</span>
                  <Badge variant="secondary" className="h-5 shrink-0 px-2 text-[10px]">
                    Soon
                  </Badge>
                </span>
              );
            }
            return (
              <Link
                key={item.route}
                href={routeToHref(item.route)}
                onClick={onClose}
                className={sidebarItemCls(active)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/* ============================ SHELL ============================ */
export function DocsShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const showTocRail = pathname !== "/docs" && pathname !== "/docs/";

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="grid items-start md:grid-cols-[var(--sidebar-w)_minmax(0,1fr)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`relative min-w-0 ${showTocRail ? "min-[1180px]:pr-[var(--toc-w)]" : ""}`}>
          <div
            id="docs-content"
            className="mx-auto max-w-[760px] px-5 pb-28 pt-10 sm:px-10 sm:pt-[46px]"
          >
            {children}
          </div>
          <DocsTableOfContents />
        </main>
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
