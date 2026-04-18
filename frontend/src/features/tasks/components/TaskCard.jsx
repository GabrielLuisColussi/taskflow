import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Circle,
  CircleCheckBig,
  EllipsisVertical,
  Flag,
  PencilLine,
  Star,
  Trash2,
} from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  formatTaskDate,
  formatTaskPriority,
  formatTaskStatus,
  isTaskOverdue,
} from "../../../lib/formatters/tasks";

function getPriorityVariant(priority) {
  if (priority === "alta") return "danger";
  if (priority === "media") return "warning";
  return "info";
}

function getStatusVariant(status) {
  if (status === "concluida") return "success";
  if (status === "em_andamento") return "info";
  return "neutral";
}

function ActionsMenu({ task, onEdit, onToggleStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Abrir ações de ${task.title}`}
        title="Ações"
      >
        <EllipsisVertical size={16} />
      </Button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-52 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit(task);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            <PencilLine size={15} />
            Editar tarefa
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onToggleStatus(task);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
          >
            <Check size={15} />
            {task.status === "concluida" ? "Reabrir tarefa" : "Marcar como concluída"}
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete(task);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-200 transition hover:bg-rose-500/10"
          >
            <Trash2 size={15} />
            Excluir tarefa
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function TaskCard({
  task,
  isUpdating,
  onEdit,
  onToggleStatus,
  onDelete,
  onToggleFavorite,
  compact = false,
}) {
  const overdue = isTaskOverdue(task.due_date, task.status);
  const meta = task._meta || { favorite: false, tags: [], checklist: [] };
  const doneCount = meta.checklist.filter((item) => item.done).length;

  return (
    <article
      className={`animate-fade-up-soft rounded-3xl border border-zinc-800 bg-zinc-900/80 transition hover:border-zinc-700 hover:bg-zinc-900 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="mt-1 shrink-0 text-zinc-500">
              {task.status === "concluida" ? (
                <CircleCheckBig size={18} />
              ) : (
                <Circle size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold tracking-tight text-zinc-100">
                      {task.title}
                    </h3>

                    {meta.favorite ? (
                      <Star size={16} className="fill-amber-300 text-amber-300" />
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {formatTaskStatus(task.status)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge variant={getPriorityVariant(task.priority)}>
                  <Flag size={12} />
                  {formatTaskPriority(task.priority)}
                </Badge>

                <Badge variant={getStatusVariant(task.status)}>
                  {formatTaskStatus(task.status)}
                </Badge>

                <Badge variant={overdue ? "danger" : "neutral"}>
                  <CalendarDays size={12} />
                  {formatTaskDate(task.due_date)}
                </Badge>

                {meta.checklist.length > 0 ? (
                  <Badge variant="neutral">
                    Checklist {doneCount}/{meta.checklist.length}
                  </Badge>
                ) : null}
              </div>

              {meta.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {meta.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-xs text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}

                  {meta.tags.length > 3 ? (
                    <span className="rounded-full border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-xs text-zinc-500">
                      +{meta.tags.length - 3}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {task.description ? (
                compact ? (
                  <p className="mt-3 truncate text-sm text-zinc-400">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">
                    {task.description}
                  </p>
                )
              ) : (
                <p className="mt-4 text-sm text-zinc-500">Sem descrição adicionada.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 xl:justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(task.id)}
            aria-label={meta.favorite ? "Remover favorito" : "Favoritar tarefa"}
            title={meta.favorite ? "Remover favorito" : "Favoritar"}
          >
            <Star size={16} className={meta.favorite ? "fill-amber-300 text-amber-300" : ""} />
          </Button>

          <Button
            variant={task.status === "concluida" ? "secondary" : "primary"}
            size="sm"
            loading={isUpdating}
            onClick={() => onToggleStatus(task)}
          >
            <Check size={14} />
            {task.status === "concluida" ? "Reabrir" : "Concluir"}
          </Button>

          <ActionsMenu
            task={task}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        </div>
      </div>
    </article>
  );
}