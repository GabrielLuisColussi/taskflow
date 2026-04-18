import { ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils/cn";

function toDateKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildDays() {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
}

export default function DeadlineCalendar({ tasks, selectedDate, onSelectDate }) {
  const days = buildDays();

  function getCountForDate(dateKey) {
    return tasks.filter((task) => task.due_date === dateKey).length;
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-100">Calendário básico de prazos</p>
          <p className="mt-1 text-sm text-zinc-400">
            Veja rapidamente os vencimentos dos próximos 7 dias.
          </p>
        </div>

        {selectedDate ? (
          <button
            type="button"
            onClick={() => onSelectDate("")}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-zinc-100"
          >
            Limpar data
            <ChevronRight size={14} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {days.map((date) => {
          const dateKey = toDateKey(date);
          const count = getCountForDate(dateKey);
          const isSelected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(isSelected ? "" : dateKey)}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition",
                isSelected
                  ? "border-zinc-100 bg-zinc-100 text-zinc-950"
                  : "border-zinc-800 bg-zinc-950/50 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-950"
              )}
            >
              <p className={cn("text-xs uppercase tracking-[0.18em]", isSelected ? "text-zinc-700" : "text-zinc-500")}>
                {date.toLocaleDateString("pt-BR", { weekday: "short" })}
              </p>
              <p className="mt-2 text-xl font-semibold">
                {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
              </p>
              <p className={cn("mt-1 text-xs", isSelected ? "text-zinc-700" : "text-zinc-500")}>
                {date.toLocaleDateString("pt-BR", { month: "short" })}
              </p>
              <p className={cn("mt-3 text-sm font-medium", isSelected ? "text-zinc-900" : "text-zinc-300")}>
                {count} prazo{count === 1 ? "" : "s"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}