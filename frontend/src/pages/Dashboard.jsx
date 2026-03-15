import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Filter,
  User,
  LogOut,
  CalendarDays,
  Flag,
  CircleDashed,
} from "lucide-react";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  updateTaskStatus,
} from "../api/tasks";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // filtros
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // criar
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [dueDate, setDueDate] = useState("");
  const [msg, setMsg] = useState("");

  // editar
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("media");
  const [editStatus, setEditStatus] = useState("pendente");
  const [editDueDate, setEditDueDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", search, filterStatus, filterPriority],
    queryFn: () =>
      listTasks({
        search: search || undefined,
        status: filterStatus || undefined,
        priority: filterPriority || undefined,
      }),
  });

  const tasks = useMemo(() => data?.data ?? [], [data]);

  const createMutation = useMutation({
    mutationFn: (payload) => createTask(payload),
    onSuccess: async (res) => {
      if (!res.success) {
        setMsg(res.message || "Erro ao criar tarefa");
        return;
      }

      setMsg("Tarefa criada ✅");
      setTitle("");
      setDescription("");
      setPriority("media");
      setDueDate("");

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTimeout(() => setMsg(""), 1500);
    },
    onError: () => setMsg("Erro ao criar tarefa"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: async (res) => {
      if (!res.success) {
        setMsg(res.message || "Erro ao atualizar tarefa");
        return;
      }

      setMsg("Tarefa atualizada ✅");
      setIsEditOpen(false);
      setEditId(null);

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTimeout(() => setMsg(""), 1500);
    },
    onError: () => setMsg("Erro ao atualizar tarefa"),
  });

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleCreate(e) {
    e.preventDefault();
    setMsg("");

    if (!title.trim()) {
      setMsg("Título é obrigatório");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || null,
    });
  }

  function openEdit(t) {
    setEditId(t.id);
    setEditTitle(t.title || "");
    setEditDescription(t.description || "");
    setEditPriority(t.priority || "media");
    setEditStatus(t.status || "pendente");
    setEditDueDate(t.due_date || "");
    setIsEditOpen(true);
  }

  function closeEdit() {
    setIsEditOpen(false);
    setEditId(null);
  }

  function handleUpdate(e) {
    e.preventDefault();
    setMsg("");

    if (!editTitle.trim()) {
      setMsg("Título é obrigatório");
      return;
    }

    updateMutation.mutate({
      id: editId,
      payload: {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        priority: editPriority,
        status: editStatus,
        due_date: editDueDate || null,
      },
    });
  }

  function clearFilters() {
    setSearch("");
    setFilterStatus("");
    setFilterPriority("");
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case "concluida":
        return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
      case "em_andamento":
        return "bg-sky-500/15 text-sky-300 border border-sky-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
  }

  function getPriorityBadgeClass(priority) {
    switch (priority) {
      case "alta":
        return "bg-rose-500/15 text-rose-300 border border-rose-500/20";
      case "media":
        return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
      default:
        return "bg-teal-500/15 text-teal-300 border border-teal-500/20";
    }
  }

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "pendente").length;
  const inProgressTasks = tasks.filter((t) => t.status === "em_andamento").length;
  const doneTasks = tasks.filter((t) => t.status === "concluida").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:flex flex-col border-r border-zinc-800 bg-zinc-900/80 p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Seu painel de produtividade
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            <a
              href="#dashboard-top"
              className="flex w-full items-center gap-3 rounded-xl bg-zinc-800 px-4 py-3 text-left text-sm font-medium"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <a
              href="#tasks-section"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 transition"
            >
              <CheckSquare size={18} />
              Tarefas
            </a>

            <a
              href="#filters-section"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 transition"
            >
              <Filter size={18} />
              Filtros
            </a>

            <a
              href="#account-section"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100 transition"
            >
              <User size={18} />
              Conta
            </a>
          </nav>

          <div className="mt-auto rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4">
            <p className="text-sm font-medium">Projeto pessoal</p>
            <p className="mt-1 text-xs text-zinc-400">
              React + PHP + MySQL + Tailwind
            </p>
          </div>
        </aside>

        <main className="p-6 lg:p-8">
          <section
            id="dashboard-top"
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Dashboard
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Minhas tarefas
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Organize, acompanhe e conclua suas atividades com clareza.
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sair
            </button>
          </section>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-sm">
              <p className="text-sm text-zinc-400">Total</p>
              <h2 className="mt-3 text-3xl font-bold">{totalTasks}</h2>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-sm">
              <p className="text-sm text-zinc-400">Pendentes</p>
              <h2 className="mt-3 text-3xl font-bold">{pendingTasks}</h2>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-sm">
              <p className="text-sm text-zinc-400">Em andamento</p>
              <h2 className="mt-3 text-3xl font-bold">{inProgressTasks}</h2>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-sm">
              <p className="text-sm text-zinc-400">Concluídas</p>
              <h2 className="mt-3 text-3xl font-bold">{doneTasks}</h2>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <input
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                placeholder="Título da tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>

              <input
                type="date"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-white text-zinc-950 p-3 font-semibold disabled:opacity-60"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Criando..." : "Criar tarefa"}
              </button>
            </div>

            <textarea
              className="mt-3 w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
              placeholder="Descrição (opcional)"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {msg && <p className="mt-3 text-sm text-zinc-300">{msg}</p>}
          </form>

          <section
            id="filters-section"
            className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <input
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none md:col-span-2"
                placeholder="Buscar por título ou descrição"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluída</option>
              </select>

              <select
                className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">Todas as prioridades</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition"
                onClick={clearFilters}
              >
                Limpar filtros
              </button>
            </div>
          </section>

          <section id="tasks-section" className="mt-6">
            {isLoading ? (
              <p className="text-zinc-400">Carregando...</p>
            ) : (
              <div className="space-y-3">
                {tasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900 p-8 text-center">
                    <p className="text-zinc-300 font-medium">
                      Nenhuma tarefa encontrada
                    </p>
                    <p className="mt-2 text-sm text-zinc-500">
                      Ajuste os filtros ou crie uma nova tarefa.
                    </p>
                  </div>
                )}

                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm transition hover:border-zinc-700 hover:bg-zinc-900/90"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{t.title}</div>

                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-2 text-xs rounded-full px-3 py-1 ${getPriorityBadgeClass(
                              t.priority
                            )}`}
                          >
                            <Flag size={12} />
                            {t.priority}
                          </span>

                          <span
                            className={`inline-flex items-center gap-2 text-xs rounded-full px-3 py-1 ${getStatusBadgeClass(
                              t.status
                            )}`}
                          >
                            <CircleDashed size={12} />
                            {t.status}
                          </span>

                          {t.due_date && (
                            <span className="inline-flex items-center gap-2 text-xs rounded-full bg-zinc-800 px-3 py-1 border border-zinc-700 text-zinc-300">
                              <CalendarDays size={12} />
                              {t.due_date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <button
                          className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700 transition"
                          onClick={() => openEdit(t)}
                        >
                          Editar
                        </button>

                        {t.status !== "concluida" ? (
                          <button
                            className="rounded-xl bg-white text-zinc-950 px-3 py-2 text-sm font-semibold disabled:opacity-60"
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              statusMutation.mutate({
                                id: t.id,
                                status: "concluida",
                              })
                            }
                          >
                            Concluir
                          </button>
                        ) : (
                          <button
                            className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700 transition disabled:opacity-60"
                            disabled={statusMutation.isPending}
                            onClick={() =>
                              statusMutation.mutate({
                                id: t.id,
                                status: "pendente",
                              })
                            }
                          >
                            Reabrir
                          </button>
                        )}

                        <button
                          className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700 transition disabled:opacity-60"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            const ok = confirm("Remover esta tarefa?");
                            if (ok) deleteMutation.mutate(t.id);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>

                    {t.description && (
                      <p className="mt-3 text-sm leading-6 text-zinc-400">
                        {t.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section
            id="account-section"
            className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <h3 className="text-lg font-semibold">Conta</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Área reservada para perfil, preferências e informações do usuário.
            </p>
          </section>

          {isEditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/60" onClick={closeEdit} />

              <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Editar tarefa</h2>
                  <button
                    className="rounded-xl bg-zinc-800 px-3 py-2 text-sm font-medium hover:bg-zinc-700 transition"
                    onClick={closeEdit}
                  >
                    Fechar
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="mt-4 space-y-3">
                  <input
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Título"
                  />

                  <textarea
                    className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Descrição"
                  />

                  <div className="grid gap-3 md:grid-cols-3">
                    <select
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>

                    <select
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluida">Concluída</option>
                    </select>

                    <input
                      type="date"
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-white text-zinc-950 p-3 font-semibold disabled:opacity-60"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}