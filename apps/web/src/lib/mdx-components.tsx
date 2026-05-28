import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { LivePreview } from "../components/LivePreview";
import { PropTable, PropRow } from "../components/PropTable";
import { AttributeTable, AttributeRow } from "../components/AttributeTable";

export type MDXComponents = Record<string, ComponentType<any>>;

export const mdxComponents: MDXComponents = {
  LivePreview,
  PropTable,
  PropRow,
  AttributeTable,
  AttributeRow,
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-6 text-[32px] font-bold tracking-tight text-white font-display border-b border-zinc-900 pb-4" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-12 mb-4 text-[20px] font-bold text-white font-display" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-2.5 text-[15px] font-bold text-zinc-200 font-display" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 text-[13.5px] leading-relaxed text-zinc-400 font-sans" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="font-medium text-blue-400/90 underline-offset-4 hover:underline transition-colors" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-zinc-900 border border-zinc-800/80 px-1.5 py-0.5 font-mono text-[11.5px] text-zinc-200"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-5 overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-[11.5px] leading-relaxed text-zinc-300 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit [&>code]:border-0 custom-scrollbar"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc pl-6 space-y-1.5 text-[13px] text-zinc-400" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal pl-6 space-y-1.5 text-[13px] text-zinc-400" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  hr: () => <hr className="my-8 border-zinc-800" />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-4 border-l-4 border-blue-500 pl-4 italic text-zinc-400" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="border border-zinc-800 bg-zinc-900 px-4 py-2 text-left font-semibold text-zinc-300" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-zinc-800 px-4 py-2 text-zinc-400" {...props} />
  ),
};
