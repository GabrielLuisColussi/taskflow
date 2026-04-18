import EmptyState from "../../../components/ui/EmptyState";
import TaskCard from "./TaskCard";
import TaskTableView from "./TaskTableView";

export default function TaskList({
  tasks,
  isLoading,
  isFiltering,
  isUpdating,
  displayMode,
  compactCards,
  onCreate,
  onClearFilters,
  onEdit,
  onToggleStatus,
  onDelete,
  onToggleFavorite,
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/70"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return isFiltering ? (
      <EmptyState
        title="Nenhum resultado encontrado"
        description="Os filtros ativos não retornaram tarefas. Limpe os filtros ou ajuste a busca para ampliar os resultados."
        actionLabel="Limpar filtros"
        onAction={onClearFilters}
      />
    ) : (
      <EmptyState
        title="Você ainda não criou tarefas"
        description="Comece pela primeira tarefa para transformar esta dashboard em um painel de acompanhamento real."
        actionLabel="Criar primeira tarefa"
        onAction={onCreate}
      />
    );
  }

  if (displayMode === "table") {
    return (
      <TaskTableView
        tasks={tasks}
        isUpdating={isUpdating}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isUpdating={isUpdating}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          compact={compactCards}
        />
      ))}
    </div>
  );
}