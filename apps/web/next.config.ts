import type { NextConfig } from "next";
import path from "path";

const DOC_SLUGS = ["installation", "quickstart", "changelog", "date-picker", "select", "combobox"];

const LEGACY_DATEPICKER_REDIRECTS: { slug: string; hash: string }[] = [
  { slug: "calendar", hash: "composables" },
  { slug: "date-range-picker", hash: "range" },
  { slug: "date-field", hash: "composables" },
  { slug: "localization", hash: "localization" },
  { slug: "accessibility", hash: "accessibility" },
  { slug: "styling", hash: "default" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  async redirects() {
    const shortRedirects = DOC_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/docs/${slug}`,
      permanent: true,
    }));

    const legacyRedirects = LEGACY_DATEPICKER_REDIRECTS.flatMap(({ slug, hash }) => [
      {
        source: `/${slug}`,
        destination: `/docs/date-picker#${hash}`,
        permanent: true,
      },
      {
        source: `/docs/${slug}`,
        destination: `/docs/date-picker#${hash}`,
        permanent: true,
      },
    ]);

    return [...shortRedirects, ...legacyRedirects];
  },
};

export default nextConfig;
