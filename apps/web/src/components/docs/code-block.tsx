"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo, useState } from "react";
import { cn } from "../../lib/utils";

/* ---------- tiny syntax highlighter (jsx / bash / css) ---------- */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "new",
  "await",
  "async",
  "typeof",
  "interface",
  "type",
  "extends",
  "implements",
  "as",
  "of",
  "in",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "class",
  "this",
]);

function highlightCss(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.endsWith("*/")) {
        return `<span class="text-zinc-500 italic">${esc(line)}</span>`;
      }
      if (trimmed.startsWith("@")) {
        return `<span class="text-violet-400">${esc(line)}</span>`;
      }
      const decl = line.match(/^(\s*)([.#\w][\w-]*(?:\s*[,\s>+~][\w.-]+)*)\s*(\{.*)?$/);
      if (decl) {
        const [, sp, sel, rest = ""] = decl;
        return `${sp ?? ""}<span class="text-rose-400">${esc(sel ?? "")}</span>${esc(rest)}`;
      }
      const prop = line.match(/^(\s*)([\w-]+)(\s*:\s*)([^;]+)(;?.*)$/);
      if (prop) {
        const [, sp, name, colon, val, tail = ""] = prop;
        return `${sp ?? ""}<span class="text-sky-400">${esc(name ?? "")}</span>${esc(colon ?? "")}<span class="text-emerald-400">${esc(val ?? "")}</span>${esc(tail)}`;
      }
      return esc(line);
    })
    .join("\n");
}

export function highlight(code: string, lang = ""): string {
  if (lang === "css") return highlightCss(code);
  if (lang === "bash" || lang === "sh") {
    return code
      .split("\n")
      .map((line) => {
        if (/^\s*#/.test(line)) return `<span class="text-zinc-500 italic">${esc(line)}</span>`;
        const m = line.match(/^(\s*)(\S+)(.*)$/);
        if (!m) return esc(line);
        return `${m[1]}<span class="text-sky-400">${esc(m[2] ?? "")}</span><span class="text-zinc-300">${esc(m[3] ?? "")}</span>`;
      })
      .join("\n");
  }
  let out = "";
  const tokenRe =
    /(\/\/[^\n]*)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\sA-Za-z0-9_$])/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(code))) {
    if (m[1]) out += `<span class="text-zinc-500 italic">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="text-emerald-400">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="text-amber-400">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      const after = code.slice(tokenRe.lastIndex).match(/^\s*\(/);
      if (KW.has(w)) out += `<span class="text-violet-400">${w}</span>`;
      else if (/^[A-Z]/.test(w)) out += `<span class="text-rose-400">${w}</span>`;
      else if (after) out += `<span class="text-sky-400">${w}</span>`;
      else out += `<span class="text-zinc-300">${w}</span>`;
    } else if (m[5]) out += m[5];
    else if (m[6]) out += `<span class="text-zinc-400">${esc(m[6])}</span>`;
  }
  return out;
}

const codeBlockVariants = cva("code-block min-w-0 w-full overflow-hidden bg-zinc-950", {
  variants: {
    spacing: {
      default: "my-[18px] rounded-xl border border-zinc-200 dark:border-zinc-800",
      none: "my-0",
    },
    embedded: {
      true: "rounded-none border-0 border-t border-white/[0.07]",
      false: "rounded-xl border border-zinc-200 dark:border-zinc-800",
    },
  },
  defaultVariants: {
    spacing: "default",
    embedded: false,
  },
});

const tabVariants = cva(
  "code-block-tab relative -mb-px shrink-0 border-b-2 px-3 pb-2.5 pt-3 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100",
  {
    variants: {
      state: {
        active: "border-indigo-400 text-[#f0f1f4]",
        inactive: "border-transparent text-[#7d8089] hover:text-[#c9ccd3]",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  },
);

const CopyIcon = () => (
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
);
const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export type CodeTab = { label: string; lang?: string; code: string };

export type CodeBlockProps = {
  tabs?: CodeTab[];
  code?: string;
  lang?: string;
  label?: string;
  className?: string;
  showStyleTabs?: boolean;
  styleTabsEnabled?: boolean;
  onStyleTabsEnabledChange?: (on: boolean) => void;
} & VariantProps<typeof codeBlockVariants>;

export function CodeBlock({
  tabs,
  code,
  lang,
  label,
  className,
  spacing,
  embedded,
  showStyleTabs = false,
  styleTabsEnabled = true,
  onStyleTabsEnabledChange,
}: CodeBlockProps) {
  const allTabs = useMemo<CodeTab[]>(
    () => tabs ?? [{ label: label || lang || "code", lang: lang ?? "", code: code ?? "" }],
    [tabs, label, lang, code],
  );

  const visibleTabs = useMemo(() => {
    if (!showStyleTabs || styleTabsEnabled) return allTabs;
    return allTabs.filter((t) => t.label === "Unstyled");
  }, [allTabs, showStyleTabs, styleTabsEnabled]);

  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const safeActive = Math.min(active, Math.max(0, visibleTabs.length - 1));
  const cur = visibleTabs[safeActive] ?? visibleTabs[0]!;

  const tabId = (i: number) => `code-tab-${i}`;

  const copy = () => {
    navigator.clipboard?.writeText(cur.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const STYLED_TAB_LABELS = new Set(["CSS", "Tailwind", "Panda CSS"]);
  const hasStyleTabs = allTabs.some((t) => STYLED_TAB_LABELS.has(t.label));

  return (
    <div className={cn(codeBlockVariants({ spacing, embedded }), className)}>
      <div
        role="tablist"
        aria-label="Code example"
        className="code-block-toolbar flex min-w-0 items-end gap-0.5 overflow-x-auto border-b border-white/[0.07] px-1"
      >
        {visibleTabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={tabId(i)}
            aria-selected={i === safeActive}
            aria-controls={`${tabId(i)}-panel`}
            data-state={i === safeActive ? "active" : "inactive"}
            onClick={() => setActive(i)}
            className={tabVariants({ state: i === safeActive ? "active" : "inactive" })}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-2 pb-1.5 pr-2">
          {showStyleTabs && hasStyleTabs && onStyleTabsEnabledChange && (
            <button
              type="button"
              role="switch"
              aria-checked={styleTabsEnabled}
              onClick={() => onStyleTabsEnabledChange(!styleTabsEnabled)}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-[12px] text-[#7d8089] transition-colors hover:text-[#c9ccd3]"
            >
              <span>Styled</span>
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  styleTabsEnabled ? "bg-zinc-100/30" : "bg-white/[0.08]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform ${
                    styleTabsEnabled ? "translate-x-4 bg-zinc-100" : "bg-[#7d8089]"
                  }`}
                />
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code"
            className="grid min-h-9 min-w-9 place-items-center rounded-md text-[#7d8089] transition-colors hover:bg-white/[0.06] hover:text-[#f0f1f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
      {visibleTabs.map((t, i) => (
        <pre
          key={t.label}
          id={`${tabId(i)}-panel`}
          role="tabpanel"
          aria-labelledby={tabId(i)}
          hidden={i !== safeActive}
          className="code-panel-body m-0 overflow-x-auto px-4 py-4 font-mono whitespace-pre text-[#e4e6eb] sm:px-5 sm:py-5"
        >
          <code
            className="block max-w-full min-w-0 text-[13px] leading-[1.6]"
            dangerouslySetInnerHTML={{ __html: highlight(t.code.trim(), t.lang) }}
          />
        </pre>
      ))}
    </div>
  );
}
