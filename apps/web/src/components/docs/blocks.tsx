"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import { type AnatomyNode, type ApiGroup, ORDER, titleForRoute } from "../../lib/docs-data";

/* ---------------- DemoStage ---------------- */
export function DemoStage({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <div
      className={`relative grid min-h-[150px] place-items-center rounded-card border border-line bg-subtle ${
        tall ? "p-9" : "px-7 py-10"
      }`}
    >
      {children}
    </div>
  );
}

/* ---------------- Example (head + demo + optional code) ---------------- */
export function Example({
  title,
  desc,
  children,
  code,
  lang = "jsx",
}: {
  title?: string;
  desc?: string;
  children: ReactNode;
  code?: string;
  lang?: string;
}) {
  const [showCode, setShowCode] = useState(false);
  return (
    <div className="my-6">
      {(title || code) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            {title && <div className="text-[15px] font-semibold text-ink">{title}</div>}
            {desc && <div className="text-[13.5px] text-muted">{desc}</div>}
          </div>
          {code && (
            <button
              onClick={() => setShowCode((s) => !s)}
              className="min-h-9 rounded-[9px] border border-line-strong bg-transparent px-3.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hover"
            >
              {showCode ? "Hide code" : "View code"}
            </button>
          )}
        </div>
      )}
      {children}
      {showCode && code && <CodeBlock code={code} lang={lang} />}
    </div>
  );
}

/* ---------------- Copy Page split button (Ark UI style) ---------------- */
export function CopyPage() {
  const [open, setOpen] = useState(false);
  const item = (icon: ReactNode, labelText: string) => (
    <button
      onClick={() => setOpen(false)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] text-ink transition-colors hover:bg-hover"
    >
      {icon}
      {labelText}
    </button>
  );
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <div className="inline-flex items-stretch overflow-hidden rounded-[10px] border border-line-strong bg-subtle">
        <button className="inline-flex min-h-9 items-center gap-2 px-3.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hover">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          Copy Page
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="More copy options"
          className="grid w-[34px] place-items-center border-l border-line text-ink transition-colors hover:bg-hover"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[232px] rounded-[12px] border border-line-strong bg-card p-1.5 shadow-pop">
          {item(
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M4 4h16v16H4z" />
              <path d="M8 8h2v8M14 8h2M16 8v8" />
            </svg>,
            "View as Markdown",
          )}
          {item(
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="12" cy="12" r="9" />
            </svg>,
            "Open in ChatGPT",
          )}
          {item(
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M12 3l9 16H3z" />
            </svg>,
            "Open in Claude",
          )}
        </div>
      )}
    </div>
  );
}

export function ActionRow() {
  const link = "inline-flex items-center gap-1.5 text-[13.5px] text-muted transition-colors hover:text-ink";
  return (
    <div className="mb-6 flex flex-wrap items-center gap-[18px]">
      <button className={link}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        Copy for LLM
      </button>
      <div className="h-3.5 w-px bg-line" />
      <button className={link}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="M4 4h16v16H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
        View as Markdown
      </button>
    </div>
  );
}

/* ---------------- Anatomy diagram (recursive nested boxes) ---------------- */
function AnatomyBox({ node }: { node: AnatomyNode }) {
  const leafRow = node.children && node.children.length > 1 && node.children.every((c) => c.leaf);
  return (
    <div
      className={`relative rounded-[10px] border p-3 ${
        node.leaf ? "border-solid border-line bg-card" : "border-dashed border-line-strong"
      }`}
    >
      <span
        className={`absolute -top-2.5 left-3.5 px-2 font-mono text-[11.5px] font-semibold ${
          node.leaf ? "bg-card text-ink2" : "bg-subtle text-accent"
        }`}
      >
        {node.tag}
      </span>
      {node.note && <div className="px-0.5 pt-1 text-xs text-muted">{node.note}</div>}
      {node.children && (
        <div className={leafRow ? "mt-4 flex flex-col gap-2.5 sm:flex-row" : "mt-4 flex flex-col gap-2.5"}>
          {node.children.map((c, i) => (
            <div key={i} className={leafRow ? "flex-1" : ""}>
              <AnatomyBox node={c} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Anatomy({ parts }: { parts: AnatomyNode[] }) {
  return (
    <div className="my-[18px] rounded-card border border-line bg-subtle p-6 sm:p-[30px]">
      {parts.map((p, i) => (
        <AnatomyBox key={i} node={p} />
      ))}
    </div>
  );
}

/* ---------------- prev / next footer ---------------- */
export function PageNav({ route }: { route: string }) {
  const base = route.replace(/\/api$/, "");
  const idx = ORDER.indexOf(base);
  if (idx === -1) return null;
  const prev = ORDER[idx - 1];
  const next = ORDER[idx + 1];
  const href = (r: string) => (r === "" ? "/" : `/${r}`);
  const card = "rounded-card border border-line p-4 transition-colors hover:border-line-strong";
  return (
    <div className="mt-[72px] grid grid-cols-1 gap-4 border-t border-line pt-7 sm:grid-cols-2">
      {prev != null ? (
        <Link href={href(prev)} className={card}>
          <div className="mb-1 text-xs text-muted">← Previous</div>
          <div className="text-[15px] font-semibold text-ink">{titleForRoute(prev)}</div>
        </Link>
      ) : (
        <div />
      )}
      {next != null ? (
        <Link href={href(next)} className={`${card} text-right`}>
          <div className="mb-1 text-xs text-muted">Next →</div>
          <div className="text-[15px] font-semibold text-ink">{titleForRoute(next)}</div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

/* ---------------- API reference renderer ---------------- */
export function ApiReference({ groups }: { groups: ApiGroup[] }) {
  return (
    <>
      {groups.map((g, gi) => {
        const id = g.group.toLowerCase().replace(/[^a-z]+/g, "-");
        if (g.keys) {
          return (
            <section key={gi}>
              <h2 id={id} className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-ink scroll-mt-20">
                {g.group}
              </h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {g.props.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <span className="key-cap font-mono text-xs">{p.name}</span>
                      </td>
                      <td>{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        }
        if (g.attrs) {
          return (
            <section key={gi}>
              <h2 id={id} className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-ink scroll-mt-20">
                {g.group}
              </h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>On part</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {g.props.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>
                        <span className="font-mono text-xs">{p.type}</span>
                      </td>
                      <td>{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        }
        return (
          <section key={gi}>
            <h2 id={id} className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-ink scroll-mt-20">
              {g.group}
            </h2>
            <div>
              {g.props.map((p, i) => (
                <div key={i} className="border-t border-line py-5 first-of-type:border-line-strong">
                  <div className="mb-2 flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-sm font-semibold text-ink">{p.name}</span>
                    {p.type && (
                      <span className="rounded-md border border-line bg-subtle px-1.5 py-px font-mono text-[12.5px] text-[var(--syntax-fn)]">
                        {p.type}
                      </span>
                    )}
                    {p.def != null && (
                      <span className="text-[12.5px] text-muted">
                        default: <code className="font-mono text-ink2">{p.def}</code>
                      </span>
                    )}
                    {p.required && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">Required</span>
                    )}
                  </div>
                  <p className="m-0 max-w-[64ch] text-[13.5px] text-ink2">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* shared data-table styles need the class for first-child mono — provide via globals utility */
