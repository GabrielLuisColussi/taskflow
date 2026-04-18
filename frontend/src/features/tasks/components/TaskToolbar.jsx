import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TASK_VIEWS,
} from "../../../lib/constants/task-options";
import DisplayModeToggle from "./DisplayModeToggle";

export default function TaskToolbar({ filters, resultCount, onCreate }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {TASK_VIEWS.map((item) => (
            <Button
              key={item.key}
              variant={filters.view === item.key ? "primary" : "secondary"}
              size="sm"
              onClick={() => filters.setView(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <DisplayModeToggle value={filters.displayMode} onChange={filters.setDisplayMode} />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[220px_220px_220px_1fr_auto]">
        <Select
          value={filters.status}
          onChange={(event) => filters.setStatus(event.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">Todos os status</option>
          {TASK_STATUS_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.priority}
          onChange={(event) => filters.setPriority(event.target.value)}
          aria-label="Filtrar por prioridade"
        >
          <option value="">Todas as prioridades</option>
          {TASK_PRIORITY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.sortBy}
          onChange={(event) => filters.setSortBy(event.target.value)}
          aria-label="Ordenar tarefas"
        >
          <option value="due_asc">Prazo mais próximo</option>
          <option value="due_desc">Prazo mais distante</option>
          <option value="priority_desc">Maior prioridade</option>
          <option value="alphabetical">Ordem alfabética</option>
          <option value="recent">Mais recentes</option>
        </Select>

        <div className="flex items-center text-sm text-zinc-400">
          <p>
            {resultCount} tarefa{resultCount === 1 ? "" : "s"} encontrada
            {resultCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex gap-2 xl:justify-end">
          <Button variant="secondary" onClick={filters.clearFilters}>
            Limpar
          </Button>
          <Button onClick={onCreate}>Nova tarefa</Button>
        </div>
      </div>
    </section>
  );
}