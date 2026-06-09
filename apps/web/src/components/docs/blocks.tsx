"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CodeBlock, type CodeTab } from "./code-block";
import { type ExampleSnippets } from "../../lib/example-snippets";
import { type AnatomyNode, type ApiGroup, ORDER, titleForRoute } from "../../lib/docs-data";
import { routeToHref } from "../../lib/docs-routes";
import { ANATOMY_DIAGRAMS } from "./anatomy";
import { docsTableClass } from "./docs-prose";

/* ---------------- DemoStage ---------------- */
export function DemoStage({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <div
      className={`relative grid min-h-[150px] place-items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 ${
        tall ? "p-9" : "px-7 py-10"
      }`}
    >
      {children}
    </div>
  );
}

const CodeToggleIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
  </svg>
);

function buildExampleTabs(snippets: ExampleSnippets): CodeTab[] {
  return [
    { label: "Unstyled", lang: "tsx", code: snippets.unstyled },
    { label: "CSS", lang: "tsx", code: snippets.css },
    { label: "Tailwind", lang: "tsx", code: snippets.tailwind },
    { label: "Panda CSS", lang: "tsx", code: snippets.panda },
  ];
}

/* ---------------- Example (Ark-style preview + collapsible multi-file code) ---------------- */
export function Example({
  title,
  desc,
  children,
  snippets,
  code,
  lang = "jsx",
  previewTall,
}: {
  title?: string;
  desc?: string;
  children: ReactNode;
  snippets?: ExampleSnippets;
  code?: string;
  lang?: string;
  previewTall?: boolean;
}) {
  const [showCode, setShowCode] = useState(false);
  const [styleTabsEnabled, setStyleTabsEnabled] = useState(true);

  const tabs: CodeTab[] | null = snippets
    ? buildExampleTabs(snippets)
    : code
      ? [{ label: lang === "jsx" || lang === "tsx" ? "Unstyled" : lang || "code", lang, code }]
      : null;

  const hasCode = !!tabs?.length;

  return (
    <div className="my-6">
      {(title || desc) && (
        <div className="mb-3">
          {title && (
            <div className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </div>
          )}
          {desc && <div className="text-[13.5px] text-zinc-500 dark:text-zinc-400">{desc}</div>}
        </div>
      )}

      <div className="example-card overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div
          className={`example-preview grid place-items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 ${
            previewTall ? "min-h-[220px] p-10" : "min-h-[180px] px-6 py-9"
          }`}
        >
          {children}
        </div>

        {hasCode && showCode && tabs && (
          <CodeBlock
            tabs={tabs}
            spacing="none"
            embedded
            showStyleTabs={!!snippets}
            styleTabsEnabled={styleTabsEnabled}
            onStyleTabsEnabledChange={setStyleTabsEnabled}
          />
        )}

        {hasCode && (
          <button
            type="button"
            onClick={() => setShowCode((s) => !s)}
            aria-expanded={showCode}
            className="example-code-toggle flex w-full min-h-11 items-center justify-center gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <CodeToggleIcon />
            {showCode ? "Hide Code" : "Show Code"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- Copy Page split button (Ark UI style) ---------------- */
export function CopyPage() {
  const [open, setOpen] = useState(false);
  const item = (icon: ReactNode, labelText: string) => (
    <button
      onClick={() => setOpen(false)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {icon}
      {labelText}
    </button>
  );
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <div className="inline-flex items-stretch overflow-hidden rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
        <button className="inline-flex min-h-9 items-center gap-2 px-3.5 text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          Copy Page
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="More copy options"
          className="grid w-[34px] place-items-center border-l border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 min-w-[232px] rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-1.5 shadow-lg">
          {item(
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path d="M4 4h16v16H4z" />
              <path d="M8 8h2v8M14 8h2M16 8v8" />
            </svg>,
            "View as Markdown",
          )}
          {item(
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <circle cx="12" cy="12" r="9" />
            </svg>,
            "Open in ChatGPT",
          )}
          {item(
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
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
  const link =
    "inline-flex items-center gap-1.5 text-[13.5px] text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100";
  return (
    <div className="mb-6 flex flex-wrap items-center gap-[18px]">
      <button className={link}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        Copy for LLM
      </button>
      <div className="h-3.5 w-px bg-line" />
      <button className={link}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        >
          <path d="M4 4h16v16H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
        View as Markdown
      </button>
    </div>
  );
}

/* ---------------- Anatomy diagram (Radix-style SVG) ---------------- */
function AnatomyFallback({ parts }: { parts: AnatomyNode[] }) {
  const render = (node: AnatomyNode, depth = 0) => (
    <div key={node.tag + depth} className={depth ? "ml-4 mt-2" : ""}>
      <code className="font-mono text-[12px] text-zinc-500">{node.tag}</code>
      {node.note && (
        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{node.note}</span>
      )}
      {node.children?.map((c) => render(c, depth + 1))}
    </div>
  );
  return (
    <div className="my-[18px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 p-6 font-mono text-sm">
      {parts.map((p) => render(p))}
    </div>
  );
}

export function Anatomy({ slug, parts }: { slug: string; parts: AnatomyNode[] }) {
  const Diagram = ANATOMY_DIAGRAMS[slug];
  if (Diagram) return <Diagram />;
  return <AnatomyFallback parts={parts} />;
}

/* ---------------- prev / next footer ---------------- */
export function PageNav({ route }: { route: string }) {
  const idx = ORDER.indexOf(route);
  if (idx === -1) return null;
  const prev = ORDER[idx - 1];
  const next = ORDER[idx + 1];
  const href = (r: string) => routeToHref(r);
  const card =
    "rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700";
  return (
    <div className="mt-[72px] grid grid-cols-1 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-7 sm:grid-cols-2">
      {prev != null ? (
        <Link href={href(prev)} className={card}>
          <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">← Previous</div>
          <div className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
            {titleForRoute(prev)}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next != null ? (
        <Link href={href(next)} className={`${card} text-right`}>
          <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">Next →</div>
          <div className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
            {titleForRoute(next)}
          </div>
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
              <h2
                id={id}
                className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 scroll-mt-20"
              >
                {g.group}
              </h2>
              <table className={docsTableClass}>
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
                        <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
                          {p.name}
                        </span>
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
              <h2
                id={id}
                className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 scroll-mt-20"
              >
                {g.group}
              </h2>
              <table className={docsTableClass}>
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
            <h2
              id={id}
              className="mt-14 mb-4 text-[clamp(1.4rem,1.1rem+0.8vw,1.6875rem)] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 scroll-mt-20"
            >
              {g.group}
            </h2>
            <div>
              {g.props.map((p, i) => (
                <div
                  key={i}
                  className="border-t border-zinc-200 dark:border-zinc-800 py-5 first-of-type:border-zinc-200 dark:border-zinc-800"
                >
                  <div className="mb-2 flex flex-wrap items-baseline gap-3">
                    <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {p.name}
                    </span>
                    {p.type && (
                      <span className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-px font-mono text-[12.5px] text-sky-400">
                        {p.type}
                      </span>
                    )}
                    {p.def != null && (
                      <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
                        default:{" "}
                        <code className="font-mono text-zinc-500 dark:text-zinc-400">{p.def}</code>
                      </span>
                    )}
                    {p.required && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="m-0 max-w-[64ch] text-[13.5px] text-zinc-500 dark:text-zinc-400">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
