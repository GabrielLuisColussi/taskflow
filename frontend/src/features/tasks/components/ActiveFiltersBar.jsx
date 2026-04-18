import { X } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  TASK_VIEWS,
} from "../../../lib/constants/task-options";

const sortLabels = {
  due_asc: "Prazo mais próximo",
  due_desc: "Prazo mais distante",
  priority_desc: "Maior prioridade",
  alphabetical: "Ordem alfabética",
  recent: "Mais recentes",
};

function getLabel(options, value) {
  return options.find((item) => item.value === value)?.label || value;
}

function getViewLabel(value) {
  return TASK_VIEWS.find((item) => item.key === value)?.label || value;
}

function formatFocusDate(value) {
  if (!value) return value;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function FilterChip({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
      <span className="text-zinc-500">{label}:</span>
      <span className="font-medium text-zinc-100">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100"
      >
        <X size={12} />
      </button>
    </span>
  );
}

export default function ActiveFiltersBar({ filters }) {
  const chips = [];

  if (filters.searchInput) {
    chips.push({
      key: "search",
      label: "Busca",
      value: filters.searchInput,
      onRemove: () => filters.setSearchInput(""),
    });
  }

  if (filters.status) {
    chips.push({
      key: "status",
      label: "Status",
      value: getLabel(TASK_STATUS_OPTIONS, filters.status),
      onRemove: () => filters.setStatus(""),
    });
  }

  if (filters.priority) {
    chips.push({
      key: "priority",
      label: "Prioridade",
      value: getLabel(TASK_PRIORITY_OPTIONS, filters.priority),
      onRemove: () => filters.setPriority(""),
    });
  }

  if (filters.view !== "all") {
    chips.push({
      key: "view",
      label: "Visão",
      value: getViewLabel(filters.view),
      onRemove: () => filters.setView("all"),
    });
  }

  if (filters.sortBy !== "due_asc") {
    chips.push({
      key: "sort",
      label: "Ordenação",
      value: sortLabels[filters.sortBy] || filters.sortBy,
      onRemove: () => filters.setSortBy("due_asc"),
    });
  }

  if (filters.dateFocus) {
    chips.push({
      key: "dateFocus",
      label: "Data",
      value: formatFocusDate(filters.dateFocus),
      onRemove: () => filters.setDateFocus(""),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <FilterChip
          key={chip.key}
          label={chip.label}
          value={chip.value}
          onRemove={chip.onRemove}
        />
      ))}

      <Button variant="ghost" size="sm" onClick={filters.clearFilters}>
        Limpar todos
      </Button>
    </div>
  );
}