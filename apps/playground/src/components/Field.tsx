import React from "react";
import { DatePicker } from "@at5/kairo";

interface FieldProps {
  label: string;
  index?: 0 | 1;
}

export function Field({ label, index }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <DatePicker.Label className="text-xs font-medium text-zinc-400">{label}</DatePicker.Label>
      <div className="flex items-center gap-2">
        <DatePicker.Input
          {...(index !== undefined ? { index } : {})}
          className="inline-flex min-w-[9.5rem] items-center gap-0.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm
            focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/40
            [&_[role=spinbutton]]:rounded [&_[role=spinbutton]]:px-0.5 [&_[role=spinbutton]]:outline-none
            [&_[role=spinbutton]:focus]:bg-blue-900/60 [&_[role=spinbutton]:focus]:text-blue-200
            [&_[data-placeholder]]:text-zinc-500
            [&_[data-separator]]:text-zinc-500"
        />
        <DatePicker.Trigger className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-base text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="2" y="3" width="12" height="11" rx="2" />
            <path d="M5 1v3M11 1v3M2 7h12" />
          </svg>
        </DatePicker.Trigger>
      </div>
    </div>
  );
}
