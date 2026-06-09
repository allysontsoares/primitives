import Link from "next/link";

export default function DocsNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-6xl font-bold text-zinc-400 dark:text-zinc-500">404</p>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Page not found</h1>
      <div className="flex gap-4 text-sm">
        <Link href="/docs" className="text-zinc-500 hover:underline">
          Docs overview
        </Link>
        <Link href="/" className="text-zinc-500 hover:underline">
          Home
        </Link>
      </div>
    </div>
  );
}
