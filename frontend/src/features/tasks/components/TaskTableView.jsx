import { Check, PencilLine, Star, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
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

export default function TaskTableView({
  tasks,
  isUpdating,
  onEdit,
  onToggleStatus,
  onDelete,
  onToggleFavorite,
}) {
  return (
    <div className="animate-fade-up-soft overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/80">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/40">
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Tarefa
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Prioridade
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                Prazo
              </th>
              <th className="px-5 py-4 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => {
              const overdue = isTaskOverdue(task.due_date, task.status);
              const meta = task._meta || { favorite: false, tags: [], checklist: [] };
              const doneCount = meta.checklist.filter((item) => item.done).length;

              return (
                <tr
                  key={task.id}
                  className="border-b border-zinc-800/80 transition hover:bg-zinc-950/35"
                >
                  <td className="px-5 py-4 align-top">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-100">{task.title}</p>
                        {meta.favorite ? (
                          <Star size={14} className="fill-amber-300 text-amber-300" />
                        ) : null}
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                        {task.description || "Sem descrição adicionada."}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {meta.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-zinc-800 bg-zinc-950/70 px-2 py-0.5 text-xs text-zinc-400"
                          >
                            #{tag}
                          </span>
                        ))}

                        {meta.checklist.length > 0 ? (
                          <span className="rounded-full border border-zinc-800 bg-zinc-950/70 px-2 py-0.5 text-xs text-zinc-500">
                            Checklist {doneCount}/{meta.checklist.length}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {formatTaskPriority(task.priority)}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <Badge variant={getStatusVariant(task.status)}>
                      {formatTaskStatus(task.status)}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <Badge variant={overdue ? "danger" : "neutral"}>
                      {formatTaskDate(task.due_date)}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFavorite(task.id)}
                        aria-label={meta.favorite ? "Remover favorito" : "Favoritar tarefa"}
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

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(task)}
                        aria-label={`Editar ${task.title}`}
                      >
                        <PencilLine size={16} />
                      </Button>

                      <Button
                        variant="danger"
                        size="icon"
                        onClick={() => onDelete(task)}
                        aria-label={`Excluir ${task.title}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}