import type { Metadata } from "next";
import { LandingComponentShowcase } from "@/components/landing/component-showcase";
import { LandingCtaFooter } from "@/components/landing/cta-footer";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingStats } from "@/components/landing/stats";

const title = "kenos — Unstyled React primitives";
const description =
  "The space before design. Composable, accessible and unstyled React primitives for date UI. Start with structure. Finish with style.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "kenos",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="landing-page min-h-screen bg-[#09090b] text-zinc-100">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingComponentShowcase />
      <LandingStats />
      <LandingCtaFooter />
    </div>
  );
}