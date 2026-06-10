"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

const SCROLL_OFFSET = 84;

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function headingsEqual(a: TocHeading[], b: TocHeading[]): boolean {
  return (
    a.length === b.length &&
    a.every((h, i) => h.id === b[i]?.id && h.text === b[i]?.text && h.level === b[i]?.level)
  );
}

function collectHeadings(): TocHeading[] {
  const main = document.getElementById("docs-content");
  if (!main) return [];
  const found: TocHeading[] = [];
  main.querySelectorAll("h2[id], h3[id]").forEach((h) => {
    const text = h.textContent?.trim();
    if (!text || !h.id) return;
    found.push({
      id: h.id,
      text,
      level: h.tagName === "H3" ? 3 : 2,
    });
  });
  return found;
}

function scrollToHeading(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
}

/**
 * Right-rail in-page navigation (Table of Contents) for documentation pages.
 * Scans `#docs-content` for `h2[id]` / `h3[id]` and highlights the active section while scrolling.
 */
export function DocsTableOfContents() {
  const pathname = usePathname();
  const isOverview = pathname === "/docs" || pathname === "/docs/";
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState("");

  const refreshHeadings = useCallback(() => {
    const next = collectHeadings();
    setHeadings((prev) => (headingsEqual(prev, next) ? prev : next));
    setActiveId((cur) => (cur && next.some((h) => h.id === cur) ? cur : (next[0]?.id ?? "")));
  }, []);

  useEffect(() => {
    if (isOverview) {
      setHeadings([]);
      return;
    }
    const main = document.getElementById("docs-content");
    if (!main) return;

    refreshHeadings();
    const t1 = window.setTimeout(refreshHeadings, 100);
    const t2 = window.setTimeout(refreshHeadings, 400);

    let raf = 0;
    const scheduleRefresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(refreshHeadings);
    };

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(main, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [pathname, refreshHeadings, isOverview]);

  useEffect(() => {
    if (isOverview || !headings.length) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            return aTop - bTop;
          });
        const topVisible = visible[0];
        if (topVisible) {
          setActiveId(topVisible.target.id);
          return;
        }
        const passed = entries
          .filter((e) => e.boundingClientRect.top < SCROLL_OFFSET)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
        const lastPassed = passed[0];
        if (lastPassed) setActiveId(lastPassed.target.id);
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -55% 0px`, threshold: [0, 0.25, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, isOverview]);

  useEffect(() => {
    if (isOverview) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const t = window.setTimeout(() => scrollToHeading(hash, false), 120);
    return () => window.clearTimeout(t);
  }, [pathname, headings, isOverview]);

  const onLinkClick = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHeading(id);
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  if (isOverview || !headings.length) return null;

  return (
    <aside
      className="fixed top-[var(--topbar-h)] right-0 z-30 hidden h-[calc(100vh-var(--topbar-h))] w-[var(--toc-w)] overflow-y-auto overscroll-contain border-l border-transparent py-10 pl-2 pr-6 min-[1180px]:block"
      aria-label="Table of contents"
    >
      <nav>
        <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400">
          On this page
        </p>
        <ol className="m-0 list-none border-l border-zinc-200 p-0 dark:border-zinc-800">
          {headings.map((heading) => {
            const active = heading.id === activeId;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={onLinkClick(heading.id)}
                  aria-current={active ? "location" : undefined}
                  className={[
                    "-ml-px block border-l py-1.5 leading-snug transition-colors",
                    heading.level === 3 ? "pl-7 pr-2 text-[12.5px]" : "pl-4 pr-2 text-[13px]",
                    active
                      ? "border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                  ].join(" ")}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
