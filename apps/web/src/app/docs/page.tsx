import { Overview } from "@/components/docs/pages";
import type { Metadata } from "next";

const title = "Overview";
const description =
  "The space before design. Composable, accessible and unstyled React primitives. Start with structure. Finish with style.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} · kenos UI`,
    description,
    type: "website",
    siteName: "kenos UI",
  },
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsOverviewPage() {
  return <Overview />;
}
