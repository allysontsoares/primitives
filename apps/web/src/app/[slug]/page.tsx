import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPONENTS, COMPONENT_ROUTES, GUIDE_ROUTES, titleForRoute } from "../../lib/docs-data";
import { ComponentPage } from "../../components/docs/pages";
import {
  Installation,
  QuickStart,
  Localization,
  Accessibility,
  Styling,
  Changelog,
} from "../../components/docs/guides";

const GUIDES: Record<string, () => React.ReactElement> = {
  installation: Installation,
  quickstart: QuickStart,
  localization: Localization,
  accessibility: Accessibility,
  styling: Styling,
  changelog: Changelog,
};

export function generateStaticParams() {
  return [...GUIDE_ROUTES, ...COMPONENT_ROUTES].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPONENTS[slug];
  if (comp) return { title: comp.name, description: comp.desc };
  if (GUIDES[slug]) return { title: titleForRoute(slug) };
  return {};
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (COMPONENTS[slug]) return <ComponentPage slug={slug} />;
  const Guide = GUIDES[slug];
  if (Guide) return <Guide />;
  notFound();
}
