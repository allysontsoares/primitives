import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-bold tracking-tight text-white font-display">
          <span className="text-blue-500 font-bold">◆</span> Kairo
        </Link>
        
        <nav className="flex items-center gap-6 text-[13px] text-zinc-400">
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          
          <a
            href="https://github.com/allysonsoares/primitives"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>

          {/* Elegant Search Pill - Vercel style */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-500 cursor-not-allowed select-none">
            <span>Search docs</span>
            <kbd className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 font-mono">
              Ctrl K
            </kbd>
          </div>
        </nav>
      </div>
    </header>
  );
}
