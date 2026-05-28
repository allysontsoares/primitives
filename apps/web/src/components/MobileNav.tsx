"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DocsNav } from "./DocsNav";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer automatically when the route/hash changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button for Mobile navigation */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-100 shadow-xl backdrop-blur hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-transform duration-200 active:scale-95"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Drawer Content */}
      <div
        className={`fixed inset-y-0 left-0 z-45 w-[280px] bg-zinc-950/95 border-r border-zinc-900 shadow-2xl p-6 lg:hidden transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 font-semibold text-zinc-100 mb-8 pb-4 border-b border-zinc-900">
            <span className="text-blue-400">◆</span> Kairo Primitives
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <DocsNav />
          </div>
        </div>
      </div>
    </>
  );
}
