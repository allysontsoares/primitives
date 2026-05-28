"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface TouchHeader {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headers, setHeaders] = useState<TouchHeader[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // 1. Query all section headings inside the article
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3");
    const parsedHeaders: TouchHeader[] = [];

    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      // Ensure element has an ID, generate one if missing
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        el.id = id;
      }

      parsedHeaders.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeaders(parsedHeaders);

    // 2. Setup IntersectionObserver to trace which section is active
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]);

  if (headers.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 font-display select-none">
        On this page
      </p>
      <ul className="space-y-2.5 text-xs text-zinc-450">
        {/* Top Link */}
        <li>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`hover:text-white transition-colors text-left ${
              activeId === "" ? "text-white font-medium" : ""
            }`}
          >
            (Top)
          </button>
        </li>

        {headers.map((header) => {
          const active = activeId === header.id;
          return (
            <li
              key={header.id}
              style={{ paddingLeft: header.level === 3 ? "12px" : "0px" }}
            >
              <a
                href={`#${header.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(header.id);
                  if (target) {
                    const headerOffset = 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`block hover:text-white transition-colors leading-relaxed ${
                  active ? "text-white font-semibold" : ""
                }`}
              >
                {header.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
