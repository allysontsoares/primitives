"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    title: "Introduction",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Getting started" },
      { href: "/docs/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/docs/api", label: "API Reference" },
    ],
  },
  {
    title: "Examples",
    links: [
      { href: "/docs/examples/react-hook-form", label: "React Hook Form" },
      { href: "/docs/examples/tanstack-form", label: "TanStack Form" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {nav.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-display select-none">
            {section.title}
          </p>
          <ul className="space-y-1.5">
            {section.links.map((link) => {
              const active = pathname === link.href || (link.href.includes("#") && pathname === link.href.split("#")[0]);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block border-l-2 py-1 pl-3 text-[12.5px] transition-all duration-150 ${
                      active
                        ? "border-blue-500 text-white font-semibold bg-zinc-950/20"
                        : "border-transparent text-zinc-450 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
