import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
  updateTask,
} from "../api/tasks";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => listTasks(),
  });

  const tasks = useMemo(() => data?.data ?? [], [data]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [msg, setMsg] = useState("");

  // Modal edição
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("media");
  const [editStatus, setEditStatus] = useState("pendente");

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
    window.location.href = "/login";
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
    });
  }

  function openEdit(t) {
    setEditId(t.id);
    setEditTitle(t.title || "");
    setEditDescription(t.description || "");
    setEditPriority(t.priority || "media");
    setEditStatus(t.status || "pendente");
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
      },
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Minhas tarefas</h1>
        <button className="rounded-xl bg-zinc-800 px-4 py-2" onClick={handleLogout}>
          Sair
        </button>
      </div>

      {/* Form criar tarefa */}
      <form
        onSubmit={handleCreate}
        className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none md:col-span-1"
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 p-3 outline-none md:col-span-1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-xl bg-white text-zinc-950 p-3 font-semibold md:col-span-1 disabled:opacity-60"
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

      {/* Lista */}
      {isLoading ? (
        <p className="mt-6 text-zinc-400">Carregando...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.length === 0 && (
            <p className="text-zinc-400">Nenhuma tarefa ainda. Crie a primeira!</p>
          )}

          {tasks.map((t) => (
            <div key={t.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{t.title}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs rounded-full bg-zinc-800 px-3 py-1">
                      {t.priority}
                    </span>
                    <span className="text-xs rounded-full bg-zinc-800 px-3 py-1">
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl bg-zinc-800 px-3 py-2 text-sm disabled:opacity-60"
                    onClick={() => openEdit(t)}
                  >
                    Editar
                  </button>

                  {t.status !== "concluida" ? (
                    <button
                      className="rounded-xl bg-white text-zinc-950 px-3 py-2 text-sm font-semibold disabled:opacity-60"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ id: t.id, status: "concluida" })
                      }
                    >
                      Concluir
                    </button>
                  ) : (
                    <button
                      className="rounded-xl bg-zinc-800 px-3 py-2 text-sm disabled:opacity-60"
                      disabled={statusMutation.isPending}
                      onClick={() =>
                        statusMutation.mutate({ id: t.id, status: "pendente" })
                      }
                    >
                      Reabrir
                    </button>
                  )}

                  <button
                    className="rounded-xl bg-zinc-800 px-3 py-2 text-sm disabled:opacity-60"
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

              {t.description && <p className="text-zinc-400 mt-2">{t.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Modal editar */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeEdit}
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Editar tarefa</h2>
              <button className="rounded-xl bg-zinc-800 px-3 py-2 text-sm" onClick={closeEdit}>
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

              <div className="grid gap-3 md:grid-cols-2">
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
    </div>
  );
}
