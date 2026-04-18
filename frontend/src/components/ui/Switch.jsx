import { cn } from "../../lib/utils/cn";

export default function Switch({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-left transition hover:border-zinc-700"
    >
      <div>
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
        ) : null}
      </div>

      <span
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 rounded-full transition",
          checked ? "bg-white" : "bg-zinc-700"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-zinc-950 transition",
            checked ? "left-6" : "left-1"
          )}
        />
      </span>
    </button>
  );
}