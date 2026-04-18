import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
  isLoading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-in-soft">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Fechar confirmação"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-fade-up-soft absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
      >
        <h3 className="text-xl font-semibold tracking-tight text-zinc-100">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}