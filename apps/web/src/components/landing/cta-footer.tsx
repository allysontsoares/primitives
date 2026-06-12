"use client";

import { KenosMark } from "@/components/docs/kenos-mark";
import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "./navbar";

const NPM_PACKAGE = "https://www.npmjs.com/package/@kenos-ui/react-datepicker";
const GITHUB_PACKAGE = "https://github.com/allysontsoares/kenos-ui/tree/main/packages/datepicker";

const FOOTER_LINKS = {
  Docs: [
    { label: "Date Picker", href: "/docs/date-picker" },
    { label: "Installation", href: "/docs/installation" },
    { label: "Changelog", href: "/docs/changelog" },
  ],
  Package: [
    { label: "npm", href: NPM_PACKAGE },
    { label: "GitHub", href: GITHUB_PACKAGE },
    { label: "README", href: `${GITHUB_PACKAGE}#readme` },
  ],
};

export function LandingCtaFooter() {
  return (
    <>
      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-[1200px] border-x border-white/[0.07]">
          <div className="border-b border-white/[0.07] px-6 py-8">
            <p className="kenos-landing-label">{"// 03 — get started"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[
              {
                tag: "INSTALL",
                title: "npm install @kenos-ui/react-datepicker",
                desc: "React 19+, Node 22+. Zero default CSS — style every DatePicker.* part yourself.",
                href: "/docs/installation",
              },
              {
                tag: "REFERENCE",
                title: "Compound API and anatomy",
                desc: "Every DatePicker.* part, props, data attributes, and live demos documented.",
                href: "/docs/date-picker",
              },
            ].map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group p-8 transition-colors hover:bg-zinc-900 ${i === 0 ? "border-b border-white/[0.07] md:border-b-0 md:border-r" : ""}`}
              >
                <span className="font-mono text-[11px] font-semibold text-zinc-400">
                  {"// "}
                  {item.tag}
                </span>
                <h3 className="mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07]">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden border-x border-white/[0.07]">
          <Image src="/streak-purple.png" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#09090b]/40" />

          <div className="relative flex flex-col items-center px-6 py-20 text-center">
            <span className="mb-8 text-zinc-100">
              <KenosMark size={56} strokeWidth={2} />
            </span>
            <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight md:text-5xl">
              Ship date UI with structure — <span className="text-zinc-500">not overrides.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-500 md:text-lg">
              Install from npm, read the docs, and compose scheduling primitives that respect
              locale, keyboard, and screen readers out of the box.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/docs/date-picker"
                className="kenos-cta hover:shadow-[0_0_30px_rgb(99_102_241/0.4)]"
              >
                Explore DatePicker
              </Link>
              <a
                href={NPM_PACKAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-white/[0.07] px-6 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:border-white/20 hover:bg-zinc-900"
              >
                View on npm
              </a>
              <a
                href={GITHUB_PACKAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-white/[0.07] px-6 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:border-white/20 hover:bg-zinc-900"
              >
                <GithubIcon className="h-4 w-4" />
                Source
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-[1200px] border-x border-white/[0.07]">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 border-b border-white/[0.07] p-8 md:col-span-1 md:border-b-0 md:border-r">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-zinc-100">
                  <KenosMark size={24} strokeWidth={2.5} />
                </span>
                <span className="font-bold text-zinc-100">kenos</span>
              </div>
              <p className="mb-4 font-mono text-xs leading-relaxed text-zinc-500">
                @kenos-ui/react-datepicker — headless date primitives for React.
              </p>
              <div className="flex gap-4">
                <a
                  href={GITHUB_PACKAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a
                  href={NPM_PACKAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="npm"
                  className="text-zinc-500 transition-colors hover:text-zinc-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                  </svg>
                </a>
              </div>
            </div>

            {Object.entries(FOOTER_LINKS).map(([section, links], i) => (
              <div
                key={section}
                className={`border-b border-white/[0.07] p-8 md:border-b-0 ${i < 1 ? "border-r" : ""}`}
              >
                <p className="mb-4 font-mono text-[11px] uppercase tracking-wide text-zinc-500">
                  {section}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] px-8 py-6 sm:flex-row">
            <p className="font-mono text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} Kenos UI — MIT licensed.
            </p>
            <Link
              href="/docs/date-picker"
              className="font-mono text-xs text-zinc-500 transition-colors hover:text-indigo-400"
            >
              DatePicker docs →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
