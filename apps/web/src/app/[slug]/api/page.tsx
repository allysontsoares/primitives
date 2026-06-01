import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPONENTS, COMPONENT_ROUTES } from "../../../lib/docs-data";
import { ApiPage } from "../../../components/docs/pages";

export function generateStaticParams() {
  return COMPONENT_ROUTES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPONENTS[slug];
  if (comp) return { title: `${comp.name} API` };
  return {};
}

export default async function ApiRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!COMPONENTS[slug]) notFound();
  return <ApiPage slug={slug} />;
}
