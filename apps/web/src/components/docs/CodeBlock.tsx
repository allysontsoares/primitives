"use client";

import { useState } from "react";

/* ---------- tiny syntax highlighter (jsx / bash / css) ---------- */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function", "return", "if", "else",
  "for", "while", "new", "await", "async", "typeof", "interface", "type", "extends", "implements",
  "as", "of", "in", "true", "false", "null", "undefined", "void", "class", "this",
]);

export function highlight(code: string, lang = ""): string {
  if (lang === "bash" || lang === "sh") {
    return code
      .split("\n")
      .map((line) => {
        if (/^\s*#/.test(line)) return `<span class="tok-com">${esc(line)}</span>`;
        const m = line.match(/^(\s*)(\S+)(.*)$/);
        if (!m) return esc(line);
        return `${m[1]}<span class="tok-fn">${esc(m[2] ?? "")}</span><span class="tok-punc">${esc(m[3] ?? "")}</span>`;
      })
      .join("\n");
  }
  let out = "";
  const tokenRe =
    /(\/\/[^\n]*)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\sA-Za-z0-9_$])/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(code))) {
    if (m[1]) out += `<span class="tok-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tok-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tok-num">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      const after = code.slice(tokenRe.lastIndex).match(/^\s*\(/);
      if (KW.has(w)) out += `<span class="tok-key">${w}</span>`;
      else if (/^[A-Z]/.test(w)) out += `<span class="tok-tag">${w}</span>`;
      else if (after) out += `<span class="tok-fn">${w}</span>`;
      else out += w;
    } else if (m[5]) out += m[5];
    else if (m[6]) out += `<span class="tok-punc">${esc(m[6])}</span>`;
  }
  return out;
}

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export type CodeTab = { label: string; lang?: string; code: string };

export function CodeBlock({ tabs, code, lang, label }: { tabs?: CodeTab[]; code?: string; lang?: string; label?: string }) {
  const resolved: CodeTab[] = tabs ?? [{ label: label || lang || "code", lang: lang ?? "", code: code ?? "" }];
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const cur = resolved[active] ?? resolved[0]!;

  const copy = () => {
    navigator.clipboard?.writeText(cur.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="my-[18px] overflow-hidden rounded-card border border-line bg-code-bg">
      <div className="flex items-center gap-1 border-b border-white/[0.07] px-3.5 pt-2">
        {resolved.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative -bottom-px rounded-t-[7px] border-b-2 px-2.5 py-1.5 text-[12.5px] transition-colors ${
              i === active
                ? "border-accent text-[#f0f1f4]"
                : "border-transparent text-[#7d8089] hover:text-[#c9ccd3]"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={copy}
          aria-label="Copy code"
          className="ml-auto rounded-md p-1.5 text-[#7d8089] transition-colors hover:bg-white/[0.06] hover:text-[#f0f1f4]"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-[18px]">
        <code
          className="font-mono text-[13px] leading-[1.7] text-code-fg"
          dangerouslySetInnerHTML={{ __html: highlight(cur.code.trim(), cur.lang) }}
        />
      </pre>
    </div>
  );
}
