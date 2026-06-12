import { LandingComponentShowcase } from "@/components/landing/component-showcase";
import { LandingCtaFooter } from "@/components/landing/cta-footer";
import { LandingFeatures } from "@/components/landing/features";
import { LandingHero } from "@/components/landing/hero";
import { LandingNavbar } from "@/components/landing/navbar";
import type { Metadata } from "next";

const title = "kenos UI - Headless primitives";
const description =
  "Headless date & scheduling primitives for React. Single, range, and multiple selection with segmented inputs, Intl locales, and WAI-ARIA — fully unstyled.";

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
      {/*<LandingStats />*/}
      <LandingCtaFooter />
    </div>
  );
}
