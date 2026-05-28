import type { Metadata } from "next";
import { loadMDX } from "../../../../lib/mdx";
import { InteractiveTanStackForm } from "../../../../components/InteractiveTanStackForm";

export const metadata: Metadata = {
  title: "TanStack Form · Examples",
  description: "Learn how to integrate Kairo with TanStack Form and Zod.",
};

export default async function TanStackFormPage() {
  const { content } = await loadMDX("docs/examples/tanstack-form");
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        {content}
      </div>
      <div className="border-t border-zinc-900 pt-10">
        <h2 className="text-xl font-bold text-white mb-2 font-display">Interactive Demonstration</h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Try out the live, validated form below. It utilizes TanStack Form's high performance state subscribers and Zod schemas. This demo restricts selection strictly to weekdays (Mon-Fri) — select a weekend date to view the real-time validator.
        </p>
        <InteractiveTanStackForm />
      </div>
    </div>
  );
}
