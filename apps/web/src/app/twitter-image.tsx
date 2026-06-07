import { ImageResponse } from "next/og";
import { OG_SIZE, OgBrandImage } from "@/lib/og-brand-image";

export const alt = "kenos — The space before design";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<OgBrandImage />, { ...size });
}