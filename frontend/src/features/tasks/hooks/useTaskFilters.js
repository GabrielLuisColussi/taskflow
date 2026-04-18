import { useEffect, useMemo, useState } from "react";
import { isTaskDueToday, isTaskOverdue } from "../../../lib/formatters/tasks";
import { getWorkspaceSettings } from "../../../lib/utils/workspace-settings";

const STORAGE_KEY = "taskflow_task_filters_v1";

const priorityRank = {
  alta: 3,
  media: 2,
  baixa: 1,
};

function sortTasks(tasks, sortBy) {
  const items = [...tasks];

  switch (sortBy) {
    case "due_asc":
      return items.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });

    case "due_desc":
      return items.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(b.due_date) - new Date(a.due_date);
      });

    case "priority_desc":
      return items.sort(
        (a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
      );

    case "alphabetical":
      return items.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

    default:
      return items.sort((a, b) => Number(b.id) - Number(a.id));
  }
}

function getStoredFilters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useTaskFilters() {
  const stored = getStoredFilters();
  const workspaceSettings = getWorkspaceSettings();

  const [searchInput, setSearchInput] = useState(stored?.searchInput || "");
  const [debouncedSearch, setDebouncedSearch] = useState(stored?.searchInput || "");
  const [status, setStatus] = useState(stored?.status || "");
  const [priority, setPriority] = useState(stored?.priority || "");
  const [view, setView] = useState(stored?.view || "all");
  const [sortBy, setSortBy] = useState(stored?.sortBy || "due_asc");
  const [displayMode, setDisplayMode] = useState(
    stored?.displayMode || workspaceSettings.defaultDisplayMode || "cards"
  );
  const [dateFocus, setDateFocus] = useState(stored?.dateFocus || "");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const payload = {
      searchInput,
      status,
      priority,
      view,
      sortBy,
      displayMode,
      dateFocus,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [searchInput, status, priority, view, sortBy, displayMode, dateFocus]);

  function clearFilters() {
    setSearchInput("");
    setDebouncedSearch("");
    setStatus("");
    setPriority("");
    setView("all");
    setSortBy("due_asc");
    setDateFocus("");
  }

  const apiFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      priority: priority || undefined,
    }),
    [debouncedSearch, priority, status]
  );

  function applyViewFilters(tasks) {
    let next = [...tasks];

    switch (view) {
      case "today":
        next = next.filter((task) => isTaskDueToday(task.due_date));
        break;
      case "pending":
        next = next.filter((task) => task.status === "pendente");
        break;
      case "in_progress":
        next = next.filter((task) => task.status === "em_andamento");
        break;
      case "done":
        next = next.filter((task) => task.status === "concluida");
        break;
      case "overdue":
        next = next.filter((task) => isTaskOverdue(task.due_date, task.status));
        break;
      default:
        break;
    }

    if (dateFocus) {
      next = next.filter((task) => task.due_date === dateFocus);
    }

    return sortTasks(next, sortBy);
  }

  return {
    searchInput,
    setSearchInput,
    status,
    setStatus,
    priority,
    setPriority,
    view,
    setView,
    sortBy,
    setSortBy,
    displayMode,
    setDisplayMode,
    dateFocus,
    setDateFocus,
    apiFilters,
    clearFilters,
    applyViewFilters,
  };
}