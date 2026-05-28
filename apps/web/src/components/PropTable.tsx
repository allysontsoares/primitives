"use client";

import { useState } from "react";

interface PropTableProps {
  children: React.ReactNode;
}

export function PropTable({ children }: PropTableProps) {
  return (
    <div className="my-6 w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950/60 font-semibold text-zinc-400 select-none">
            <th className="px-4 py-2.5 font-display font-semibold tracking-wide text-xs w-[25%]">Prop</th>
            <th className="px-4 py-2.5 font-display font-semibold tracking-wide text-xs w-[50%]">Type</th>
            <th className="px-4 py-2.5 font-display font-semibold tracking-wide text-xs w-[20%]">Default</th>
            <th className="px-4 py-2.5 w-[5%]"></th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface PropRowProps {
  name: string;
  type: string;
  defaultValue?: string;
  children: React.ReactNode;
}

export function PropRow({ name, type, defaultValue = "—", children }: PropRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine standard type colors based on common formats
  const getTypeColor = (t: string) => {
    if (t === "boolean") return "text-red-400 bg-red-950/20 border-red-900/30";
    if (t === "string") return "text-blue-400 bg-blue-950/20 border-blue-900/30";
    if (t.includes("function") || t.includes("=>")) return "text-amber-400 bg-amber-950/20 border-amber-900/30";
    return "text-purple-400 bg-purple-950/20 border-purple-900/30";
  };

  return (
    <>
      {/* Primary Row */}
      <tr
        onClick={() => setIsOpen(!isOpen)}
        className={`group border-b border-zinc-900/80 hover:bg-zinc-900/25 cursor-pointer select-none transition-colors duration-150 ${
          isOpen ? "bg-zinc-900/10" : ""
        }`}
      >
        {/* Name */}
        <td className="px-4 py-3 font-mono text-[12px] font-medium text-blue-400/90 tracking-tight">
          {name}
        </td>
        
        {/* Type badge */}
        <td className="px-4 py-3 font-mono text-[11px] tracking-tight">
          <span className={`inline-block rounded-md border px-1.5 py-0.5 ${getTypeColor(type)}`}>
            {type}
          </span>
        </td>

        {/* Default value */}
        <td className="px-4 py-3 font-mono text-[11px] text-zinc-450">
          {defaultValue}
        </td>

        {/* Interactive Chevron Trigger */}
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            className="flex items-center justify-center text-zinc-550 group-hover:text-zinc-300 transition-colors p-1"
            aria-label={isOpen ? "Collapse prop details" : "Expand prop details"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </td>
      </tr>

      {/* Expandable Details Row */}
      {isOpen && (
        <tr className="border-b border-zinc-900/80 bg-zinc-950/15">
          <td colSpan={4} className="px-6 py-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/30">
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 select-text">
              {children}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
