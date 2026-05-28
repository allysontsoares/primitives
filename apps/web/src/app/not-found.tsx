import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-zinc-700">404</p>
      <h1 className="text-2xl font-semibold text-zinc-200">Page not found</h1>
      <Link href="/" className="text-sm text-blue-400 hover:underline">
        Go home
      </Link>
    </main>
  );
}
