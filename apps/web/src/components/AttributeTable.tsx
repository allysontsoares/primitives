import React from "react";

interface AttributeTableProps {
  children: React.ReactNode;
}

export function AttributeTable({ children }: AttributeTableProps) {
  return (
    <div className="my-5 w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/20">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-zinc-900 bg-zinc-950/40 font-semibold text-zinc-400 select-none">
            <th className="px-4 py-2 font-display font-semibold tracking-wide text-[11px] w-[35%]">Attribute</th>
            <th className="px-4 py-2 font-display font-semibold tracking-wide text-[11px] w-[65%]">Description</th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

interface AttributeRowProps {
  name: string;
  description: string;
}

export function AttributeRow({ name, description }: AttributeRowProps) {
  return (
    <tr className="border-b border-zinc-900/60 hover:bg-zinc-900/10 transition-colors">
      <td className="px-4 py-2.5 font-mono text-[11.5px] text-zinc-350 font-medium tracking-tight">
        {name}
      </td>
      <td className="px-4 py-2.5 text-zinc-400 leading-normal">
        {description}
      </td>
    </tr>
  );
}
