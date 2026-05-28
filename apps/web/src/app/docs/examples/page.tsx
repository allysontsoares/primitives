import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Form Integrations · Examples",
  description: "Learn how to integrate Kairo with React Hook Form, TanStack Form, and Zod.",
};

export default function ExamplesPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white font-display border-b border-zinc-900 pb-4">
          Form Integrations
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Kairo's headless date picker is completely unstyled and state-agnostic, making it incredibly straightforward to integrate with standard React form ecosystems. Select a guide below to explore step-by-step integrations with validation and interactive live playgrounds.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mt-8">
        {/* React Hook Form Card */}
        <Link
          href="/docs/examples/react-hook-form"
          className="group relative flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-200 shadow-xl overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-600/10 transition-colors" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/5 px-2.5 py-1 rounded-full border border-blue-500/10">
                React Hook Form
              </span>
              <span className="text-xs text-zinc-650 font-mono">01</span>
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 font-display group-hover:text-blue-400 transition-colors">
              React Hook Form + Zod
            </h2>
            <p className="text-xs text-zinc-450 leading-relaxed mb-6">
              Learn how to bind DatePicker states to controllers, wire up native and schema validation using Zod, and handle dynamic validation warnings with screen-reader friendly aria tags.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
            <span>Open integration guide</span>
            <span className="transition-transform group-hover:translate-x-1 duration-150">→</span>
          </div>
        </Link>

        {/* TanStack Form Card */}
        <Link
          href="/docs/examples/tanstack-form"
          className="group relative flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950/40 p-6 hover:border-zinc-800 hover:bg-zinc-900/10 transition-all duration-200 shadow-xl overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-600/10 transition-colors" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-full border border-indigo-500/10">
                TanStack Form
              </span>
              <span className="text-xs text-zinc-650 font-mono">02</span>
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 font-display group-hover:text-indigo-400 transition-colors">
              TanStack Form + Zod
            </h2>
            <p className="text-xs text-zinc-450 leading-relaxed mb-6">
              Create highly reactive, type-safe date forms utilizing TanStack's granular state subscription model and schema verification triggers. Includes live weekday constraints.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
            <span>Open integration guide</span>
            <span className="transition-transform group-hover:translate-x-1 duration-150">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
