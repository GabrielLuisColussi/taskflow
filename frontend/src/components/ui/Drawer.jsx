import { X } from "lucide-react";

export default function Drawer({ open, title, description, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in-soft">
      <button
        type="button"
        aria-label="Fechar painel"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-fade-up-soft absolute right-0 top-0 h-full w-full max-w-xl border-l border-zinc-800 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100%-88px)] overflow-y-auto px-6 py-6">{children}</div>
      </aside>
    </div>
  );
}