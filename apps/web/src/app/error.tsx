"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-6xl font-bold text-zinc-400 dark:text-zinc-500">500</p>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h1>
      <button
        onClick={reset}
        className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        Try again
      </button>
    </div>
  );
}
