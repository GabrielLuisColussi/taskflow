const STATUS_LABELS = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

const PRIORITY_LABELS = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export function formatTaskStatus(value) {
  return STATUS_LABELS[value] || value;
}

export function formatTaskPriority(value) {
  return PRIORITY_LABELS[value] || value;
}

export function formatTaskDate(value) {
  if (!value) return "Sem prazo";

  const dueDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(dueDate.getTime())) return value;

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diff = Math.round((dueOnly - todayOnly) / 86_400_000);

  if (diff === 0) return "Vence hoje";
  if (diff === 1) return "Vence amanhã";
  if (diff === -1) return "Venceu ontem";
  if (diff < 0) return `Atrasada há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? "s" : ""}`;

  return dueDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: dueDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export function isTaskDueToday(value) {
  if (!value) return false;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return value === `${yyyy}-${mm}-${dd}`;
}

export function isTaskOverdue(value, status) {
  if (!value || status === "concluida") return false;
  const dueDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return dueDate < todayOnly;
}