import type { Metadata } from "next";
import { loadMDX } from "../../../lib/mdx";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Complete API specification for Kairo date picker primitives.",
};

export default async function ApiReferencePage() {
  const { content } = await loadMDX("docs/date-picker");
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {content}
    </div>
  );
}
