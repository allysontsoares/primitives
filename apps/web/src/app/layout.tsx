import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kenos.at5.dev"),
  title: {
    default: "kenos — Unstyled React primitives",
    template: "%s · kenos",
  },
  description:
    "The space before design. Composable, accessible and unstyled React primitives. Start with structure. Finish with style.",
  keywords: [
    "kenos ui",
    "headless react",
    "unstyled components",
    "react datepicker",
    "accessible primitives",
    "composable ui",
  ],
  openGraph: {
    title: "kenos — Unstyled React primitives",
    description:
      "The space before design. Composable, accessible and unstyled React primitives.",
    type: "website",
    siteName: "kenos",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "kenos — The space before design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "kenos — Unstyled React primitives",
    description:
      "The space before design. Composable, accessible and unstyled React primitives.",
    images: ["/twitter-image"],
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem("kenos-theme")||localStorage.getItem("torq-theme")||localStorage.getItem("kairo-theme")||"dark";var el=document.documentElement;el.setAttribute("data-theme",t);if(t==="dark")el.classList.add("dark");else el.classList.remove("dark");if(!localStorage.getItem("kenos-theme")&&(localStorage.getItem("torq-theme")||localStorage.getItem("kairo-theme")))localStorage.setItem("kenos-theme",t);}catch(e){var el=document.documentElement;el.setAttribute("data-theme","dark");el.classList.add("dark");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={cn(geistSans.variable, geistMono.variable, "dark font-sans", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}