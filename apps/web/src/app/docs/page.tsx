import type { Metadata } from "next";
import { loadMDX } from "../../lib/mdx";

export const metadata: Metadata = {
  title: "Overview",
  description: "Introduction to Kairo — unstyled, accessible React date picker primitives.",
};

export default async function DocsOverviewPage() {
  const { content } = await loadMDX("docs/overview");
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {content}
    </div>
  );
}
