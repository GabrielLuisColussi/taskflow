import { CalendarClock, CheckCircle2, TimerReset } from "lucide-react";
import Button from "../../../components/ui/Button";
import { formatTaskDate } from "../../../lib/formatters/tasks";

function FocusColumn({ icon: Icon, title, subtitle, count, tasks, actionLabel, onAction }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-300">
            <Icon size={18} />
          </div>

          <div>
            <h3 className="text-base font-semibold tracking-tight text-zinc-100">{title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          </div>
        </div>

        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-300">
          {count}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
              <p className="truncate text-sm font-medium text-zinc-100">{task.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{formatTaskDate(task.due_date)}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 px-4 py-5 text-sm text-zinc-500">
            Nenhuma tarefa relevante nesta visão.
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default function FocusBoard({ todayTasks, overdueTasks, doneTasks, onOpenView }) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <FocusColumn
        icon={CalendarClock}
        title="Hoje"
        subtitle="Itens que vencem hoje e pedem atenção imediata."
        count={todayTasks.length}
        tasks={todayTasks.slice(0, 3)}
        actionLabel="Abrir visão de hoje"
        onAction={() => onOpenView("today")}
      />

      <FocusColumn
        icon={TimerReset}
        title="Atrasadas"
        subtitle="Itens fora do prazo que precisam ser retomados."
        count={overdueTasks.length}
        tasks={overdueTasks.slice(0, 3)}
        actionLabel="Abrir atrasadas"
        onAction={() => onOpenView("overdue")}
      />

      <FocusColumn
        icon={CheckCircle2}
        title="Concluídas"
        subtitle="Entrega recente para leitura rápida do progresso."
        count={doneTasks.length}
        tasks={doneTasks.slice(0, 3)}
        actionLabel="Abrir concluídas"
        onAction={() => onOpenView("done")}
      />
    </section>
  );
}