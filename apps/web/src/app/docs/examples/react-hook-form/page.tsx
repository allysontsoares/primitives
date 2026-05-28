import type { Metadata } from "next";
import { loadMDX } from "../../../../lib/mdx";
import { InteractiveRHFForm } from "../../../../components/InteractiveRHFForm";

export const metadata: Metadata = {
  title: "React Hook Form · Examples",
  description: "Learn how to integrate Kairo with React Hook Form and Zod.",
};

export default async function ReactHookFormPage() {
  const { content } = await loadMDX("docs/examples/react-hook-form");
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        {content}
      </div>
      <div className="border-t border-zinc-900 pt-10">
        <h2 className="text-xl font-bold text-white mb-2 font-display">Interactive Demonstration</h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Try out the live, validated form below. Enter your name and pick a date. If the date is in the past, or if the name field is empty, Zod will return an immediate screen-reader friendly alert.
        </p>
        <InteractiveRHFForm />
      </div>
    </div>
  );
}
