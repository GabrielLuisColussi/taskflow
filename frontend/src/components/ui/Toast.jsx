import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils/cn";

const styles = {
  success: {
    wrapper: "border-emerald-500/20 bg-emerald-500/10 text-emerald-100",
    icon: CheckCircle2,
  },
  error: {
    wrapper: "border-rose-500/20 bg-rose-500/10 text-rose-100",
    icon: AlertCircle,
  },
  info: {
    wrapper: "border-sky-500/20 bg-sky-500/10 text-sky-100",
    icon: Info,
  },
};

export default function Toast({ open, type = "info", message }) {
  if (!open || !message) return null;

  const config = styles[type] || styles.info;
  const Icon = config.icon;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 top-4 z-[70] w-[92%] max-w-sm animate-fade-up-soft"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur",
          config.wrapper
        )}
      >
        <Icon size={18} className="mt-0.5 shrink-0" />
        <p className="text-sm leading-6">{message}</p>
      </div>
    </div>
  );
}