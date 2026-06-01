"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-mono text-6xl font-bold text-faint">500</p>
      <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
      <button
        onClick={reset}
        className="rounded-lg border border-line-strong px-4 py-2 text-sm text-ink2 transition-colors hover:bg-hover hover:text-ink"
      >
        Try again
      </button>
    </div>
  );
}
