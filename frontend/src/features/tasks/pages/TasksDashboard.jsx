import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../../../layouts/AppShell";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import StatCard from "../../../components/ui/StatCard";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Toast from "../../../components/ui/Toast";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useTasksQuery } from "../hooks/useTasksQuery";
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useTaskLocalMeta } from "../hooks/useTaskLocalMeta";
import TaskToolbar from "../components/TaskToolbar";
import TaskDrawer from "../components/TaskDrawer";
import TaskList from "../components/TaskList";
import ActiveFiltersBar from "../components/ActiveFiltersBar";
import FocusBoard from "../components/FocusBoard";
import ProductivityInsights from "../components/ProductivityInsights";
import DeadlineCalendar from "../components/DeadlineCalendar";
import { isTaskDueToday, isTaskOverdue } from "../../../lib/formatters/tasks";
import { clearUserSession, getStoredUser } from "../../../lib/utils/auth-user";
import { getWorkspaceSettings } from "../../../lib/utils/workspace-settings";

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

const allowedViews = ["all", "today", "overdue", "done", "pending", "in_progress"];

export default function TasksDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useTaskFilters();
  const { tasks, isLoading } = useTasksQuery(filters.apiFilters);
  const { createMutation, updateMutation, statusMutation, deleteMutation } =
    useTaskMutations();
  const taskLocalMeta = useTaskLocalMeta();

  const [drawerMode, setDrawerMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    message: "",
  });

  const user = useMemo(() => getStoredUser(), []);
  const workspaceSettings = useMemo(() => getWorkspaceSettings(), []);

  useEffect(() => {
    if (!toast.open) return;

    const timeout = window.setTimeout(() => {
      setToast((current) => ({ ...current, open: false }));
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const currentView = searchParams.get("view");
    const resolvedView = allowedViews.includes(currentView) ? currentView : "all";

    if (filters.view !== resolvedView) {
      filters.setView(resolvedView);
    }
  }, [searchParams, filters.view, filters.setView]);

  const filteredTasks = useMemo(
    () => filters.applyViewFilters(tasks),
    [filters, tasks]
  );

  const filteredTasksWithMeta = useMemo(
    () =>
      filteredTasks.map((task) => ({
        ...task,
        _meta: taskLocalMeta.getMeta(task.id),
      })),
    [filteredTasks, taskLocalMeta.metaMap, taskLocalMeta.getMeta]
  );

  const todayTasks = useMemo(
    () => tasks.filter((task) => isTaskDueToday(task.due_date) && task.status !== "concluida"),
    [tasks]
  );

  const overdueTasks = useMemo(
    () => tasks.filter((task) => isTaskOverdue(task.due_date, task.status)),
    [tasks]
  );

  const doneTasks = useMemo(
    () => tasks.filter((task) => task.status === "concluida"),
    [tasks]
  );

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((doneTasks.length / tasks.length) * 100);
  }, [tasks.length, doneTasks.length]);

  const activeItems = useMemo(
    () => tasks.filter((task) => task.status !== "concluida").length,
    [tasks]
  );

  const criticalItems = todayTasks.length + overdueTasks.length;

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === "pendente").length;
    const inProgress = tasks.filter(
      (task) => task.status === "em_andamento"
    ).length;
    const done = doneTasks.length;
    const overdue = overdueTasks.length;

    return { total, pending, inProgress, done, overdue };
  }, [tasks, doneTasks.length, overdueTasks.length]);

  function showToast(type, message) {
    setToast({ open: true, type, message });
  }

  function setDashboardView(nextView) {
    filters.setView(nextView);

    if (!nextView || nextView === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ view: nextView });
  }

  function openCreateDrawer() {
    setDrawerMode("create");
    setSelectedTask(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(task) {
    setDrawerMode("edit");
    setSelectedTask(task);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setSelectedTask(null);
  }

  async function handleDrawerSubmit(payload) {
    try {
      if (drawerMode === "edit" && selectedTask) {
        await updateMutation.mutateAsync({ id: selectedTask.id, payload });
        closeDrawer();
        showToast("success", "Tarefa atualizada com sucesso.");
        return;
      }

      const { status: _status, ...createPayload } = payload;
      await createMutation.mutateAsync(createPayload);
      closeDrawer();
      showToast("success", "Tarefa criada com sucesso.");
    } catch (error) {
      showToast("error", getErrorMessage(error, "Não foi possível salvar a tarefa."));
    }
  }

  async function handleToggleStatus(task) {
    try {
      const nextStatus = task.status === "concluida" ? "pendente" : "concluida";
      await statusMutation.mutateAsync({ id: task.id, status: nextStatus });

      showToast(
        "success",
        nextStatus === "concluida"
          ? "Tarefa concluída com sucesso."
          : "Tarefa reaberta com sucesso."
      );
    } catch (error) {
      showToast("error", getErrorMessage(error, "Não foi possível alterar o status."));
    }
  }

  function handleAskDelete(task) {
    setTaskToDelete(task);
  }

  async function handleConfirmDelete() {
    if (!taskToDelete) return;

    try {
      await deleteMutation.mutateAsync(taskToDelete.id);
      showToast("success", "Tarefa removida com sucesso.");
      setTaskToDelete(null);
    } catch (error) {
      showToast("error", getErrorMessage(error, "Não foi possível excluir a tarefa."));
    }
  }

  function handleLogout() {
    clearUserSession();
    navigate("/login", { replace: true });
  }

  function handleSidebarNavigation(key) {
    if (key === "settings") {
      navigate("/settings");
      return;
    }

    if (key === "today") {
      setDashboardView("today");
      return;
    }

    if (key === "overdue") {
      setDashboardView("overdue");
      return;
    }

    setDashboardView("all");
  }

  function handleOpenFocusView(view) {
    setDashboardView(view);
  }

  const hasActiveFilters = Boolean(
    filters.searchInput ||
      filters.status ||
      filters.priority ||
      filters.view !== "all" ||
      filters.dateFocus
  );

  const activeSidebarKey =
    filters.view === "today"
      ? "today"
      : filters.view === "overdue"
      ? "overdue"
      : "tasks";

  const isSubmittingDrawer =
    createMutation.isPending || updateMutation.isPending;

  const selectedTaskMeta = selectedTask ? taskLocalMeta.getMeta(selectedTask.id) : undefined;

  return (
    <>
      <AppShell
        activeKey={activeSidebarKey}
        onNavigate={handleSidebarNavigation}
        onLogout={handleLogout}
        user={user}
        workspaceName={workspaceSettings.workspaceName}
      >
        <header className="border-b border-zinc-800/80 bg-zinc-950/80 px-4 py-5 backdrop-blur md:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                Painel principal
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {workspaceSettings.workspaceName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Uma dashboard focada em leitura rápida, controle do fluxo e operação diária sem excesso de blocos competindo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:min-w-[520px] xl:justify-end">
              <div className="relative flex-1 xl:max-w-sm">
                <label htmlFor="task-search" className="sr-only">
                  Buscar tarefas
                </label>
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <Input
                  id="task-search"
                  className="pl-11"
                  placeholder="Buscar tarefas"
                  value={filters.searchInput}
                  onChange={(event) => filters.setSearchInput(event.target.value)}
                />
              </div>

              <Button onClick={openCreateDrawer}>
                <Plus size={16} />
                Nova tarefa
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
            <StatCard label="Total" value={stats.total} hint="todas as tarefas" />
            <StatCard label="Pendentes" value={stats.pending} hint="aguardando ação" />
            <StatCard label="Em andamento" value={stats.inProgress} hint="em execução" />
            <StatCard label="Concluídas" value={stats.done} hint="finalizadas" />
            <StatCard label="Atrasadas" value={stats.overdue} hint="pedem atenção" />
          </section>

          <section className="mt-6">
            <ProductivityInsights
              completionRate={completionRate}
              activeItems={activeItems}
              criticalItems={criticalItems}
            />
          </section>

          <section className="mt-6">
            <DeadlineCalendar
              tasks={tasks}
              selectedDate={filters.dateFocus}
              onSelectDate={filters.setDateFocus}
            />
          </section>

          {workspaceSettings.showFocusBoard ? (
            <section className="mt-6">
              <FocusBoard
                todayTasks={todayTasks}
                overdueTasks={overdueTasks}
                doneTasks={doneTasks}
                onOpenView={handleOpenFocusView}
              />
            </section>
          ) : null}

          <section className="mt-6">
            <TaskToolbar
              filters={filters}
              resultCount={filteredTasksWithMeta.length}
              onCreate={openCreateDrawer}
            />
            <ActiveFiltersBar filters={filters} />
          </section>

          <section className="mt-6">
            <TaskList
              tasks={filteredTasksWithMeta}
              isLoading={isLoading}
              isFiltering={hasActiveFilters}
              isUpdating={statusMutation.isPending}
              displayMode={filters.displayMode}
              compactCards={workspaceSettings.compactCards}
              onCreate={openCreateDrawer}
              onClearFilters={filters.clearFilters}
              onEdit={openEditDrawer}
              onToggleStatus={handleToggleStatus}
              onDelete={handleAskDelete}
              onToggleFavorite={taskLocalMeta.toggleFavorite}
            />
          </section>
        </main>

        <TaskDrawer
          open={drawerOpen}
          mode={drawerMode}
          task={selectedTask}
          meta={selectedTaskMeta}
          isSubmitting={isSubmittingDrawer}
          onClose={closeDrawer}
          onSubmit={handleDrawerSubmit}
          onMetaChange={taskLocalMeta.updateMeta}
          onToggleFavorite={taskLocalMeta.toggleFavorite}
        />
      </AppShell>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Excluir tarefa"
        description={
          taskToDelete
            ? `Tem certeza que deseja excluir "${taskToDelete.title}"? Essa ação não poderá ser desfeita.`
            : ""
        }
        confirmLabel="Excluir tarefa"
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      <Toast open={toast.open} type={toast.type} message={toast.message} />
    </>
  );
}