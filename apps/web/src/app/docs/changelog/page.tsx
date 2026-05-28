import type { Metadata } from "next";
import { loadMDX } from "../../../lib/mdx";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Recent updates, fixes, and changes to the @at5/kairo package.",
};

export default async function ChangelogPage() {
  const { content } = await loadMDX("docs/changelog");
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {content}
    </div>
  );
}
