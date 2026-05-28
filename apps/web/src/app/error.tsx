"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-zinc-700">500</p>
      <h1 className="text-2xl font-semibold text-zinc-200">Something went wrong</h1>
      <button
        onClick={reset}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
