import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  COMPONENTS,
  COMPONENT_ROUTES,
  GUIDE_ROUTES,
  isSoonRoute,
  titleForRoute,
} from "@/lib/docs-data";
import { ComponentPage } from "@/components/docs/pages";
import { DatePickerPage } from "@/components/docs/date-picker-page";
import { Installation, QuickStart, Changelog } from "@/components/docs/guides";

const GUIDES: Record<string, () => React.ReactElement> = {
  installation: Installation,
  quickstart: QuickStart,
  changelog: Changelog,
};

export function generateStaticParams() {
  return [...GUIDE_ROUTES, ...COMPONENT_ROUTES].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPONENTS[slug];
  if (comp) return { title: comp.name, description: comp.desc };
  if (GUIDES[slug]) return { title: titleForRoute(slug) };
  return {};
}

export default async function DocsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (isSoonRoute(slug)) notFound();
  if (slug === "date-picker") return <DatePickerPage />;
  if (COMPONENTS[slug]) return <ComponentPage slug={slug} />;
  const Guide = GUIDES[slug];
  if (Guide) return <Guide />;
  notFound();
}
