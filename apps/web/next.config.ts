import type { NextConfig } from "next";
import path from "path";

const DOC_SLUGS = [
  "installation",
  "quickstart",
  "changelog",
  "localization",
  "accessibility",
  "styling",
  "calendar",
  "date-picker",
  "date-range-picker",
  "date-field",
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  async redirects() {
    return DOC_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/docs/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
