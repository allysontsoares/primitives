import { cn } from "@/lib/utils";

export const docsTableClass =
  "my-4 w-full border-collapse text-[13.5px] [&_th]:border-b [&_th]:border-zinc-200 dark:[&_th]:border-zinc-800 [&_th]:px-3.5 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:tracking-wide [&_th]:uppercase [&_th]:text-zinc-500 dark:[&_th]:text-zinc-400 [&_td]:border-b [&_td]:border-zinc-200 dark:[&_td]:border-zinc-800 [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:align-top [&_td]:text-zinc-600 dark:[&_td]:text-zinc-300 [&_td:first-child]:font-mono [&_td:first-child]:whitespace-nowrap [&_td:first-child]:text-zinc-900 dark:[&_td:first-child]:text-zinc-100";

export function DocsProse({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "prose prose-zinc mb-5 max-w-none dark:prose-invert",
        "prose-p:text-zinc-600 dark:prose-p:text-zinc-300",
        "prose-li:text-zinc-600 dark:prose-li:text-zinc-300",
        "prose-a:text-zinc-900 dark:prose-a:text-zinc-100 prose-a:underline prose-a:decoration-zinc-300 dark:prose-a:decoration-zinc-600 prose-a:underline-offset-[3px]",
        "hover:prose-a:text-indigo-700 dark:text-zinc-300 hover:prose-a:decoration-indigo-500 dark:hover:prose-a:text-indigo-400 dark:hover:prose-a:decoration-indigo-400",
        "prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100",
        "prose-code:rounded-md prose-code:bg-zinc-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.86em] prose-code:font-medium prose-code:text-zinc-800 dark:text-zinc-200 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-300/15 dark:prose-code:text-zinc-300",
        className,
      )}
      {...props}
    />
  );
}
