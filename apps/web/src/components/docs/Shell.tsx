"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { NAV, SEARCH, COMPONENTS, type SearchEntry } from "../../lib/docs-data";

/* ---------------- helpers ---------------- */
function routeToHref(route: string) {
  return route === "" ? "/" : `/${route}`;
}
function pathToRoute(pathname: string) {
  return pathname === "/" ? "" : pathname.replace(/^\//, "");
}

/* ---------------- icons ---------------- */
const Search = ({ s = 16 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);
const Moon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);
const Sun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const Menu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
const DocIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
const CompIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const ApiIco = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </svg>
);
const kindIco = (k: SearchEntry["kind"]) => (k === "comp" ? <CompIco /> : k === "api" ? <ApiIco /> : <DocIco />);

/* ============================ THEME ============================ */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const t = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(t);
  }, []);
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("kairo-theme", next);
      } catch {}
      return next;
    });
  }, []);
  return { theme, toggle };
}

/* ============================ SEARCH MODAL ============================ */
function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = q.trim()
    ? SEARCH.filter(
        (s) => s.title.toLowerCase().includes(q.toLowerCase()) || s.crumb.toLowerCase().includes(q.toLowerCase()),
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
        className="w-[min(580px,92vw)] animate-pop overflow-hidden rounded-2xl border border-line-strong bg-card shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-[18px] py-4 text-muted">
          <Search />
          <input
            ref={inputRef}
            placeholder="Search docs…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            className="flex-1 border-none bg-transparent text-base text-ink outline-none"
          />
          <kbd className="rounded-md border border-line bg-[var(--kbd-bg)] px-1.5 py-0.5 font-mono text-[11px] text-muted">
            Esc
          </kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">No results for &ldquo;{q}&rdquo;</div>
          ) : (
            Object.entries(groups).map(([crumb, items]) => (
              <div key={crumb}>
                <div className="px-3 pb-1.5 pt-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
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
                        idx === sel ? "bg-hover-strong" : ""
                      }`}
                    >
                      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg border border-line bg-subtle text-muted">
                        {kindIco(r.kind)}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink">{r.title}</span>
                        <span className="block text-xs text-muted">{r.crumb}</span>
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
function Topbar({
  onSearch,
  onMenu,
  theme,
  toggleTheme,
}: {
  onSearch: () => void;
  onMenu: () => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}) {
  const iconBtn =
    "grid min-h-9 min-w-9 place-items-center rounded-[9px] border border-transparent text-ink2 transition-colors hover:bg-hover hover:text-ink";
  return (
    <header className="sticky top-0 z-[60] grid h-[var(--topbar-h)] grid-cols-[1fr_auto] items-center border-b border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] px-3.5 backdrop-blur-[14px] backdrop-saturate-150 md:grid-cols-[var(--sidebar-w)_1fr_auto] md:px-[22px]">
      <Link href="/" className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight">
        <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-ink text-[14px] font-extrabold tracking-tighter text-bg">
          K
        </span>
        Kairo
        <span className="ml-0.5 rounded-full border border-line px-1.5 py-px font-mono text-[11px] font-medium text-muted">
          v1.0
        </span>
      </Link>

      <nav className="hidden items-center justify-center gap-1 md:flex">
        {[
          { label: "Docs", href: "/" },
          { label: "GitHub", href: "https://github.com/at5/kairo" },
          { label: "npm", href: "https://www.npmjs.com/package/@at5/kairo" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink2 transition-colors hover:bg-hover hover:text-ink"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-self-end gap-2.5">
        <button className={`${iconBtn} md:hidden`} onClick={onMenu} aria-label="Menu">
          <Menu />
        </button>
        <button
          onClick={onSearch}
          aria-label="Search"
          className="flex h-9 min-w-9 items-center gap-2.5 rounded-[10px] border border-line bg-subtle px-2 text-[13.5px] text-muted transition-colors hover:border-line-strong md:min-w-[230px] md:pl-3"
        >
          <Search />
          <span className="hidden md:inline">Search docs…</span>
          <kbd className="ml-auto hidden rounded-md border border-line bg-[var(--kbd-bg)] px-1.5 py-0.5 font-mono text-[11px] text-muted md:inline">
            ⌘K
          </kbd>
        </button>
        <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? <Sun /> : <Moon />}
        </button>
        <a
          href="https://github.com/at5/kairo"
          target="_blank"
          rel="noreferrer"
          className="hidden h-9 items-center rounded-[10px] bg-ink px-4 text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-90 sm:inline-flex"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}

/* ============================ SIDEBAR ============================ */
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const route = pathToRoute(usePathname());
  return (
    <nav
      aria-label="Documentation"
      className={`sticky top-[var(--topbar-h)] z-50 h-[calc(100vh-var(--topbar-h))] overflow-y-auto border-r border-line py-6 pl-[22px] pr-4 max-md:fixed max-md:left-0 max-md:w-[280px] max-md:bg-bg max-md:transition-transform ${
        open ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      } md:block`}
    >
      {NAV.map((group) => (
        <div key={group.title} className="mb-[22px]">
          <div className="mb-1 flex items-center gap-2 px-2.5 py-1 text-xs font-bold text-ink">
            {group.title}
            {group.badge && (
              <span className="rounded-full border border-accent-line px-1.5 text-[10px] font-semibold leading-normal text-accent">
                {group.badge}
              </span>
            )}
          </div>
          {group.items.map((item) => {
            const isComp = Object.keys(COMPONENTS).includes(item.route);
            const active = route === item.route || route === item.route + "/api";
            const itemCls = (on: boolean) =>
              `flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-[13.5px] transition-colors ${
                on ? "bg-hover-strong font-semibold text-ink" : "text-muted hover:bg-hover hover:text-ink"
              }`;
            return (
              <div key={item.route}>
                <Link href={routeToHref(item.route)} onClick={onClose} className={itemCls(active)}>
                  {item.label}
                </Link>
                {active && isComp && (
                  <div className="ml-[18px] mt-0.5 mb-1 flex flex-col gap-px border-l border-line pl-3">
                    <Link
                      href={routeToHref(item.route)}
                      onClick={onClose}
                      className={`${itemCls(route === item.route)} text-[13px]`}
                    >
                      Overview
                    </Link>
                    <Link
                      href={routeToHref(item.route + "/api")}
                      onClick={onClose}
                      className={`${itemCls(route === item.route + "/api")} text-[13px]`}
                    >
                      API Reference
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/* ============================ TOC (right rail, scrollspy) ============================ */
type TocItem = { id: string; text: string; level: number };

function Toc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const main = document.getElementById("docs-content");
      if (!main) return setItems([]);
      const found: TocItem[] = [];
      main.querySelectorAll("h2[id], h3[id]").forEach((h) => {
        found.push({ id: h.id, text: h.textContent || "", level: h.tagName === "H3" ? 3 : 2 });
      });
      setItems(found);
    }, 60);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!items.length) return;
    const onScroll = () => {
      let cur = "";
      items.forEach((it) => {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top < 120) cur = it.id;
      });
      setActiveId(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  };

  if (!items.length) return <aside className="hidden xl:block" />;

  return (
    <aside className="sticky top-[var(--topbar-h)] hidden h-[calc(100vh-var(--topbar-h))] overflow-y-auto py-12 pl-1.5 pr-[22px] xl:block">
      <div className="mb-3 text-[13px] font-bold text-ink">On this page</div>
      <div className="flex flex-col gap-0.5 border-l border-line">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => scrollTo(it.id)}
            className={`-ml-px border-l py-1 text-left leading-snug transition-colors ${
              it.level === 3 ? "pl-[26px] text-[12.5px]" : "pl-3.5 text-[13px]"
            } ${it.id === activeId ? "border-accent font-medium text-accent" : "border-transparent text-muted hover:text-ink"}`}
          >
            {it.text}
          </button>
        ))}
      </div>
    </aside>
  );
}

/* ============================ SHELL ============================ */
export function DocsShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

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
      <Topbar
        onSearch={() => setSearchOpen(true)}
        onMenu={() => setSidebarOpen((o) => !o)}
        theme={theme}
        toggleTheme={toggle}
      />
      <div className="grid items-start md:grid-cols-[var(--sidebar-w)_minmax(0,1fr)] xl:grid-cols-[var(--sidebar-w)_minmax(0,1fr)_var(--toc-w)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0">
          <div id="docs-content" className="mx-auto max-w-[760px] px-5 pb-28 pt-10 sm:px-10 sm:pt-[46px]">
            {children}
          </div>
        </main>
        <Toc />
      </div>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
