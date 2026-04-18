import { cn } from "../../lib/utils/cn";

const variants = {
  neutral: "border-zinc-800 bg-zinc-900 text-zinc-300",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  info: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  danger: "border-rose-500/20 bg-rose-500/10 text-rose-200",
};

export default function Badge({ className, variant = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}