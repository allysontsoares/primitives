import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-6xl font-bold text-faint">404</p>
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <Link href="/" className="text-sm text-accent hover:underline">
        Go home
      </Link>
    </div>
  );
}
