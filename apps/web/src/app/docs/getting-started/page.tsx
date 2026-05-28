import type { Metadata } from "next";
import { loadMDX } from "../../../lib/mdx";

export const metadata: Metadata = {
  title: "Getting Started",
  description: "Learn how to build accessible, unstyled date pickers with Kairo.",
};

export default async function GettingStartedPage() {
  const { content } = await loadMDX("docs/getting-started");
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {content}
    </div>
  );
}
