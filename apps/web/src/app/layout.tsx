import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DocsShell } from "../components/docs/Shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kairo.at5.dev"),
  title: {
    default: "Kairo — Headless date primitives for React",
    template: "%s · Kairo",
  },
  description:
    "A composable React library for date and scheduling UI. Zero CSS, no styling opinions, built on the WAI-ARIA grid pattern.",
  keywords: ["react", "date picker", "calendar", "headless ui", "accessibility", "WAI-ARIA", "kairo"],
  openGraph: {
    title: "Kairo — Headless date primitives for React",
    description:
      "A composable React library for date and scheduling UI. Zero CSS, no styling opinions, built on the WAI-ARIA grid pattern.",
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("kairo-theme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <DocsShell>{children}</DocsShell>
      </body>
    </html>
  );
}
