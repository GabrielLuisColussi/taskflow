import { cn } from "../../lib/utils/cn";

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none transition focus:border-zinc-600 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}