import { DocsNav } from "../../components/DocsNav";
import { MobileNav } from "../../components/MobileNav";
import { TableOfContents } from "../../components/TableOfContents";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 py-12 relative">
      {/* 1. Left Sidebar Navigation */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <DocsNav />
        </div>
      </aside>

      {/* 2. Centered Main Content Area */}
      <main className="min-w-0 flex-1 xl:max-w-3xl">
        <article className="prose-custom max-w-none">{children}</article>
      </main>

      {/* 3. Right Table of Contents (Desktop only) */}
      <aside className="hidden w-52 shrink-0 xl:block">
        <div className="sticky top-24">
          <TableOfContents />
        </div>
      </aside>

      <MobileNav />
    </div>
  );
}
